import { useState, useEffect } from "react"

import { HStack, Input, Text, VStack, Button, Grid, GridItem, Box, Tooltip, useBreakpointValue } from "@chakra-ui/react"

import BigNumber from "bignumber.js"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightArrowLeft, faChevronRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import PoolChartsContainer from "./PoolChartsContainer"
import OptimalSwapContainer from "./OptimalSwapContainer"
import ExecuteSwapButton from "./ExecuteSwapButton"

import { FormatDecimals } from "../../utils/FormatDecimals"

export default function SwapContainer({
    wagmiProviderConfig,
    poolName,
    poolData,
    userBalance,
    setPoolsToFetch,
    isSwapOpen,
    setIsSwapOpen,
    refetchData,
    setRefetchData,
}) {
    const [inputTokenAmount, setInputTokenAmount] = useState(new BigNumber(0))
    const [outputTokenAmount, setOutputTokenAmount] = useState(new BigNumber(0))
    const [inputToken, setInputToken] = useState(poolData.token0)
    const [outputToken, setOutputToken] = useState(poolData.token1)
    const [estimatedPoolData, setEstimatedPoolData] = useState(poolData)
    const [valueDelta, setValueDelta] = useState(new BigNumber(0))
    const [calculationType, setCalculationType] = useState("maxProfit")
    const [optimalSwap, setOptimalSwap] = useState({
        maxProfit: 0,
        optimalToken: "token0",
        optimalTokenEmoji: "",
        optimalAmount: 0,
        isUserBalanceExceeded: false,
    })

    const currentScreenSize = useBreakpointValue({ base: "base", sm: "sm", md: "md", lg: "lg", xl: "xl" })

    const { formatDecimals } = FormatDecimals()

    function getOutputAmount(inputAmount, inputReserve, outputReserve) {
        const inputAmountWithFee = Number(inputAmount) * 0.997 // Apply 0.3% fee
        const numerator = inputAmountWithFee * Number(outputReserve)
        const denominator = Number(inputReserve) + inputAmountWithFee
        const outputAmount = numerator / denominator
        return new BigNumber(outputAmount)
    }

    // UseEffect - estimatedPoolData is a copy of poolData with the token amounts updated to reflect the swap including the fee
    useEffect(() => {
        if (!inputTokenAmount || inputTokenAmount.isZero()) {
            setEstimatedPoolData(poolData)
        } else {
            const feeFactor = 0.997
            const tempPoolData = {
                ...poolData,
                token0: { ...poolData.token0 },
                token1: { ...poolData.token1 },
            }

            // Determine if the input token is token0 or token1
            if (inputToken.name === poolData.token0.name) {
                // Swapping Token0 for Token1
                const dx = Number(inputTokenAmount)
                const x = Number(poolData.token0.tokenAmount)
                const y = Number(poolData.token1.tokenAmount)

                // Effective amount of Token0 after fee
                const dx_fee = dx * feeFactor

                // Calculate the output amount of Token1 using Uniswap formula
                const dy = (dx_fee * y) / (x + dx_fee)

                // Update pool reserves
                tempPoolData.token0.tokenAmount += dx // Full amount added to Token0 reserve
                tempPoolData.token1.tokenAmount -= dy // Amount subtracted from Token1 reserve
            } else {
                // Swapping Token1 for Token0
                const dy = Number(inputTokenAmount)
                const x = Number(poolData.token0.tokenAmount)
                const y = Number(poolData.token1.tokenAmount)

                // Effective amount of Token1 after fee
                const dy_fee = dy * feeFactor

                // Calculate the output amount of Token0 using Uniswap formula
                const dx = (dy_fee * x) / (y + dy_fee)

                // Update pool reserves
                tempPoolData.token0.tokenAmount -= dx // Amount subtracted from Token0 reserve
                tempPoolData.token1.tokenAmount += dy // Full amount added to Token1 reserve
            }

            setEstimatedPoolData(tempPoolData)
        }
    }, [inputToken, poolData, inputTokenAmount, outputTokenAmount])

    // UseEffect - Calculate the estimated profit/loss based on the market prices of the input
    useEffect(() => {
        setValueDelta(outputTokenAmount.multipliedBy(outputToken.marketPrice).minus(inputTokenAmount.multipliedBy(inputToken.marketPrice)))
    }, [estimatedPoolData, inputTokenAmount, outputTokenAmount, inputToken, outputToken])

    // UseEffect - Reset input/output token amounts when refetchData is true
    useEffect(() => {
        if (refetchData) {
            setInputTokenAmount(new BigNumber(0))
            setOutputTokenAmount(new BigNumber(0))
        }
    }, [refetchData])

    // UseEffect - When poolData changes, reset input/output tokens
    useEffect(() => {
        setInputToken(poolData.token0)
        setOutputToken(poolData.token1)
    }, [poolData])

    // UseEffect - Optimal Swap Calculation
    useEffect(() => {
        // Calculated here so it is pre-calculated when the expand is opened
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
        <VStack
            w={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={5}
            pb={isSwapOpen ? 2 : 0}
            borderTop={"4px solid"}
            borderColor={"blue"}
        >
            <HStack
                justifyContent={"space-between"}
                w={"100%"}
                py={3}
                cursor={"pointer"}
                onClick={() =>
                    setIsSwapOpen((prevState) => ({
                        ...prevState,
                        [poolName]: !prevState[poolName],
                    }))
                }
                px={5}
            >
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isSwapOpen ? 45 : 0}deg)`}
                    borderRadius={"full"}
                />
                <Text fontSize={"lg"} fontWeight={"semibold"} className={"bgPage"} px={3} py={1} borderRadius={"full"} textAlign={"center"}>
                    Swap Tokens
                </Text>
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isSwapOpen ? 135 : 180}deg)`}
                    borderRadius={"full"}
                />
            </HStack>
            {isSwapOpen && (
                <VStack w={"100%"} gap={0}>
                    <OptimalSwapContainer optimalSwap={optimalSwap} calculationType={calculationType} setCalculationType={setCalculationType} />
                    <HStack w={"100%"} gap={0} px={1}>
                        <Grid
                            w="100%"
                            templateColumns="repeat(4, auto)"
                            columnGap={{ base: 1, xl: 3 }}
                            rowGap={2}
                            justifyContent="center"
                            alignItems="center"
                            pb={3}
                            pl={{ base: 0, xl: 10 }}
                        >
                            <GridItem>
                                <Text>{currentScreenSize === "base" ? "Send" : "You send"}</Text>
                            </GridItem>
                            <GridItem>
                                <HStack maxW={{ base: "90px", xl: "100px" }} position="relative">
                                    <Input
                                        variant={"ValueInput"}
                                        type="number"
                                        maxH="35px"
                                        pr={"30px"}
                                        placeholder=""
                                        value={Number(inputTokenAmount) == 0 ? "" : formatDecimals(Number(inputTokenAmount))}
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()} // Stop the input from changing on scroll
                                        onChange={(e) => {
                                            const inputValue = Number(e.target.value)
                                            const maxAmount = userBalance[inputToken.name.toLowerCase()]

                                            if (inputValue <= 0 || maxAmount.isLessThan(0.01)) {
                                                setInputTokenAmount(new BigNumber(0))
                                                setOutputTokenAmount(new BigNumber(0))
                                            } else if (inputValue <= Number(maxAmount)) {
                                                setInputTokenAmount(new BigNumber(inputValue))
                                                setOutputTokenAmount(
                                                    getOutputAmount(new BigNumber(inputValue), inputToken.tokenAmount, outputToken.tokenAmount)
                                                )
                                            } else {
                                                setInputTokenAmount(maxAmount)
                                                setOutputTokenAmount(getOutputAmount(maxAmount, inputToken.tokenAmount, outputToken.tokenAmount))
                                            }
                                        }}
                                    />
                                    {userBalance[inputToken.name.toLowerCase()] < 0.01 && (
                                        <Box position="absolute" top="48%" left="28%" transform="translate(-50%, -50%)" fontSize="lg">
                                            <Tooltip
                                                className="tooltip"
                                                closeOnClick={false}
                                                gutter={8}
                                                label={
                                                    <VStack className="tooltipLabel" textAlign={"center"} fontWeight={"bold"}>
                                                        <Text>No tokens to swap!</Text>
                                                        <Text>Your {inputToken.emoji} balance is 0</Text>
                                                    </VStack>
                                                }
                                                placement={"right"}
                                                borderRadius={"full"}
                                                hasArrow={true}
                                                closeDelay={0}
                                                openDelay={100}
                                            >
                                                <FontAwesomeIcon icon={faTriangleExclamation} color={"orange"} cursor={"help"} />
                                            </Tooltip>
                                        </Box>
                                    )}
                                    <Box
                                        position="absolute"
                                        top="48%"
                                        left="80%"
                                        transform="translate(-50%, -50%)"
                                        pointerEvents="none"
                                        fontSize="lg"
                                    >
                                        <Text>{inputToken.emoji}</Text>
                                    </Box>
                                </HStack>
                            </GridItem>
                            <GridItem>
                                <Text>{currentScreenSize === "base" ? "market value" : "with a market value of"}</Text>
                            </GridItem>
                            <GridItem minW={{ base: "80px", xl: "120px" }}>
                                <TextHighlightContainer
                                    text={`$${formatDecimals(Number(inputTokenAmount.multipliedBy(inputToken.marketPrice)))}`}
                                    fontWeight={"semibold"}
                                />
                            </GridItem>

                            <GridItem></GridItem>
                            <GridItem>
                                <HStack w={"100%"} justifyContent={"end"}>
                                    <Button
                                        variant={"SwitchTokenButton"}
                                        onClick={() => {
                                            // Switch input/output tokens
                                            setInputToken(inputToken.name === poolData.token0.name ? poolData.token1 : poolData.token0)
                                            setOutputToken(inputToken.name === poolData.token0.name ? poolData.token0 : poolData.token1)

                                            // Reset input/output token amounts
                                            setInputTokenAmount(new BigNumber(0))
                                            setOutputTokenAmount(new BigNumber(0))
                                        }}
                                        p={0}
                                        maxW={"20px"}
                                        maxH={"25px"}
                                        borderRadius={"full"}
                                    >
                                        <Box transform="rotate(90deg)">
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                                        </Box>
                                    </Button>
                                </HStack>
                            </GridItem>
                            <GridItem>
                                <Text w={"100%"} textAlign={"end"}>
                                    {currentScreenSize === "base" ? "est." : "your estimated"}{" "}
                                    {valueDelta.isGreaterThanOrEqualTo(0) ? "profit" : "loss"}
                                </Text>
                            </GridItem>
                            <GridItem minW={"85px"}>
                                <TextHighlightContainer
                                    text={`${valueDelta.isGreaterThan(0) ? "+ " : valueDelta.isLessThan(0) ? "- " : ""}$${
                                        valueDelta.isZero() ? "0" : formatDecimals(Number(valueDelta.abs()))
                                    }`}
                                    bg={valueDelta.isGreaterThan(0) ? "green" : valueDelta.isLessThan(0) ? "red" : null}
                                    fontWeight={"bold"}
                                />
                            </GridItem>

                            <GridItem>
                                <Text>{currentScreenSize === "base" ? "Get" : "You get"}</Text>
                            </GridItem>
                            <GridItem>
                                <HStack maxW={{ base: "90px", xl: "100px" }} position="relative">
                                    <Input
                                        variant={"ValueInput"}
                                        maxH={"35px"}
                                        placeholder=""
                                        isDisabled={true}
                                        value={outputTokenAmount.isGreaterThan(0) ? formatDecimals(Number(outputTokenAmount)) : ""}
                                    />
                                    <Box
                                        position="absolute"
                                        top="48%"
                                        left="80%"
                                        transform="translate(-50%, -50%)"
                                        pointerEvents="none"
                                        fontSize="lg"
                                    >
                                        <Text>{outputToken.emoji}</Text>
                                    </Box>
                                </HStack>
                            </GridItem>
                            <GridItem>
                                <Text>{currentScreenSize === "base" ? "market value" : "with a market value of"}</Text>
                            </GridItem>
                            <GridItem minW={{ base: "80px", xl: "120px" }}>
                                <TextHighlightContainer
                                    text={`$${formatDecimals(Number(outputTokenAmount.multipliedBy(outputToken.marketPrice)))}`}
                                    fontWeight={"semibold"}
                                />
                            </GridItem>
                        </Grid>
                    </HStack>
                    <ExecuteSwapButton
                        wagmiProviderConfig={wagmiProviderConfig}
                        poolName={poolName}
                        setPoolsToFetch={setPoolsToFetch}
                        inputToken={inputToken}
                        outputToken={outputToken}
                        inputTokenAmount={inputTokenAmount}
                        setInputTokenAmount={setInputTokenAmount}
                        setRefetchData={setRefetchData}
                    />
                    <PoolPriceContainer
                        title={"Estimated Pool Prices After Swap"}
                        poolData={estimatedPoolData}
                        opacity={inputTokenAmount.isGreaterThan(0) ? 1 : 0.5}
                    />
                    <Box h={"10px"} />
                    <Box w={"100%"} opacity={inputTokenAmount.isGreaterThan(0) ? 1 : 0.5}>
                        <PoolChartsContainer poolData={estimatedPoolData} chartDomainData={poolData} />
                    </Box>
                </VStack>
            )}
        </VStack>
    )
}
