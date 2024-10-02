import { HStack, Input, Text, VStack, InputGroup, InputLeftAddon, IconButton, Button, Tooltip, Link, Grid, GridItem } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsLeftRight, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import TextHighlightContainer from "./TextHighlightContainer"
import SwapButtonContainer from "./SwapButtonContainer"

export default function UniswapV2PoolContainer({ provider }) {
    const PoolContainer = ({ title }) => {
        return (
            <VStack minH={"50vh"} w={"100%"} className="contentContainer" borderRadius="30px" gap={0}>
                <HStack w={"100%"} justifyContent={"space-around"} px={2} py={3}>
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
                        <TextHighlightContainer text={"💎 Diamond"} tooltipText="Pool token 0" />
                    </HStack>
                    <VStack>
                        <TextHighlightContainer text={"🪵 Wood"} tooltipText="Pool token 1" />
                    </VStack>
                </HStack>
                <SwapButtonContainer />
            </VStack>
        )
    }

    return (
        <HStack w={"100%"} gap={5}>
            <PoolContainer title={"💎 Diamond | 🪵 Wood Pool"} />
            <PoolContainer title={"Silver/Bronze Pool"} />
            <PoolContainer title={"Bronze/Gold Pool"} />
        </HStack>
    )
}
