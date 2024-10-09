import { HStack, Text, Box, Flex } from "@chakra-ui/react"

export default function BalanceProfitContainer({ marketPrice, userBalance, initialUserBalance }) {
    const totalValue = Object.keys(userBalance).reduce((acc, key) => {
        return acc + userBalance[key] * marketPrice[key]
    }, 0)

    const calculateProfit = () => {
        return Object.keys(userBalance).reduce((acc, key) => {
            return acc + (userBalance[key] - initialUserBalance[key]) * marketPrice[key]
        }, 0)
    }

    return (
        <HStack w={"100%"} flexGrow={1} justifyContent={"center"}>
            <Flex
                direction={{ base: "column", sm: "row" }}
                alignItems={"center"}
                className="contentContainer"
                borderRadius={{ base: "30px", sm: "full" }}
                minH={"38px"}
                overflow={"hidden"}
                gap={0}
            >
                <HStack px={{ base: 5, sm: 3 }} minH={"38px"} fontWeight={"bold"}>
                    <Text fontSize={"lg"} whiteSpace={"nowrap"}>
                        Your total balance
                    </Text>
                    <Text className={"bgPage"} borderRadius={"full"} px={2}>
                        ${totalValue.toFixed(0)}
                    </Text>
                </HStack>
                <Box w={{ base: "100%", sm: "4px" }} bg="blue" minH={{ base: "4px", sm: "38px" }} />
                <HStack px={{ base: 5, sm: 3 }} minH={"38px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                    <Text fontSize={"lg"}>{calculateProfit() >= 0 ? "Profit" : "Loss"}</Text>
                    <Text bg={calculateProfit() >= 0 ? "green" : "red"} borderRadius={"full"} px={2}>
                        {calculateProfit() >= 0 ? "+ " : "- "}${Math.abs(calculateProfit()).toFixed(0)}
                    </Text>
                </HStack>
            </Flex>
        </HStack>
    )
}
