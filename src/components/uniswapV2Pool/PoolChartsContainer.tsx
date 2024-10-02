import { HStack, Text, Box } from "@chakra-ui/react"
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts"

export default function PoolChartsContainer() {
    const data = [
        { name: "token0", tokenValue: 1000 },
        { name: "token1", tokenValue: 2000 },
    ]

    const colors = {
        token0: "#0fc546",
        token1: "#c16c26",
    }

    return (
        <HStack w={"100%"} minH={"200px"} justifyContent={"start"} alignItems={"start"} gap={10} py={3} px={3}>
            {/* <Text
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
            </Text> */}

            <Box w="200px" h="200px">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Bar dataKey="tokenValue" radius={[10, 10, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </HStack>
    )
}
