import { useEffect, useState } from "react"
import { HStack, Text, VStack, Box, Tooltip, Menu, MenuButton, Button, MenuList, MenuItemOption, MenuOptionGroup } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faTriangleExclamation, faChevronDown } from "@fortawesome/free-solid-svg-icons"

export default function OptimalSwapContainer({ poolData, userBalance }) {
    const [isOptimalSwapVisible, setIsOptimalSwapVisible] = useState(false) // TODO: Change to false when finished testing
    const [calculationType, setCalculationType] = useState("maxProfit")
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [optimalSwap, setOptimalSwap] = useState({
        maxProfit: 0,
        optimalToken: "token0",
        optimalTokenEmoji: "",
        optimalAmount: 0,
        isUserBalanceExceeded: false,
    })

    // UseEffect - Optimal Swap Calculation
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

            if (calculationType === "balance") {
                // Constants
                const A = amount0 // Reserve of Token0
                const B = amount1 // Reserve of Token1
                const P0 = marketPrice0
                const P1 = marketPrice1
                const f = feeFactor // 0.997

                // Calculate optimalDeltaX for swapping Token0 to Token1
                // Coefficients for quadratic equation: a0 * (deltaX)^2 + b0 * deltaX + c0 = 0
                const a0 = f * P0
                const b0 = A * (1 + f) * P0
                const c0 = A * A * P0 - A * B * P1

                const D0 = b0 * b0 - 4 * a0 * c0

                if (D0 >= 0) {
                    const sqrtD0 = Math.sqrt(D0)
                    const deltaX1 = (-b0 + sqrtD0) / (2 * a0)
                    const deltaX2 = (-b0 - sqrtD0) / (2 * a0)
                    // Choose the positive and valid deltaX
                    optimalDeltaX = deltaX1 > 0 ? deltaX1 : deltaX2 > 0 ? deltaX2 : 0
                }

                // Calculate optimalDeltaY for swapping Token1 to Token0
                // Coefficients for quadratic equation: a1 * S^2 + b1 * S + c1 = 0
                // Where S = amount1 + deltaY
                const a1 = feeFactor * P1
                const b1 = (1 - feeFactor) * amount1 * P1
                const c1 = -amount0 * amount1 * P0

                const D1 = b1 * b1 - 4 * a1 * c1

                if (D1 >= 0) {
                    const sqrtD1 = Math.sqrt(D1)
                    const S1 = (-b1 + sqrtD1) / (2 * a1)
                    const S2 = (-b1 - sqrtD1) / (2 * a1)

                    // deltaY = S - amount1
                    const deltaY1 = S1 - amount1
                    const deltaY2 = S2 - amount1

                    // Choose the positive and valid deltaY
                    if (deltaY1 > 0) {
                        optimalDeltaY = deltaY1
                    } else if (deltaY2 > 0) {
                        optimalDeltaY = deltaY2
                    } else {
                        optimalDeltaY = 0
                    }
                }

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
    }, [poolData, calculationType, userBalance])

    return (
        <HStack gap={2} mb={5} justifyContent={"center"} w={"100%"}>
            <Menu variant={"OptimalSwapTypeSelector"} placement="bottom-start" gutter={3} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <MenuButton
                    as={Button}
                    variant={"OptimalSwapTypeSelector"}
                    borderRadius={"full"}
                    onClick={() => setIsMenuOpen(true)}
                    className={"bgPage"}
                    pl={3}
                    pr={3}
                    maxH={"32px"}
                    minW={"270px"}
                >
                    <HStack gap={0} justifyContent={"space-between"} pb={"2px"} pt={"3px"}>
                        <Text pr={2}>Optimal swap {calculationType === "maxProfit" ? "for max profit" : "to balance pool"}</Text>
                        <Box>
                            <FontAwesomeIcon icon={faChevronDown} size={"sm"} />
                        </Box>
                    </HStack>
                </MenuButton>
                <MenuList minW={1}>
                    <MenuOptionGroup value={calculationType} type="radio">
                        <MenuItemOption value={"maxProfit"} onClick={() => setCalculationType("maxProfit")}>
                            Optimal swap for max profit
                        </MenuItemOption>
                        <MenuItemOption value={"balance"} onClick={() => setCalculationType("balance")}>
                            Optimal swap to balance pool
                        </MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <HStack
                className={"bgPage"}
                px={3}
                py={1}
                borderRadius={"full"}
                overflow={"hidden"}
                position={"relative"}
                onClick={() => setIsOptimalSwapVisible(true)}
                minW={"150px"}
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
                        background: "linear-gradient(to right, transparent -20px, rgb(13, 166, 216, 1) 85px, #0da6d8 100%)",
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
