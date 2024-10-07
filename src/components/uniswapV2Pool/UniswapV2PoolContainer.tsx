import { useEffect, useState } from "react"

import { HStack, Text, VStack, Link } from "@chakra-ui/react"
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

export default function UniswapV2PoolContainer({ wagmiProviderConfig, provider, tokenAddresses, marketPrice, userBalance }) {
    const chainId = useChainId()

    // TODO: setPoolsToFetch should be set when a token swap occurs on a particular pool, and only that pool data should be updated
    const [poolsToFetch, setPoolsToFetch] = useState(["diamond-wood", "diamond-stone", "wood-stone"])

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
        if (provider && uniswapV2Factory) {
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
                            marketPrice: marketPrice.diamond,
                            barChartColor: "#489EE6",
                        },
                        [tokenAddresses.wood]: {
                            name: "Wood",
                            emoji: "🪵",
                            marketPrice: marketPrice.wood,
                            barChartColor: "#906F54",
                        },
                        [tokenAddresses.stone]: {
                            name: "Stone",
                            emoji: "🪨",
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
                    const newPoolData = {}

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

                        if (!token0Data || !token1Data) {
                            console.error(`Token info not found for addresses ${token0Address} or ${token1Address}`)
                            continue
                        }

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

                    // Merge newPoolData with existing poolData
                    setPoolData((prevPoolData) => ({
                        ...prevPoolData,
                        ...newPoolData,
                    }))
                } catch (error) {
                    console.error(`Error fetching poolData: ${error}`)
                }
            }
            fetchPoolData()
        }
    }, [provider, uniswapV2Factory, tokenAddresses, poolsToFetch])

    const PoolContainer = ({ poolData, defaultIsSwapOpen }) => {
        return (
            <VStack w={"100%"} className="contentContainer" borderRadius="30px" gap={0}>
                <HStack w={"100%"} justifyContent={"space-between"} px={4} py={4} borderBottom={"4px solid"} borderColor={"blue"}>
                    <Text fontWeight={"bold"} textAlign={"center"} cursor={"pointer"}>
                        <Link as={NextLink} href={`${config.chains[chainId].blockExplorerUrl}/address/${poolData.poolAddress}`} target="_blank">
                            Uniswap V2 Pool <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>
                    </Text>
                    <TextHighlightContainer
                        text={`${poolData.token0.tokenAmount} ${poolData.token0.emoji} ${poolData.token0.name}`}
                        tooltipText="Pool token 0"
                        fontWeight={"semibold"}
                    />
                    <TextHighlightContainer
                        text={`${poolData.token1.tokenAmount} ${poolData.token1.emoji} ${poolData.token1.name}`}
                        tooltipText="Pool token 1"
                        fontWeight={"semibold"}
                    />
                </HStack>
                <PoolPriceContainer title={"Current Pool Prices"} poolData={poolData} />
                <PoolChartsContainer poolData={poolData} chartDomainData={poolData} />
                <SwapContainer poolData={poolData} userBalance={userBalance} defaultIsOpen={defaultIsSwapOpen} />
            </VStack>
        )
    }

    return (
        Object.keys(poolData).length > 0 && (
            <HStack w={"100%"} gap={5} alignItems={"start"}>
                {poolsToFetch.map((poolName, index) => (
                    <PoolContainer key={poolName} poolData={poolData[poolName]} defaultIsSwapOpen={index === 0} />
                ))}
            </HStack>
        )
    )
}
