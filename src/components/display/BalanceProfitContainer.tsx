import { HStack, Text, Box } from "@chakra-ui/react"

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
            <HStack className="contentContainer" borderRadius={"full"} minH={"38px"} overflow={"hidden"} gap={0}>
                <HStack px={3} minH={"38px"} fontWeight={"bold"}>
                    <Text fontSize={"lg"} whiteSpace={"nowrap"}>
                        Your Total Balance
                    </Text>
                    e
                    <Text className={"bgPage"} borderRadius={"full"} px={2}>
                        ${totalValue.toFixed(0)}
                    </Text>
                </HStack>
                <Box w={"4px"} bg="blue" minH={"38px"} />
                <HStack px={3} minH={"38px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                    <Text fontSize={"lg"}>{calculateProfit() >= 0 ? "Profit" : "Loss"}</Text>
                    <Text bg={calculateProfit() >= 0 ? "green" : "red"} borderRadius={"full"} px={2}>
                        {calculateProfit() >= 0 ? "+ " : "- "}${Math.abs(calculateProfit()).toFixed(0)}
                    </Text>
                </HStack>
            </HStack>
        </HStack>
    )
}
