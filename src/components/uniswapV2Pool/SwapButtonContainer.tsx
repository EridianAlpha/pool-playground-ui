import { HStack, Input, Text, VStack, InputGroup, InputLeftAddon, Button, Grid, GridItem } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faChevronRight, faCircleCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons"

import TextHighlightContainer from "./TextHighlightContainer"

export default function SwapButtonContainer() {
    return (
        <VStack w={"100%"} justifyContent={"center"} alignItems={"center"} gap={5} pt={2} pb={3} borderY={"4px solid"} borderColor={"blue"}>
            <Grid w="100%" templateColumns="repeat(4, auto)" columnGap={3} rowGap={5} justifyContent="center" alignItems="center">
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
                    <TextHighlightContainer text={"$100"} />
                </GridItem>
                <GridItem>
                    <Text>You get</Text>
                </GridItem>
                <GridItem>
                    <InputGroup maxH={"30px"} w={"100px"}>
                        <InputLeftAddon maxH={"30px"} px={1}>
                            🪵
                        </InputLeftAddon>
                        <Input maxH={"30px"} maxW={"80px"} placeholder="" />
                    </InputGroup>
                </GridItem>
                <GridItem>
                    <Text>with a market value of</Text>
                </GridItem>
                <GridItem>
                    <TextHighlightContainer text={"$200"} />
                </GridItem>
            </Grid>

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
    )
}
