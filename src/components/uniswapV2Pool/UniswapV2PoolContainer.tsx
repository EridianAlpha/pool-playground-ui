import { HStack, Text, VStack, Link } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import SwapContainer from "./SwapContainer"
import PoolChartsContainer from "./PoolChartsContainer"

export default function UniswapV2PoolContainer({ provider }) {
    const PoolContainer = ({ title }) => {
        return (
            <VStack w={"100%"} className="contentContainer" borderRadius="30px" gap={0}>
                <HStack w={"100%"} justifyContent={"space-around"} px={2} py={4}>
                    <Text fontWeight={"bold"} textAlign={"center"} cursor={"pointer"}>
                        <Link
                            as={NextLink}
                            // TODO: Update href to use the correct block explorer URL
                            // href={`${config.chains[chainId].blockExplorerUrl}/address/${0x123}`}
                            href="https://etherscan.io/address/0x123"
                            target="_blank"
                        >
                            Uniswap V2 Pool <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>
                    </Text>
                    <HStack>
                        <TextHighlightContainer text={"10 💎 Diamond "} tooltipText="Pool token 0" fontWeight={"semibold"} />
                    </HStack>
                    <VStack>
                        <TextHighlightContainer text={"100 🪵 Wood"} tooltipText="Pool token 1" fontWeight={"semibold"} />
                    </VStack>
                </HStack>
                <PoolPriceContainer />
                <SwapContainer />
                <PoolChartsContainer />
            </VStack>
        )
    }

    return (
        <HStack w={"100%"} gap={5} alignItems={"start"}>
            <PoolContainer title={"💎 Diamond | 🪵 Wood Pool"} />
            <PoolContainer title={"Silver/Bronze Pool"} />
            <PoolContainer title={"Bronze/Gold Pool"} />
        </HStack>
    )
}
