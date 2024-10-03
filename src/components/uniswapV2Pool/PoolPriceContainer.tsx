import { HStack, Text } from "@chakra-ui/react"

import PoolPriceGrid from "./PoolPriceGrid"

export default function PoolPriceContainer({ title, poolData }) {
    return (
        <HStack w={"100%"} justifyContent={"space-between"} alignItems={"start"} gap={10} p={3}>
            <Text
                fontSize={"lg"}
                fontWeight={"semibold"}
                className={"bgPage"}
                px={3}
                py={1}
                borderRadius={"full"}
                textAlign={"center"}
                w={"fit-content"}
                maxW={"40%"}
            >
                {title}
            </Text>
            <PoolPriceGrid data={poolData} />
        </HStack>
    )
}
