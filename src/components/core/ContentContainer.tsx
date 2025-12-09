import { useEffect, useState } from "react"
import { VStack, Text, Grid, GridItem, useToast } from "@chakra-ui/react"

import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
import { useAccount } from "wagmi"
import { useWallet } from "../../utils/useWallet"

import CustomRpcInput from "../wallet/CustomRpcInput"
import CurrentAddressInfo from "../wallet/CurrentAddressInfo"
import ConnectWalletButton from "../wallet/ConnectWalletButton"
import DeployPlaygroundButton from "../wallet/DeployPlaygroundButton"

import MarketPriceContainer from "../display/MarketPriceContainer"
import BalanceProfitContainer from "../display/BalanceProfitContainer"
import TokenBalanceContainer from "../display/TokenBalanceContainer"
import GettingStartedContainer from "../display/GettingStartedContainer"

import AboutButton from "../about/AboutButton"
import AboutContent from "../about/AboutContent"

import UniswapV2PoolContainer from "../uniswapV2Pool/UniswapV2PoolContainer"

import config from "../../../public/data/config.json"
import { abi as poolPlaygroundAbi } from "../../../public/data/poolPlaygroundAbi"

export default function ContentContainer({ wagmiProviderConfig, customRpc, setCustomRpc, useCustomRpc, setUseCustomRpc }) {
    const toast = useToast()
    const { address: connectedWalletAddress, chainId } = useWallet()
    const { isConnected } = useAccount()
    const emptyTokenAmounts = { diamond: new BigNumber(0), wood: new BigNumber(0), stone: new BigNumber(0) }

    const [isAboutExpanded, setIsAboutExpanded] = useState(false)
    const [provider, setProvider] = useState(
        chainId && config.chains[chainId] ? new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc) : null
    )

    const [isContractDeployed, setIsContractDeployed] = useState(false)
    const [playgroundInstanceDeployedTrigger, setPlaygroundInstanceDeployedTrigger] = useState(false)
    const [poolPlayground, setPoolPlayground] = useState(null)
    const [poolsToFetch, setPoolsToFetch] = useState(["diamond-wood", "diamond-stone", "wood-stone"])

    const [isFetchingTokenAddresses, setIsFetchingTokenAddresses] = useState(true)
    const [tokenAddresses, setTokenAddresses] = useState({})

    const [marketPrice, setMarketPrice] = useState(emptyTokenAmounts)
    const [initialUserBalance, setInitialUserBalance] = useState(emptyTokenAmounts)
    const [userBalance, setUserBalance] = useState(emptyTokenAmounts)

    const [refetchData, setRefetchData] = useState(false)

    // UseEffect - Set JSON RPC provider
    useEffect(() => {
        if (chainId && config.chains[chainId]) {
            setProvider(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
        }
    }, [customRpc, chainId])

    // UseEffect - Check if contract is deployed on selected network
    useEffect(() => {
        if (chainId && config.chains[chainId]) {
            if (
                config.chains[chainId].poolPlaygroundContractAddress &&
                config.chains[chainId].poolPlaygroundContractAddress != "0x0000000000000000000000000000000000000000"
            ) {
                setIsContractDeployed(true)
            } else {
                setIsContractDeployed(false)

                // If contract is not deployed on the current chain, reset states
                resetStates()
            }
        }
    }, [chainId, connectedWalletAddress])

    // UseEffect - Create the poolPlayground contract instance
    useEffect(() => {
        if (provider && isContractDeployed && chainId && config.chains[chainId]) {
            setPoolPlayground(new ethers.Contract(config.chains[chainId].poolPlaygroundContractAddress, poolPlaygroundAbi, provider))
        }
    }, [provider, isContractDeployed, chainId])

    // UseEffect - Check if connected address has a deployed playground instance
    //             by checking the token addresses for the connected address
    useEffect(() => {
        if (poolPlayground) {
            // Use the provider to query the contract directly on the getUserTokens(user) function
            const fetchTokenAddresses = async () => {
                setIsFetchingTokenAddresses(true)

                try {
                    const tokenAddresses = await poolPlayground.getUserTokens(connectedWalletAddress)

                    // If the token addresses are empty the user has not deployed a playground instance
                    if (tokenAddresses.some((address) => address === "0x0000000000000000000000000000000000000000")) {
                        setTokenAddresses({})
                    } else {
                        setTokenAddresses({ diamond: tokenAddresses[0], wood: tokenAddresses[1], stone: tokenAddresses[2] })
                    }

                    // If the playground instance was deployed, trigger a data refetch to update all balances
                    if (playgroundInstanceDeployedTrigger) {
                        setPoolsToFetch(["diamond-wood", "diamond-stone", "wood-stone"])
                        setRefetchData(true)
                        setPlaygroundInstanceDeployedTrigger(false)
                    }

                    // Reset the fetching state
                    setIsFetchingTokenAddresses(false)
                } catch (error) {
                    console.error(`Error fetching token addresses: ${error}`)
                    return
                }
            }

            fetchTokenAddresses()
        }
    }, [poolPlayground, connectedWalletAddress, playgroundInstanceDeployedTrigger])

    // UseEffect - Fetch market prices and initial user balance for each token
    useEffect(() => {
        if (poolPlayground) {
            const fetchMarketPrices = async () => {
                try {
                    const marketPrice = await poolPlayground.MARKET_PRICE_USD()
                    setMarketPrice({
                        diamond: new BigNumber(marketPrice[0]),
                        wood: new BigNumber(marketPrice[1]),
                        stone: new BigNumber(marketPrice[2]),
                    })

                    const initialUserBalance = await poolPlayground.getUserInitialTokenBalances(connectedWalletAddress)
                    setInitialUserBalance({
                        diamond: new BigNumber(initialUserBalance[0]).shiftedBy(-18),
                        wood: new BigNumber(initialUserBalance[1]).shiftedBy(-18),
                        stone: new BigNumber(initialUserBalance[2]).shiftedBy(-18),
                    })
                } catch (error) {
                    console.error(`Error fetching market prices: ${error}`)
                    return
                }
            }

            fetchMarketPrices()
        }
    }, [poolPlayground, connectedWalletAddress, playgroundInstanceDeployedTrigger])

    // UseEffect - Fetch user balance for each token
    useEffect(() => {
        const fetchUserBalance = async () => {
            try {
                const userBalance = await poolPlayground.getUserTokenBalances(connectedWalletAddress)
                setUserBalance({
                    diamond: new BigNumber(userBalance[0]).shiftedBy(-18),
                    wood: new BigNumber(userBalance[1]).shiftedBy(-18),
                    stone: new BigNumber(userBalance[2]).shiftedBy(-18),
                })
            } catch (error) {
                console.error(`Error fetching user balances: ${error}`)
                return
            }
        }

        // If no token addresses are found, fetch the user balance
        if (Object.keys(tokenAddresses).length != 0) {
            fetchUserBalance()
        }

        // If refetchData is true, fetch the user balance again
        if (refetchData) {
            fetchUserBalance()
            setRefetchData(false)
        }
    }, [poolPlayground, tokenAddresses, connectedWalletAddress, refetchData])

    // UseEffect - Reset states when wallet address becomes unavailable
    // Only reset if we have no address at all (not when using demo wallet)
    useEffect(() => {
        if (!connectedWalletAddress) {
            resetStates()
        }
    }, [connectedWalletAddress])

    // UseEffect - Clear all toasts when chainId changes
    useEffect(() => {
        toast.closeAll()
    }, [chainId, toast])

    // Function - Reset all states
    function resetStates() {
        setPoolPlayground(null)
        setTokenAddresses({})
        setUserBalance({ diamond: new BigNumber(0), wood: new BigNumber(0), stone: new BigNumber(0) })
    }

    return (
        <VStack w={"100vw"} alignItems={"center"} gap={0} px={3} pt={"20px"}>
            {useCustomRpc && <CustomRpcInput setUseCustomRpc={setUseCustomRpc} customRpc={customRpc} setCustomRpc={setCustomRpc} />}
            <Grid
                templateColumns={{ base: "1fr", xl: "1fr 1fr 1fr" }}
                rowGap={4}
                columnGap={6}
                w="100%"
                minH="100%"
                justifyItems="center"
                alignItems="start"
                pb={12}
            >
                {/* GridItem - Market Price Column */}
                <GridItem order={{ base: 0, xl: 0 }} h={"100%"}>
                    <VStack gap={5} h={"100%"} justifyContent={"space-between"}>
                        {Object.keys(tokenAddresses).length === 0 ? (
                            <GettingStartedContainer />
                        ) : (
                            <MarketPriceContainer marketPrice={marketPrice} tokenAddresses={tokenAddresses} />
                        )}
                        {isConnected && isContractDeployed && (
                            <DeployPlaygroundButton
                                wagmiProviderConfig={wagmiProviderConfig}
                                tokenAddresses={tokenAddresses}
                                isFetchingTokenAddresses={isFetchingTokenAddresses}
                                setPlaygroundInstanceDeployedTrigger={setPlaygroundInstanceDeployedTrigger}
                            />
                        )}
                    </VStack>
                </GridItem>

                {/* GridItem - Current Address Info Column */}
                <GridItem order={{ base: 2, xl: 1 }} h="100%">
                    <VStack
                        gap={{ base: 8, xl: 0 }}
                        h={"100%"}
                        minH={"250px"}
                        justifyContent={"space-between"}
                        mx={{ base: "0px", sm: "50px", md: "150px", xl: "-70px", "2xl": "-80px" }}
                    >
                        {isConnected ? <CurrentAddressInfo setIsContractDeployed={setIsContractDeployed} /> : <ConnectWalletButton />}
                        <VStack fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
                            <Text>
                                An interactive educational playground for visualizing and learning Uniswap V2 mechanics by swapping testnet ERC20
                                tokens
                            </Text>
                        </VStack>
                        <AboutButton isAboutExpanded={isAboutExpanded} setIsAboutExpanded={setIsAboutExpanded} />
                    </VStack>
                </GridItem>

                {/* GridItem - Token Balance Column */}
                <GridItem order={{ base: 1, xl: 2 }} h={"100%"}>
                    {Object.keys(tokenAddresses).length != 0 && (
                        <VStack gap={5} h={"100%"}>
                            <TokenBalanceContainer marketPrice={marketPrice} userBalance={userBalance} />
                            <BalanceProfitContainer marketPrice={marketPrice} userBalance={userBalance} initialUserBalance={initialUserBalance} />
                        </VStack>
                    )}
                </GridItem>
            </Grid>
            {isAboutExpanded && <AboutContent />}
            {isConnected && !isContractDeployed && chainId && config.chains[chainId] && (
                <Text className={"errorText"} borderRadius={"20px"} px={2} py={1} textAlign={"center"} fontWeight={"bold"}>
                    Contract not yet deployed on the {config.chains[chainId].name} network
                </Text>
            )}
            {connectedWalletAddress === process.env.NEXT_PUBLIC_EXAMPLE_ADDRESS && (
                <VStack
                    fontWeight={"bold"}
                    bg={"green"}
                    w={"100%"}
                    textAlign={"center"}
                    py={1}
                    px={2}
                    mb={3}
                    borderRadius={"full"}
                    maxW={"97vw"}
                    gap={0}
                >
                    <Text fontSize={"xl"}>DEMO DATA</Text>
                    <Text>Connect your own wallet to deploy your own playground instance</Text>
                </VStack>
            )}
            {Object.keys(tokenAddresses).length != 0 && (
                <UniswapV2PoolContainer
                    wagmiProviderConfig={wagmiProviderConfig}
                    provider={provider}
                    tokenAddresses={tokenAddresses}
                    marketPrice={marketPrice}
                    userBalance={userBalance}
                    refetchData={refetchData}
                    setRefetchData={setRefetchData}
                    poolsToFetch={poolsToFetch}
                    setPoolsToFetch={setPoolsToFetch}
                />
            )}
        </VStack>
    )
}
