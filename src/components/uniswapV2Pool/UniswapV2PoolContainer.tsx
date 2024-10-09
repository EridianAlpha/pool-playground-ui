import { useEffect, useState } from "react"

import { Flex, HStack, Text, VStack, Link } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import SwapContainer from "./SwapContainer"
import PoolChartsContainer from "./PoolChartsContainer"

import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
import { useChainId } from "wagmi"

import config from "../../../public/data/config.json"

export default function UniswapV2PoolContainer({
    wagmiProviderConfig,
    provider,
    tokenAddresses,
    marketPrice,
    userBalance,
    refetchData,
    setRefetchData,
}) {
    const chainId = useChainId()

    const [poolsToFetch, setPoolsToFetch] = useState(["diamond-wood", "diamond-stone", "wood-stone"])
    const [isSwapOpen, setIsSwapOpen] = useState({ "diamond-wood": true, "diamond-stone": false, "wood-stone": false })

    const [poolData, setPoolData] = useState({})
    const [uniswapV2Factory, setUniswapV2Factory] = useState(null)

    // UseEffect - Create the uniswapV2Factory contract instance
    useEffect(() => {
        if (provider) {
            const uniswapV2FactoryAbi = ["function getPair(address tokenA, address tokenB) view returns (address)"]
            setUniswapV2Factory(new ethers.Contract(config.chains[chainId].uniswapV2FactoryAddress, uniswapV2FactoryAbi, provider))
        }
    }, [provider, chainId])

    // UseEffect - Fetch poolData
    useEffect(() => {
        const fetchPoolData = async () => {
            try {
                const uniswapV2PairAbi = [
                    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
                    "function token0() external view returns (address)",
                    "function token1() external view returns (address)",
                ]

                const tokenInfo = {
                    [tokenAddresses.diamond]: {
                        name: "Diamond",
                        emoji: "💎",
                        address: tokenAddresses.diamond,
                        marketPrice: marketPrice.diamond,
                        barChartColor: "#489EE6",
                    },
                    [tokenAddresses.wood]: {
                        name: "Wood",
                        emoji: "🪵",
                        address: tokenAddresses.wood,
                        marketPrice: marketPrice.wood,
                        barChartColor: "#906F54",
                    },
                    [tokenAddresses.stone]: {
                        name: "Stone",
                        emoji: "🪨",
                        address: tokenAddresses.stone,
                        marketPrice: marketPrice.stone,
                        barChartColor: "#95948C",
                    },
                }

                // Map pool names to token addresses
                const poolNameToTokens = {
                    "diamond-wood": [tokenAddresses.diamond, tokenAddresses.wood],
                    "diamond-stone": [tokenAddresses.diamond, tokenAddresses.stone],
                    "wood-stone": [tokenAddresses.wood, tokenAddresses.stone],
                }

                // Object to hold new pool data
                const newPoolData = { ...poolData }

                // Only fetch data for poolsToFetch to reduce RPC calls to only pools that have changed
                for (const poolName of poolsToFetch) {
                    const [tokenA, tokenB] = poolNameToTokens[poolName]

                    const pairAddress = await uniswapV2Factory.getPair(tokenA, tokenB)

                    const pairContract = new ethers.Contract(pairAddress, uniswapV2PairAbi, provider)

                    // Get token addresses and reserves
                    const token0Address = await pairContract.token0()
                    const token1Address = await pairContract.token1()

                    // Get current reserves
                    const [reserve0, reserve1] = await pairContract.getReserves()

                    // Retrieve token info
                    const token0Data = tokenInfo[token0Address]
                    const token1Data = tokenInfo[token1Address]

                    // Build the pool data object
                    const poolEntry = {
                        poolAddress: pairAddress,
                        token0: {
                            ...token0Data,
                            tokenAmount: Number(new BigNumber(reserve0).shiftedBy(-18)),
                        },
                        token1: {
                            ...token1Data,
                            tokenAmount: Number(new BigNumber(reserve1).shiftedBy(-18)),
                        },
                    }

                    newPoolData[poolName] = poolEntry
                }

                setPoolData(newPoolData)
            } catch (error) {
                console.error(`Error fetching poolData: ${error}`)
            }
        }

        // Fetch pool data if the poolData object is empty
        if (Object.keys(poolData).length === 0 && provider && uniswapV2Factory) {
            fetchPoolData()
        }

        // Fetch pool data if refetchData is true
        if (refetchData) {
            fetchPoolData()
            setRefetchData(false)
        }
    }, [provider, uniswapV2Factory, tokenAddresses, poolsToFetch, poolData, marketPrice, refetchData, setRefetchData])

    function formatDecimals(amount) {
        if (Number.isInteger(amount)) return amount.toFixed(0)

        // Determine the number of decimal places in the amount
        const decimals = amount.toString().split(".")[1]?.length || 0
        if (decimals === 1) return amount.toFixed(1)
        return amount.toFixed(2)
    }

    return (
        Object.keys(poolData).length > 0 && (
            <HStack w={"100%"} gap={5} justifyContent={"center"} alignItems={"start"} flexWrap={"wrap"}>
                {["diamond-wood", "diamond-stone", "wood-stone"].map((poolName) => (
                    <VStack key={poolName} className="contentContainer" borderRadius="30px" gap={0} flexGrow={1} maxW={"610px"} minW={"fit-content"}>
                        <Flex
                            direction={{ base: "column", sm: "row" }}
                            gap={{ base: 2, sm: 0 }}
                            w={"100%"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            px={4}
                            py={4}
                            borderBottom={"4px solid"}
                            borderColor={"blue"}
                            whiteSpace={"nowrap"}
                        >
                            <Text fontWeight={"bold"} textAlign={"center"} cursor={"pointer"}>
                                <Link
                                    as={NextLink}
                                    href={`${config.chains[chainId].blockExplorerUrl}/address/${poolData[poolName].poolAddress}`}
                                    target="_blank"
                                >
                                    Uniswap V2 Pool <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                                </Link>
                            </Text>
                            <TextHighlightContainer
                                text={`${formatDecimals(poolData[poolName].token0.tokenAmount)} ${poolData[poolName].token0.emoji} ${
                                    poolData[poolName].token0.name
                                }`}
                                tooltipText="Pool token 0"
                                fontWeight={"semibold"}
                            />
                            <TextHighlightContainer
                                text={`${formatDecimals(poolData[poolName].token1.tokenAmount)} ${poolData[poolName].token1.emoji} ${
                                    poolData[poolName].token1.name
                                }`}
                                tooltipText="Pool token 1"
                                fontWeight={"semibold"}
                            />
                        </Flex>
                        <PoolPriceContainer title={"Current Pool Prices"} poolData={poolData[poolName]} />
                        <PoolChartsContainer poolData={poolData[poolName]} chartDomainData={poolData[poolName]} />
                        <SwapContainer
                            wagmiProviderConfig={wagmiProviderConfig}
                            poolName={poolName}
                            poolData={poolData[poolName]}
                            userBalance={userBalance}
                            setPoolsToFetch={setPoolsToFetch}
                            isSwapOpen={isSwapOpen[poolName]}
                            setIsSwapOpen={setIsSwapOpen}
                            refetchData={refetchData}
                            setRefetchData={setRefetchData}
                        />
                    </VStack>
                ))}
            </HStack>
        )
    )
}
