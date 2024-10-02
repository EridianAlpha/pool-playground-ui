import { HStack, Text } from "@chakra-ui/react"

import PoolPriceGrid from "./PoolPriceGrid"

export default function PoolPriceContainer() {
    return (
        <HStack w={"100%"} justifyContent={"start"} alignItems={"start"} gap={10} py={3} px={3} borderTop={"4px solid"} borderColor={"blue"}>
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
                Pool Prices
            </Text>
            <PoolPriceGrid />
        </HStack>
    )
}
