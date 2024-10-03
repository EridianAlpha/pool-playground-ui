import { useEffect, useState } from "react"
import { HStack, Box, useColorMode } from "@chakra-ui/react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, ComposedChart, Line, Scatter } from "recharts"

export default function PoolChartsContainer() {
    const { colorMode } = useColorMode()
    const [strokeColor, setStrokeColor] = useState("white")

    useEffect(() => {
        setStrokeColor(colorMode === "light" ? "black" : "white")
    }, [colorMode])

    const data = [
        { name: "token0", tokenValue: 1000 },
        { name: "token1", tokenValue: 2000 },
    ]

    const colors = {
        token0: "#0fc546",
        token1: "#c16c26",
    }

    const generateConstantProductData = (k, maxX) => {
        const data = []
        for (let x = 1; x <= maxX; x++) {
            data.push({ x, y: k / x })
        }
        return data
    }

    // Set the value of 'k' and the maximum value of 'x'
    const k = 1000 // Constant product value
    const maxX = 1000 // Maximum value of x to plot

    // Generate data points for the line
    const constantProductLineData = generateConstantProductData(k, maxX)

    // Add the scatter point to the line data
    constantProductLineData.push({ x: 10, y: null, scatterY: 100 }) // Set `y` to null, and `scatterY` to 100

    return (
        <HStack w={"100%"} minH={"200px"} justifyContent={"start"} alignItems={"start"} gap={0} py={3} px={3}>
            <Box w="40%" h="200px">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke={strokeColor} />
                        <YAxis tickFormatter={(value) => `$${value}`} stroke={strokeColor} />
                        <Bar dataKey="tokenValue" radius={[10, 10, 0, 0]} isAnimationActive={false}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <Box w="60%" h="200px">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={constantProductLineData}>
                        <XAxis dataKey="x" type="number" domain={[0, 200]} allowDataOverflow={true} stroke={strokeColor} />
                        <YAxis type="number" domain={[0, 200]} allowDataOverflow={true} stroke={strokeColor} />
                        <Line type="monotone" dataKey="y" stroke="#e7c60d" dot={false} isAnimationActive={false} strokeWidth={3} />
                        <Scatter dataKey="scatterY" fill={strokeColor} shape="circle" isAnimationActive={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </HStack>
    )
}
