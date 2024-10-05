import { useEffect, useState } from "react"
import { HStack, Text, VStack, Box, Tooltip } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

export default function OptimalSwapContainer({ poolData, userBalance }) {
    const [isOptimalSwapVisible, setIsOptimalSwapVisible] = useState(false) // TODO: Change to false when finished testing
    const [calculationType, setCalculationType] = useState("maxProfit")
    const [optimalSwap, setOptimalSwap] = useState({
        maxProfit: 0,
        optimalToken: "token0",
        optimalTokenEmoji: "",
        optimalAmount: 0,
        isUserBalanceExceeded: false,
    })

    // TODO: Add "optimum" input button that calculates the input amount that would result in the highest output amount

    useEffect(() => {
        function getOptimalInputAmount() {
            const feeFactor = 0.997
            const amount0 = poolData.token0.tokenAmount
            const amount1 = poolData.token1.tokenAmount

            const marketPrice0 = poolData.token0.marketPrice
            const marketPrice1 = poolData.token1.marketPrice

            // Initialize variables
            let optimalDeltaX = 0
            let optimalDeltaY = 0
            let profit0 = 0
            let profit1 = 0

            if (calculationType == "balance") {
                // Calculate the amount needed to balance the pool by equalizing the market values
                // We need to find deltaX or deltaY such that:
                // (amount0_new * marketPrice0) = (amount1_new * marketPrice1)

                // For Token0 to Token1 swap
                function calculateDeltaXToBalance() {
                    // Define the function f(deltaX) = (amount0 + deltaX) * marketPrice0 - [amount1 - amountOut(deltaX)] * marketPrice1 = 0
                    // We'll use a numerical method (bisection) to solve for deltaX

                    let lower = 0
                    let upper = amount0 * 1000 // Upper limit for search
                    let deltaX = 0
                    const tolerance = 1e-6
                    let iterations = 0
                    const maxIterations = 100

                    while (upper - lower > tolerance && iterations < maxIterations) {
                        deltaX = (lower + upper) / 2

                        // Effective deltaX after fee
                        const dx_fee = deltaX * feeFactor
                        // Amount of Token1 received
                        const amountOut = (dx_fee * amount1) / (amount0 + dx_fee)

                        const newAmount0 = amount0 + deltaX
                        const newAmount1 = amount1 - amountOut

                        const lhs = newAmount0 * marketPrice0
                        const rhs = newAmount1 * marketPrice1
                        const difference = lhs - rhs

                        if (Math.abs(difference) < tolerance) {
                            break
                        } else if (difference > 0) {
                            // LHS > RHS, decrease deltaX
                            upper = deltaX
                        } else {
                            // LHS < RHS, increase deltaX
                            lower = deltaX
                        }
                        iterations++
                    }
                    return deltaX
                }

                // For Token1 to Token0 swap
                function calculateDeltaYToBalance() {
                    // Define the function f(deltaY) = [amount0 - amountOut(deltaY)] * marketPrice0 - (amount1 + deltaY) * marketPrice1 = 0

                    let lower = 0
                    let upper = amount1 * 1000 // Upper limit for search
                    let deltaY = 0
                    const tolerance = 1e-6
                    let iterations = 0
                    const maxIterations = 100

                    while (upper - lower > tolerance && iterations < maxIterations) {
                        deltaY = (lower + upper) / 2

                        // Effective deltaY after fee
                        const dy_fee = deltaY * feeFactor
                        // Amount of Token0 received
                        const amountOut = (dy_fee * amount0) / (amount1 + dy_fee)

                        const newAmount0 = amount0 - amountOut
                        const newAmount1 = amount1 + deltaY

                        const lhs = newAmount0 * marketPrice0
                        const rhs = newAmount1 * marketPrice1
                        const difference = lhs - rhs

                        if (Math.abs(difference) < tolerance) {
                            break
                        } else if (difference < 0) {
                            // LHS < RHS, decrease deltaY
                            upper = deltaY
                        } else {
                            // LHS > RHS, increase deltaY
                            lower = deltaY
                        }
                        iterations++
                    }
                    return deltaY
                }

                // Calculate deltaX and deltaY needed to balance the pool
                optimalDeltaX = calculateDeltaXToBalance()
                optimalDeltaY = calculateDeltaYToBalance()

                // Calculate profits for both options
                if (optimalDeltaX > 0) {
                    const dx_fee = optimalDeltaX * feeFactor
                    const amountOut = (dx_fee * amount1) / (amount0 + dx_fee)
                    profit0 = amountOut * marketPrice1 - optimalDeltaX * marketPrice0
                }

                if (optimalDeltaY > 0) {
                    const dy_fee = optimalDeltaY * feeFactor
                    const amountOut = (dy_fee * amount0) / (amount1 + dy_fee)
                    profit1 = amountOut * marketPrice0 - optimalDeltaY * marketPrice1
                }
            } else {
                // Calculate optimal input amounts to maximize profit (as before)

                // Swap Token0 for Token1
                const a0 = feeFactor * amount1 * marketPrice1
                const b0 = amount0
                const c0 = feeFactor
                const sqrt_term0 = Math.sqrt((a0 * b0) / marketPrice0)
                optimalDeltaX = (sqrt_term0 - b0) / c0

                if (optimalDeltaX > 0) {
                    const numerator0 = optimalDeltaX * feeFactor * amount1
                    const denominator0 = amount0 + optimalDeltaX * feeFactor
                    const amountOut0 = numerator0 / denominator0
                    profit0 = amountOut0 * marketPrice1 - optimalDeltaX * marketPrice0
                }

                // Swap Token1 for Token0
                const a1 = feeFactor * amount0 * marketPrice0
                const b1 = amount1
                const c1 = feeFactor
                const sqrt_term1 = Math.sqrt((a1 * b1) / marketPrice1)
                optimalDeltaY = (sqrt_term1 - b1) / c1

                if (optimalDeltaY > 0) {
                    const numerator1 = optimalDeltaY * feeFactor * amount0
                    const denominator1 = amount1 + optimalDeltaY * feeFactor
                    const amountOut1 = numerator1 / denominator1
                    profit1 = amountOut1 * marketPrice0 - optimalDeltaY * marketPrice1
                }
            }

            // Determine the best option for maximum profit or to balance the pool
            if (profit0 > profit1) {
                return {
                    maxProfit: profit0,
                    optimalToken: "token0",
                    optimalTokenEmoji: poolData.token0.emoji,
                    optimalAmount: optimalDeltaX,
                    isUserBalanceExceeded: optimalDeltaX > userBalance[poolData.token0.name.toLowerCase()],
                }
            } else {
                return {
                    maxProfit: profit1,
                    optimalToken: "token1",
                    optimalTokenEmoji: poolData.token1.emoji,
                    optimalAmount: optimalDeltaY,
                    isUserBalanceExceeded: optimalDeltaY > userBalance[poolData.token1.name.toLowerCase()],
                }
            }
        }
        setOptimalSwap(getOptimalInputAmount())
    }, [poolData])

    return (
        <HStack gap={0} pb={5} px={3} justifyContent={"center"} w={"100%"}>
            <Text
                fontWeight={"semibold"}
                className={"bgPage"}
                pl={4}
                pr={2}
                py={1}
                w={"fit-content"}
                borderLeftRadius={"full"}
                textAlign={"center"}
                cursor={"default"}
                h={"100%"}
            >
                Optimal swap
            </Text>
            <HStack
                className={"bgPage"}
                pr={4}
                pl={2}
                py={1}
                borderRightRadius={"full"}
                overflow={"hidden"}
                position={"relative"}
                onClick={() => setIsOptimalSwapVisible(true)}
            >
                {/* Overlaying Box */}
                <Box
                    cursor={"pointer"}
                    w={"100%"}
                    h={"100%"}
                    position="absolute"
                    top="0"
                    left="0"
                    className="bgPage"
                    style={{
                        transform: isOptimalSwapVisible ? "translateX(100%)" : "translateX(0)",
                        transition: "transform 0.5s ease-in-out",
                        borderRadius: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(to right, transparent -10px, rgb(13, 166, 216, 1) 80px, #0da6d8 100%)",
                    }}
                >
                    <HStack w={"100%"} justifyContent={"end"} pr={3}>
                        <FontAwesomeIcon icon={faEye} size={"xl"} />
                    </HStack>
                </Box>
                {/* Underlying Content */}
                <Text minW={"fit-content"}>
                    You send {optimalSwap.optimalAmount.toFixed(2)} {optimalSwap.optimalTokenEmoji}
                </Text>
                {optimalSwap.isUserBalanceExceeded && (
                    <Tooltip
                        className="tooltip"
                        closeOnClick={false}
                        gutter={8}
                        label={
                            <VStack className="tooltipLabel" textAlign={"center"}>
                                <Text fontWeight={"bold"}>
                                    You do not have enough {optimalSwap.optimalTokenEmoji} tokens to make this optimal swap!
                                </Text>
                            </VStack>
                        }
                        placement={"right"}
                        borderRadius={"full"}
                        hasArrow={true}
                        closeDelay={0}
                        openDelay={100}
                    >
                        <FontAwesomeIcon icon={faTriangleExclamation} color={"orange"} />
                    </Tooltip>
                )}
            </HStack>
        </HStack>
    )
}
