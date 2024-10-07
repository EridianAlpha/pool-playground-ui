import { HStack, Text, Box } from "@chakra-ui/react"

export default function BalanceProfitContainer({ marketPrice, userBalance }) {
    const totalValue = Object.keys(userBalance).reduce((acc, key) => {
        return acc + userBalance[key] * marketPrice[key]
    }, 0)

    return (
        <HStack w={"100%"} flexGrow={1} justifyContent={"center"}>
            <HStack className="contentContainer" borderRadius={"full"} minH={"38px"} overflow={"hidden"} gap={0}>
                <HStack px={3} minH={"38px"} fontWeight={"bold"}>
                    <Text fontSize={"lg"}>Your Total Balance</Text>
                    <Text className={"bgPage"} borderRadius={"full"} px={2}>
                        ${totalValue}
                    </Text>
                </HStack>
                <Box w={"4px"} bg="blue" minH={"38px"} />
                <HStack px={3} minH={"38px"} fontWeight={"bold"}>
                    <Text fontSize={"lg"}>Profit</Text>
                    <Text bg="green" borderRadius={"full"} px={2}>
                        + $200
                    </Text>
                </HStack>
            </HStack>
        </HStack>
    )
}
