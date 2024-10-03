import { useEffect, useState } from "react"
import { HStack, Box, useColorMode, Text, Grid } from "@chakra-ui/react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, ComposedChart, Line, Scatter, LabelList, ZAxis } from "recharts"

export default function PoolChartsContainer({ poolData }) {
    const { colorMode } = useColorMode()
    const [strokeColor, setStrokeColor] = useState("white")

    useEffect(() => {
        setStrokeColor(colorMode === "light" ? "black" : "white")
    }, [colorMode])

    const barChartData = [
        { name: poolData.token0.emoji, tokenValue: poolData.token0.marketPrice * poolData.token0.tokenAmount, color: poolData.token0.barChartColor },
        { name: poolData.token1.emoji, tokenValue: poolData.token1.marketPrice * poolData.token1.tokenAmount, color: poolData.token1.barChartColor },
    ]

    const generateLogarithmicData = (k, points) => {
        const data = []
        const minX = 1 // TODO: Set the minimum x value
        const maxX = 1000 // TODO: Set the maximum x value
        const logMin = Math.log10(minX)
        const logMax = Math.log10(maxX)

        // Generate points evenly spaced on a logarithmic scale
        for (let i = 0; i <= points; i++) {
            const logX = logMin + (i / points) * (logMax - logMin)
            const x = Math.pow(10, logX) // Convert back to linear scale
            const y = k / x
            data.push({ x, y })
        }
        return data
    }

    const k = poolData.token0.tokenAmount * poolData.token1.tokenAmount
    const maxPoints = 20 // Generates a smooth curve with 20 points without being slow to render

    const constantProductLineData = generateLogarithmicData(k, maxPoints)

    // Add the scatter point showing current position of the pool
    constantProductLineData.push({ x: poolData.token0.tokenAmount, y: null, scatterY: poolData.token1.tokenAmount })

    return (
        <HStack w={"100%"} minH={"200px"} justifyContent={"start"} alignItems={"start"} gap={0} pb={2} px={3}>
            <Box w="40%" h="200px">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <Bar dataKey="tokenValue" radius={[10, 10, 0, 0]} isAnimationActive={false}>
                            {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="tokenValue" position="top" formatter={(value) => `$${value}`} />
                        </Bar>
                        <YAxis tickFormatter={(value) => `$${value}`} stroke={strokeColor} />
                        <XAxis dataKey="name" stroke={strokeColor} tickLine={false} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <Box w="60%" h="200px" position={"relative"}>
                <Grid
                    position="absolute"
                    top="20%"
                    left="40%"
                    fontWeight="bold"
                    templateColumns="auto auto auto auto auto"
                    alignItems="center"
                    rowGap={0}
                    columnGap={2}
                >
                    <Text textAlign={"center"}>x</Text>
                    <Text>*</Text>
                    <Text textAlign={"center"}>y</Text>
                    <Text>=</Text>
                    <Text>k</Text>

                    <Text textAlign={"center"}>{poolData.token0.emoji}</Text>
                    <Text>*</Text>
                    <Text textAlign={"center"}>{poolData.token1.emoji}</Text>
                    <Text>=</Text>
                    <Text>k</Text>

                    <Text>{poolData.token0.tokenAmount}</Text>
                    <Text>*</Text>
                    <Text>{poolData.token1.tokenAmount}</Text>
                    <Text>=</Text>
                    <Text>{k}</Text>
                </Grid>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={constantProductLineData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={[0, poolData.token0.tokenAmount * 5]}
                            allowDataOverflow={true}
                            stroke={strokeColor}
                        />
                        <YAxis type="number" domain={[0, poolData.token1.tokenAmount * 5]} allowDataOverflow={true} stroke={strokeColor} />
                        <Line type="monotone" dataKey="y" stroke="#e7c60d" dot={false} isAnimationActive={false} strokeWidth={3} />
                        <Scatter dataKey="scatterY" fill={strokeColor} shape="circle" isAnimationActive={false} />
                        <ZAxis range={[120]} /> {/* ZAxis used to increase the size of the Scatter point */}
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </HStack>
    )
}
