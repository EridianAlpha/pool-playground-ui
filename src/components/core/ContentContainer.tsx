import { useEffect, useState } from "react"
import { VStack, Text, Grid, GridItem } from "@chakra-ui/react"

import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
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
    const emptyTokenAmounts = { diamond: 0, wood: 0, stone: 0 }

    const [isAboutExpanded, setIsAboutExpanded] = useState(false)
    const [provider, setProvider] = useState(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))

    const [isContractDeployed, setIsContractDeployed] = useState(false)
    const [poolPlayground, setPoolPlayground] = useState(null)

    const [isFetchingTokenAddresses, setIsFetchingTokenAddresses] = useState(true)
    const [tokenAddresses, setTokenAddresses] = useState({})

    const [marketPrice, setMarketPrice] = useState(emptyTokenAmounts)
    const [initialUserBalance, setInitialUserBalance] = useState(emptyTokenAmounts)
    const [userBalance, setUserBalance] = useState(emptyTokenAmounts)

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

    // UseEffect - Create the poolPlayground contract instance
    useEffect(() => {
        if (provider && isContractDeployed) {
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

                    // Reset the fetching state
                    setIsFetchingTokenAddresses(false)
                } catch (error) {
                    console.error(`Error fetching token addresses: ${error}`)
                    return
                }
            }

            fetchTokenAddresses()
        }
    }, [poolPlayground, connectedWalletAddress])

    // UseEffect - Fetch market prices and initial user balance for each token
    useEffect(() => {
        if (poolPlayground) {
            const fetchMarketPrices = async () => {
                try {
                    const marketPrice = await poolPlayground.MARKET_PRICE_USD()
                    setMarketPrice({
                        diamond: Number(new BigNumber(marketPrice[0])),
                        wood: Number(new BigNumber(marketPrice[1])),
                        stone: Number(new BigNumber(marketPrice[2])),
                    })

                    const initialUserBalance = await poolPlayground.getUserInitialTokenBalances(connectedWalletAddress)
                    setInitialUserBalance({
                        diamond: Number(new BigNumber(initialUserBalance[0]).shiftedBy(-18)),
                        wood: Number(new BigNumber(initialUserBalance[1]).shiftedBy(-18)),
                        stone: Number(new BigNumber(initialUserBalance[2]).shiftedBy(-18)),
                    })
                } catch (error) {
                    console.error(`Error fetching market prices: ${error}`)
                    return
                }
            }

            fetchMarketPrices()
        }
    }, [poolPlayground, connectedWalletAddress])

    // UseEffect - Fetch user balance for each token
    useEffect(() => {
        if (Object.keys(tokenAddresses).length != 0) {
            const fetchUserBalance = async () => {
                try {
                    const userBalance = await poolPlayground.getUserTokenBalances(connectedWalletAddress)
                    setUserBalance({
                        diamond: Number(new BigNumber(userBalance[0]).shiftedBy(-18)),
                        wood: Number(new BigNumber(userBalance[1]).shiftedBy(-18)),
                        stone: Number(new BigNumber(userBalance[2]).shiftedBy(-18)),
                    })
                } catch (error) {
                    console.error(`Error fetching user balances: ${error}`)
                    return
                }
            }

            fetchUserBalance()
        }
        // TODO: Add swap event listener so that the user balance updates when a swap occurs
    }, [poolPlayground, tokenAddresses, connectedWalletAddress])

    // UseEffect - Reset states when wallet is disconnected
    useEffect(() => {
        if (!isConnected) {
            setPoolPlayground(null)
            setTokenAddresses({})
            setUserBalance({ diamond: 0, wood: 0, stone: 0 })
        }
    }, [isConnected])

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
                            <BalanceProfitContainer marketPrice={marketPrice} userBalance={userBalance} initialUserBalance={initialUserBalance} />
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
            {Object.keys(tokenAddresses).length != 0 && (
                <UniswapV2PoolContainer
                    wagmiProviderConfig={wagmiProviderConfig}
                    provider={provider}
                    tokenAddresses={tokenAddresses}
                    marketPrice={marketPrice}
                    userBalance={userBalance}
                />
            )}
        </VStack>
    )
}
