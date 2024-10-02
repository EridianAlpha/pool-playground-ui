import { HStack, Text } from "@chakra-ui/react"

export default function PoolChartsContainer() {
    return (
        <HStack w={"100%"} justifyContent={"start"} alignItems={"start"} gap={10} py={3} px={3}>
            <Text
                fontSize={"lg"}
                fontWeight={"semibold"}
                className={"bgPage"}
                px={3}
                py={1}
                borderRadius={"full"}
                textAlign={"center"}
                w={"fit-content"}
            >
                Pool Charts
            </Text>
        </HStack>
    )
}
