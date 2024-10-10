import { HStack, Text, VStack, Link } from "@chakra-ui/react"
import NextLink from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

import { useChainId } from "wagmi"

import config from "../../../public/data/config.json"

export default function MarketPriceContainer({ marketPrice, tokenAddresses }) {
    const chainId = useChainId()

    const MarketPrice = ({ name, emoji, price, address }) => {
        return (
            <HStack w={"100%"} px={"15px"} py={"5px"} justifyContent={"space-between"} fontSize={"lg"}>
                <HStack minW={"140px"}>
                    <Text>{emoji}</Text>
                    <Link as={NextLink} href={`${config.chains[chainId].blockExplorerUrl}/address/${address}`} target="_blank">
                        <Text fontWeight={"semibold"}>
                            {name} <FontAwesomeIcon icon={faUpRightFromSquare} size={"xs"} />
                        </Text>
                    </Link>
                </HStack>
                <Text className={"bgPage"} borderRadius={"full"} px={2}>
                    ${price.toFormat(0)}
                </Text>
            </HStack>
        )
    }

    return (
        <VStack maxW={"500px"} gap={0} flexGrow={1}>
            <Text
                className="headingContainer"
                fontSize={"xl"}
                fontWeight={"bold"}
                w={"fit-content"}
                px={5}
                py={1}
                borderTopRadius={"15px"}
                mb={"-4px"}
                zIndex={2}
            >
                Market Prices
            </Text>
            <VStack w={"100%"} maxW={"250px"} gap={0} borderRadius={"15px"} overflow={"hidden"} className="contentContainer" py={1}>
                <MarketPrice name={"Diamond"} emoji={"💎"} price={marketPrice.diamond} address={tokenAddresses.diamond} />
                <MarketPrice name={"Wood"} emoji={"🪵"} price={marketPrice.wood} address={tokenAddresses.wood} />
                <MarketPrice name={"Stone"} emoji={"🪨"} price={marketPrice.stone} address={tokenAddresses.stone} />
            </VStack>
        </VStack>
    )
}
