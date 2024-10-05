import { useState, useEffect } from "react"

import { HStack, Input, Text, VStack, Button, Grid, GridItem, Box } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faArrowRightArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import PoolChartsContainer from "./PoolChartsContainer"
import OptimalSwapContainer from "./OptimalSwapContainer"

export default function SwapContainer({ poolData, userBalance }) {
    const [isExpanded, setIsExpanded] = useState(true) // TODO: Set to false when done testing
    const [inputTokenAmount, setInputTokenAmount] = useState(0)
    const [outputTokenAmount, setOutputTokenAmount] = useState(0)
    const [inputToken, setInputToken] = useState(poolData.token0)
    const [outputToken, setOutputToken] = useState(poolData.token1)
    const [estimatedPoolData, setEstimatedPoolData] = useState(poolData)
    const [valueDelta, setValueDelta] = useState(0)

    function getOutputAmount(inputAmount, inputReserve, outputReserve) {
        const inputAmountWithFee = inputAmount * 0.997 // Apply 0.3% fee
        const numerator = inputAmountWithFee * outputReserve
        const denominator = inputReserve + inputAmountWithFee
        const outputAmount = numerator / denominator
        return outputAmount
    }

    // estimatedPoolData is a copy of poolData with the token amounts updated to reflect the swap including the fee
    useEffect(() => {
        if (!inputTokenAmount || inputTokenAmount === 0) {
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
                const dx = inputTokenAmount
                const x = poolData.token0.tokenAmount
                const y = poolData.token1.tokenAmount

                // Effective amount of Token0 after fee
                const dx_fee = dx * feeFactor

                // Calculate the output amount of Token1 using Uniswap formula
                const dy = (dx_fee * y) / (x + dx_fee)

                // Update pool reserves
                tempPoolData.token0.tokenAmount += dx // Full amount added to Token0 reserve
                tempPoolData.token1.tokenAmount -= dy // Amount subtracted from Token1 reserve
            } else {
                // Swapping Token1 for Token0
                const dy = inputTokenAmount
                const x = poolData.token0.tokenAmount
                const y = poolData.token1.tokenAmount

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

    useEffect(() => {
        setValueDelta(outputTokenAmount * outputToken.marketPrice - inputTokenAmount * inputToken.marketPrice)
    }, [estimatedPoolData, inputTokenAmount, outputTokenAmount, inputToken, outputToken])

    return (
        <VStack w={"100%"} justifyContent={"center"} alignItems={"center"} gap={5} py={3} borderTop={"4px solid"} borderColor={"blue"}>
            <HStack justifyContent={"space-between"} w={"100%"} cursor={"pointer"} onClick={() => setIsExpanded((prev) => !prev)} px={5}>
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isExpanded ? 45 : 0}deg)`}
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
                    transform={`rotate(${isExpanded ? 135 : 180}deg)`}
                    borderRadius={"full"}
                />
            </HStack>
            {isExpanded && (
                <VStack w={"100%"} gap={0}>
                    <OptimalSwapContainer poolData={poolData} userBalance={userBalance} />
                    <HStack w={"100%"} minW={"400px"} gap={0}>
                        <Grid
                            w="100%"
                            templateColumns="repeat(4, auto)"
                            columnGap={3}
                            rowGap={2}
                            justifyContent="center"
                            alignItems="center"
                            pb={3}
                            px={5}
                        >
                            <GridItem>
                                <Text>You send</Text>
                            </GridItem>
                            <GridItem>
                                <HStack maxW="90px" position="relative">
                                    <Input
                                        variant={"ValueInput"}
                                        type="number"
                                        maxH="35px"
                                        pr={"30px"}
                                        placeholder=""
                                        value={inputTokenAmount == 0 ? "" : inputTokenAmount}
                                        onChange={(e) => {
                                            const inputValue = Number(e.target.value)
                                            const maxAmount = userBalance[inputToken.name.toLowerCase()]
                                            if (inputValue <= maxAmount) {
                                                setInputTokenAmount(inputValue)
                                                setOutputTokenAmount(getOutputAmount(inputValue, inputToken.tokenAmount, outputToken.tokenAmount))
                                            } else {
                                                setInputTokenAmount(maxAmount)
                                                setOutputTokenAmount(getOutputAmount(maxAmount, inputToken.tokenAmount, outputToken.tokenAmount))
                                            }
                                        }}
                                    />
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
                                <Text>with a market value of</Text>
                            </GridItem>
                            <GridItem minW={"80px"}>
                                <TextHighlightContainer text={`$${(inputTokenAmount * inputToken.marketPrice).toFixed(0)}`} fontWeight={"semibold"} />
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
                                            setInputTokenAmount(0)
                                            setOutputTokenAmount(0)
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
                                    your estimated {valueDelta >= 0 ? "profit" : "loss"}
                                </Text>
                            </GridItem>
                            <GridItem>
                                <TextHighlightContainer
                                    text={`${valueDelta >= 0 ? "+" : "-"} $${Math.abs(valueDelta).toFixed(0)}`}
                                    bg={valueDelta >= 0 ? "green" : "red"}
                                    fontWeight={"bold"}
                                />
                            </GridItem>

                            <GridItem>
                                <Text>You get</Text>
                            </GridItem>
                            <GridItem>
                                <HStack maxW="90px" position="relative">
                                    <Input
                                        variant={"ValueInput"}
                                        maxH={"35px"}
                                        placeholder=""
                                        isDisabled={true}
                                        value={outputTokenAmount > 0 ? outputTokenAmount.toFixed(1) : ""}
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
                                <Text>with a market value of</Text>
                            </GridItem>
                            <GridItem minW={"80px"}>
                                <TextHighlightContainer
                                    text={`$${(outputTokenAmount * outputToken.marketPrice).toFixed(0)}`}
                                    fontWeight={"semibold"}
                                />
                            </GridItem>
                        </Grid>
                    </HStack>
                    <PoolPriceContainer title={"Estimated Pool Prices After Swap"} poolData={estimatedPoolData} />
                    <Box h={"10px"} />
                    <PoolChartsContainer poolData={estimatedPoolData} chartDomainData={poolData} />
                    <HStack gap={0} justifyContent={"space-around"} w={"100%"} flexWrap={"nowrap"} maxW={"450px"} pb={1}>
                        <Button maxH={"40px"} variant={"ExecuteSwap"} borderRadius={"full"}>
                            <HStack>
                                <Text>Execute swap</Text>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </HStack>
                        </Button>
                    </HStack>
                </VStack>
            )}
        </VStack>
    )
}
