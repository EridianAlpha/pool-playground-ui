import { HStack, Text, Box } from "@chakra-ui/react"

import PoolPriceGrid from "./PoolPriceGrid"

export default function PoolPriceContainer({ title, poolData, opacity = 1 }) {
    return (
        <HStack w={"100%"} justifyContent={{ base: "center", xl: "space-between" }} alignItems={"start"} gap={5} px={3} pt={3} flexWrap={"wrap"}>
            <Text fontWeight={"semibold"} className={"bgPage"} px={4} py={1} borderRadius={"full"} textAlign={"center"} cursor={"default"}>
                {title}
            </Text>
            <Box opacity={opacity}>
                <PoolPriceGrid data={poolData} />
            </Box>
        </HStack>
    )
}
