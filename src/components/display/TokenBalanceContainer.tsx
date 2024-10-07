import { HStack, Text, VStack } from "@chakra-ui/react"

export default function TokenBalanceContainer({ marketPrice, userBalance }) {
    const TokenBalance = ({ name, emoji, amount, value }) => {
        return (
            <HStack w={"100%"} px={"15px"} py={"5px"} justifyContent={"space-between"} fontSize={"lg"}>
                <HStack minW={"150px"}>
                    <Text>{emoji}</Text>
                    <Text fontWeight={"semibold"}>{name}</Text>
                </HStack>
                <HStack flexGrow={1} gap={0}>
                    <Text className={"bgPage"} borderRadius={"full"} px={2}>
                        {amount}
                    </Text>
                </HStack>
                <HStack flexGrow={1} gap={0} justifyContent={"end"}>
                    <Text className={"bgPage"} borderRadius={"full"} px={2}>
                        ${value}
                    </Text>
                </HStack>
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
                borderBottom={"none"}
                mb={"-4px"}
                zIndex={2}
            >
                Your Token Balances
            </Text>
            <VStack w={"100%"} maxW={"350px"} gap={0} borderRadius={"15px"} overflow={"hidden"} className="contentContainer" py={1}>
                <TokenBalance name={"Diamond"} emoji={"💎"} amount={userBalance.diamond} value={marketPrice.diamond * userBalance.diamond} />
                <TokenBalance name={"Wood"} emoji={"🪵"} amount={userBalance.wood} value={marketPrice.wood * userBalance.wood} />
                <TokenBalance name={"Stone"} emoji={"🪨"} amount={userBalance.stone} value={marketPrice.stone * userBalance.stone} />
            </VStack>
        </VStack>
    )
}
