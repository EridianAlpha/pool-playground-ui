import { useState } from "react"

import { HStack, Input, Text, VStack, InputGroup, InputLeftAddon, Button, Grid, GridItem, Box } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons"

import TextHighlightContainer from "./TextHighlightContainer"
import PoolPriceContainer from "./PoolPriceContainer"
import PoolChartsContainer from "./PoolChartsContainer"

export default function SwapContainer({ poolData }) {
    const [isExpanded, setIsExpanded] = useState(false)

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
                    <Grid w="100%" templateColumns="repeat(4, auto)" columnGap={3} rowGap={5} justifyContent="center" alignItems="center" pb={3}>
                        <GridItem>
                            <Text>You send</Text>
                        </GridItem>
                        <GridItem>
                            <InputGroup maxH={"30px"} w={"100px"}>
                                <InputLeftAddon maxH={"30px"} px={1}>
                                    💎
                                </InputLeftAddon>
                                <Input maxH={"30px"} maxW={"80px"} placeholder="" />
                            </InputGroup>
                        </GridItem>
                        <GridItem>
                            <Text>with a market value of</Text>
                        </GridItem>
                        <GridItem>
                            <TextHighlightContainer text={"$100"} fontWeight={"semibold"} />
                        </GridItem>
                        <GridItem>
                            <Text>You get</Text>
                        </GridItem>
                        <GridItem>
                            <InputGroup maxH={"30px"} w={"100px"}>
                                <InputLeftAddon maxH={"30px"} px={1}>
                                    🪵
                                </InputLeftAddon>
                                <Input maxH={"30px"} maxW={"80px"} placeholder="" isDisabled={true} />
                            </InputGroup>
                        </GridItem>
                        <GridItem>
                            <Text>with a market value of</Text>
                        </GridItem>
                        <GridItem>
                            <TextHighlightContainer text={"$200"} fontWeight={"semibold"} />
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
