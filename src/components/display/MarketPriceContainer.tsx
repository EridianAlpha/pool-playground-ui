import { HStack, Text, VStack } from "@chakra-ui/react"

export default function MarketPriceContainer({ marketPrice }) {
    const MarketPrice = ({ name, emoji, price }) => {
        return (
            <HStack w={"100%"} px={"15px"} py={"5px"} justifyContent={"space-between"} fontSize={"lg"}>
                <HStack minW={"120px"}>
                    <Text>{emoji}</Text>
                    <Text fontWeight={"semibold"}>{name}</Text>
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
                <MarketPrice name={"Diamond"} emoji={"💎"} price={marketPrice.diamond} />
                <MarketPrice name={"Wood"} emoji={"🪵"} price={marketPrice.wood} />
                <MarketPrice name={"Stone"} emoji={"🪨"} price={marketPrice.stone} />
            </VStack>
        </VStack>
    )
}
