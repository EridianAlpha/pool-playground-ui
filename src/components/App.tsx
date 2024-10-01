import { useEffect, useState, useCallback } from "react"
import { VStack, Box, useColorModeValue } from "@chakra-ui/react"

import config from "../../public/data/config.json"

import Header from "./Header"
import Footer from "./Footer"
import ContentContainer from "./ContentContainer"

import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultConfig, darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { http, createConfig, WagmiProvider } from "wagmi"
import {
    // mainnet as wagmiEthMainnet,
    holesky as wagmiEthHolesky,
    base as wagmiBaseMainnet,
    anvil as wagmiAnvil,
    baseSepolia as wagmiBaseSepolia,
} from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const App = () => {
    const colorMode = useColorModeValue("light", "dark")
    const [useCustomRpc, setUseCustomRpc] = useState(false)
    const [customRpc, setCustomRpc] = useState("")
    const [isValidWalletConnectId, setIsValidWalletConnectId] = useState(false)
    const [wagmiProviderConfig, setWagmiProviderConfig] = useState(null)

    // Helper function to create default config, wrapped in useCallback
    const createWagmiProviderConfig = useCallback(() => {
        const customChainConfig = (chain) => ({
            ...chain,
            name: config.chains[chain.id].name,
            rpcUrls: {
                default: {
                    http: [customRpc || config.chains[chain.id].publicJsonRpc],
                },
            },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customChains: any = [
            // customChainConfig(wagmiEthMainnet),
            customChainConfig(wagmiBaseMainnet),
            customChainConfig(wagmiEthHolesky),
            customChainConfig(wagmiBaseSepolia),
        ]

        // Custom Transports
        const customTransports = {
            // [wagmiEthMainnet.id]: http(customRpc || config.chains[wagmiEthMainnet.id].publicJsonRpc),
            [wagmiBaseMainnet.id]: http(customRpc || config.chains[wagmiBaseMainnet.id].publicJsonRpc),
            [wagmiEthHolesky.id]: http(customRpc || config.chains[wagmiEthHolesky.id].publicJsonRpc),
            [wagmiBaseSepolia.id]: http(customRpc || config.chains[wagmiBaseSepolia.id].publicJsonRpc),
        }

        // Add Anvil chain if DEV_MODE_FLAG is set
        if (process.env.NEXT_PUBLIC_DEV_MODE_FLAG === "true") {
            customChains.push(customChainConfig(wagmiAnvil))
            customTransports[wagmiAnvil.id] = http(customRpc || config.chains[wagmiAnvil.id].publicJsonRpc)
        }

        const fallbackConfig = createConfig({
            chains: customChains,
            transports: customTransports,
        })

        if (config.walletconnectId) {
            // If WalletConnect ID exists check if it is valid
            if (isValidWalletConnectId) {
                // If it is valid, use the default config with WalletConnect
                // Note: Can only be created after confirming WalletConnectId
                // exists and is valid or else it will throw an error
                setWagmiProviderConfig(
                    getDefaultConfig({
                        appName: "Pool Playground",
                        projectId: config.walletconnectId,
                        chains: customChains,
                        ssr: true,
                    })
                )
            } else {
                // If it is not valid, use the fallback config
                setWagmiProviderConfig(fallbackConfig)
            }
        } else {
            // If no WalletConnect ID exists, use the fallback config
            setWagmiProviderConfig(fallbackConfig)
        }
    }, [customRpc, isValidWalletConnectId])

    useEffect(() => {
        if (config.walletconnectId) {
            fetch(`https://explorer-api.walletconnect.com/v3/wallets?projectId=${config.walletconnectId}`)
                .then((response) => {
                    if (response.ok) {
                        setIsValidWalletConnectId(true)
                    } else {
                        console.log("Invalid WalletConnect projectId:", config.walletconnectId)
                        setIsValidWalletConnectId(false)
                        createWagmiProviderConfig()
                    }
                })
                .catch((error) => {
                    console.error("Error fetching WalletConnect ID", error)
                    setIsValidWalletConnectId(false)
                    createWagmiProviderConfig()
                })
        }
    }, [createWagmiProviderConfig])

    // UseEffect - Recreate wagmiProviderConfig when isValidWalletConnectId changes to true
    useEffect(() => {
        if (isValidWalletConnectId) {
            createWagmiProviderConfig()
        }
    }, [isValidWalletConnectId, createWagmiProviderConfig])

    // UseEffect - Recreate wagmiProviderConfig when customRpc changes
    useEffect(() => {
        if (useCustomRpc && customRpc) {
            createWagmiProviderConfig()
        }
    }, [customRpc, useCustomRpc, createWagmiProviderConfig])

    // UseEffect - Reset customRpc when useCustomRpc is false
    useEffect(() => {
        !useCustomRpc && setCustomRpc("")
    }, [useCustomRpc, setCustomRpc])

    // Create queryClient for RainbowKit
    const queryClient = new QueryClient()

    if (!wagmiProviderConfig) {
        return null
    } else {
        return (
            <VStack minH={"100vh"} minW={"100%"} className={"bgPage"} gap={0}>
                <VStack minW={"100vw"} justifyContent="center" alignItems="center" gap={0}>
                    <Header useCustomRpc={useCustomRpc} setUseCustomRpc={setUseCustomRpc} />
                    <VStack alignItems={"center"} minW={"100vw"} gap={0}>
                        <WagmiProvider config={wagmiProviderConfig}>
                            <QueryClientProvider client={queryClient}>
                                <RainbowKitProvider modalSize="compact" theme={colorMode === "dark" ? darkTheme() : lightTheme()}>
                                    <ContentContainer
                                        wagmiProviderConfig={wagmiProviderConfig}
                                        customRpc={customRpc}
                                        setCustomRpc={setCustomRpc}
                                        useCustomRpc={useCustomRpc}
                                        setUseCustomRpc={setUseCustomRpc}
                                    />
                                </RainbowKitProvider>
                            </QueryClientProvider>
                        </WagmiProvider>
                        <Box height={30} />
                    </VStack>
                </VStack>
                <Box flex="1" />
                <Footer />
            </VStack>
        )
    }
}

export default App
