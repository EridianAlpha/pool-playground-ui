import { useState } from "react"

import { HStack, Input, Text, VStack, InputGroup, InputRightAddon, Button, Grid, GridItem, Box } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import PoolChartsContainer from "./PoolChartsContainer"

export default function SwapContainer({ poolData, userBalance }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [inputTokenAmount, setInputTokenAmount] = useState(0)
    const [outputTokenAmount, setOutputTokenAmount] = useState(0)
    const [inputToken, setInputToken] = useState(poolData.token0)
    const [outputToken, setOutputToken] = useState(poolData.token1)

    // TODO: Add logic and button to switch between token0 and token1 as input token
    // TODO: Add "optimum" input button that calculates the input amount that would result in the highest output amount

    function getOutputAmount(inputAmount, inputReserve, outputReserve) {
        const inputAmountWithFee = inputAmount * 0.997 // Apply 0.3% fee
        const numerator = inputAmountWithFee * outputReserve
        const denominator = inputReserve + inputAmountWithFee
        const outputAmount = numerator / denominator
        return outputAmount
    }

    // estimatedPoolData is a copy of poolData with the token amounts updated to reflect the swap

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
                <VStack gap={0} w={"100%"} pb={2}>
                    <Grid
                        w="100%"
                        templateColumns="repeat(4, auto)"
                        columnGap={3}
                        rowGap={3}
                        justifyContent="start"
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
                                <Box position="absolute" top="48%" left="80%" transform="translate(-50%, -50%)" pointerEvents="none" fontSize="lg">
                                    <Text>{inputToken.emoji}</Text>
                                </Box>
                            </HStack>
                        </GridItem>
                        <GridItem>
                            <Text>with a market value of</Text>
                        </GridItem>
                        <GridItem>
                            <TextHighlightContainer text={`$${(inputTokenAmount * inputToken.marketPrice).toFixed(0)}`} fontWeight={"semibold"} />
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
                                <Box position="absolute" top="48%" left="80%" transform="translate(-50%, -50%)" pointerEvents="none" fontSize="lg">
                                    <Text>{outputToken.emoji}</Text>
                                </Box>
                            </HStack>
                        </GridItem>
                        <GridItem>
                            <Text>with a market value of</Text>
                        </GridItem>
                        <GridItem>
                            <TextHighlightContainer text={`$${(outputTokenAmount * outputToken.marketPrice).toFixed(0)}`} fontWeight={"semibold"} />
                        </GridItem>
                    </Grid>
                    <PoolPriceContainer title={"Estimated Pool Prices After Swap"} poolData={poolData} />
                    <PoolChartsContainer poolData={poolData} />
                    <HStack gap={0} justifyContent={"space-around"} w={"100%"} flexWrap={"nowrap"} maxW={"450px"}>
                        <HStack>
                            <Text>Estimated profit/loss</Text>
                            <TextHighlightContainer text={"+ $200"} bg={"green"} fontWeight={"bold"} />
                        </HStack>
                        <Button maxH={"32px"} variant={"ExecuteSwap"} borderRadius={"full"}>
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
