import { HStack, Text, VStack, Link } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import SwapContainer from "./SwapContainer"
import PoolChartsContainer from "./PoolChartsContainer"

export default function UniswapV2PoolContainer({ provider }) {
    const poolData = [
        {
            poolAddress: "0x123",
            token0: {
                name: "Diamond",
                emoji: "💎",
                marketPrice: 100,
                tokenAmount: 10,
                barChartColor: "#489EE6",
            },
            token1: {
                name: "Wood",
                emoji: "🪵",
                marketPrice: 20,
                tokenAmount: 100,
                barChartColor: "#906F54",
            },
        },
        {
            poolAddress: "0x456",
            token0: {
                name: "Diamond",
                emoji: "💎",
                marketPrice: 100,
                tokenAmount: 10,
                barChartColor: "#489EE6",
            },
            token1: {
                name: "Stone",
                emoji: "🪨",
                marketPrice: 2,
                tokenAmount: 100,
                barChartColor: "#95948C",
            },
        },
        {
            poolAddress: "0x789",
            token0: {
                name: "Stone",
                emoji: "🪨",
                marketPrice: 2,
                tokenAmount: 100,
                barChartColor: "#95948C",
            },
            token1: {
                name: "Wood",
                emoji: "🪵",
                marketPrice: 20,
                tokenAmount: 100,
                barChartColor: "#906F54",
            },
        },
    ]

    const userBalance = {
        diamond: 10,
        wood: 50,
        stone: 100,
    }

    const PoolContainer = ({ poolData }) => {
        return (
            <VStack w={"100%"} className="contentContainer" borderRadius="30px" gap={0}>
                <HStack w={"100%"} justifyContent={"space-between"} px={4} py={4} borderBottom={"4px solid"} borderColor={"blue"}>
                    <Text fontWeight={"bold"} textAlign={"center"} cursor={"pointer"}>
                        <Link
                            as={NextLink}
                            // TODO: Update href to use the correct block explorer URL
                            // href={`${config.chains[chainId].blockExplorerUrl}/address/${0x123}`}
                            href={`https://etherscan.io/address/${poolData.poolAddress}`}
                            target="_blank"
                        >
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
                <SwapContainer poolData={poolData} userBalance={userBalance} />
            </VStack>
        )
    }

    return (
        <HStack w={"100%"} gap={5} alignItems={"start"}>
            <PoolContainer poolData={poolData[0]} />
            <PoolContainer poolData={poolData[1]} />
            <PoolContainer poolData={poolData[2]} />
        </HStack>
    )
}
