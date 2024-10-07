import { useEffect, useState } from "react"
import { VStack, Text, Grid, GridItem } from "@chakra-ui/react"

import { ethers } from "ethers"
import { useAccount, useChainId } from "wagmi"

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
    const chainId = useChainId()
    const { address: connectedWalletAddress, isConnected } = useAccount()

    const [isAboutExpanded, setIsAboutExpanded] = useState(false)
    const [provider, setProvider] = useState(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
    const [isContractDeployed, setIsContractDeployed] = useState(false)
    const [tokenAddresses, setTokenAddresses] = useState({})
    const [isFetchingTokenAddresses, setIsFetchingTokenAddresses] = useState(true)

    // UseEffect - Set JSON RPC provider
    useEffect(() => {
        setProvider(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
    }, [customRpc, chainId])

    // UseEffect - Check if contract is deployed on selected network
    useEffect(() => {
        setIsContractDeployed(
            config.chains[chainId].poolPlaygroundContractAddress &&
                config.chains[chainId].poolPlaygroundContractAddress != "0x0000000000000000000000000000000000000000"
                ? true
                : false
        )
    }, [chainId, isConnected])

    // UseEffect - Check if connected address has a deployed playground instance
    //             by checking the token addresses for the connected address
    useEffect(() => {
        if (isConnected && isContractDeployed) {
            // Use the provider to query the contract directly on the getUserTokens(user) function
            const fetchTokenAddresses = async () => {
                setIsFetchingTokenAddresses(true)

                try {
                    const poolPlaygroundContract = new ethers.Contract(
                        config.chains[chainId].poolPlaygroundContractAddress,
                        poolPlaygroundAbi,
                        provider
                    )

                    const tokenAddresses = await poolPlaygroundContract.getUserTokens(connectedWalletAddress)

                    // If the token addresses are empty the user has not deployed a playground instance
                    if (tokenAddresses.some((address) => address === "0x0000000000000000000000000000000000000000")) {
                        setTokenAddresses({})
                    } else {
                        setTokenAddresses({ diamond: tokenAddresses[0], wood: tokenAddresses[1], stone: tokenAddresses[2] })
                    }

                    // Reset the fetching state
                    setIsFetchingTokenAddresses(false)
                } catch (error) {
                    console.error(`Error fetching token addresses for ${chainId}: ${error}`)
                    return
                }
            }

            fetchTokenAddresses()
        }
    }, [chainId, isConnected, connectedWalletAddress, isContractDeployed, provider])

    // UseEffect - Reset states when wallet is disconnected
    useEffect(() => {
        if (!isConnected) {
            setTokenAddresses({})
        }
    }, [isConnected])

    const userBalance = {
        diamond: 10,
        wood: 50,
        stone: 100,
    }

    const marketPrice = {
        diamond: 100,
        wood: 20,
        stone: 2,
    }

    return (
        <VStack w={"100vw"} alignItems={"center"} gap={0} px={3} pt={"20px"}>
            {useCustomRpc && <CustomRpcInput setUseCustomRpc={setUseCustomRpc} customRpc={customRpc} setCustomRpc={setCustomRpc} />}
            <Grid templateColumns={"1fr 1fr 1fr"} rowGap={4} columnGap={6} w="100%" minH="100%" justifyItems="center" alignItems="start" pb={5}>
                <GridItem h={"100%"}>
                    <VStack gap={5} h={"100%"} justifyContent={"space-between"}>
                        {Object.keys(tokenAddresses).length === 0 ? <GettingStartedContainer /> : <MarketPriceContainer marketPrice={marketPrice} />}
                        {isConnected && isContractDeployed && (
                            <DeployPlaygroundButton
                                wagmiProviderConfig={wagmiProviderConfig}
                                tokenAddresses={tokenAddresses}
                                isFetchingTokenAddresses={isFetchingTokenAddresses}
                            />
                        )}
                    </VStack>
                </GridItem>
                <GridItem h="100%">
                    <VStack gap={0} h={"100%"} minH={"231px"} justifyContent={"space-between"} mx={{ lg: "-30px", xl: "-75px", "2xl": "-80px" }}>
                        {isConnected ? <CurrentAddressInfo setIsContractDeployed={setIsContractDeployed} /> : <ConnectWalletButton />}
                        <VStack fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
                            <Text>
                                An interactive educational playground for visualizing and understanding Uniswap V2 mechanics by swapping ERC20 tokens
                                deployed on a testnet
                            </Text>
                        </VStack>
                        <AboutButton isAboutExpanded={isAboutExpanded} setIsAboutExpanded={setIsAboutExpanded} />
                    </VStack>
                </GridItem>
                <GridItem>
                    {Object.keys(tokenAddresses).length != 0 && (
                        <VStack gap={5}>
                            <TokenBalanceContainer marketPrice={marketPrice} userBalance={userBalance} />
                            <BalanceProfitContainer marketPrice={marketPrice} userBalance={userBalance} />
                        </VStack>
                    )}
                </GridItem>
            </Grid>
            {isAboutExpanded && <AboutContent />}
            {isConnected && !isContractDeployed && (
                <Text className={"errorText"} borderRadius={"20px"} px={2} py={1} textAlign={"center"}>
                    Contract not yet deployed on the {config.chains[chainId].name} network
                </Text>
            )}
            {Object.keys(tokenAddresses).length != 0 && <UniswapV2PoolContainer userBalance={userBalance} />}
        </VStack>
    )
}
