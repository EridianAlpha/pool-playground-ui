import { HStack, Text, VStack } from "@chakra-ui/react"

export default function TokenBalanceContainer({ marketPrice, userBalance }) {
    const TokenBalance = ({ name, emoji, amount, value }) => {
        return (
            <HStack w={"100%"} px={"15px"} py={"5px"} justifyContent={"space-between"} fontSize={"lg"}>
                <HStack minW={"120px"}>
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

    function formatDecimals(amount) {
        if (amount < 0.02) return 0
        if (Number.isInteger(amount)) return amount.toFixed(0)

        // Determine the number of decimal places in the amount
        const decimals = amount.toString().split(".")[1]?.length || 0
        if (decimals === 1) return amount.toFixed(1)
        return amount.toFixed(2)
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
                <TokenBalance
                    name={"Diamond"}
                    emoji={"💎"}
                    amount={formatDecimals(userBalance.diamond)}
                    value={formatDecimals(marketPrice.diamond * userBalance.diamond)}
                />
                <TokenBalance
                    name={"Wood"}
                    emoji={"🪵"}
                    amount={formatDecimals(userBalance.wood)}
                    value={formatDecimals(marketPrice.wood * userBalance.wood)}
                />
                <TokenBalance
                    name={"Stone"}
                    emoji={"🪨"}
                    amount={formatDecimals(userBalance.stone)}
                    value={formatDecimals(marketPrice.stone * userBalance.stone)}
                />
            </VStack>
        </VStack>
    )
}
