import { useState } from "react"

import { HStack, Text, VStack, Box, Tooltip } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

export default function OptimalSwapContainer({ poolData, userBalance }) {
    const [isOptimalSwapVisible, setIsOptimalSwapVisible] = useState(false)

    return (
        <HStack gap={1} pb={5} px={3} justifyContent={"center"} w={"100%"}>
            <Text
                fontWeight={"semibold"}
                className={"bgPage"}
                px={4}
                py={1}
                w={"fit-content"}
                borderRadius={"full"}
                textAlign={"center"}
                cursor={"default"}
                h={"100%"}
            >
                Optimal swap to balance pool
            </Text>
            <HStack
                className={"bgPage"}
                px={4}
                py={1}
                borderRadius={"full"}
                overflow={"hidden"}
                position={"relative"}
                onClick={() => setIsOptimalSwapVisible(true)}
                cursor={"pointer"}
            >
                {!isOptimalSwapVisible && (
                    <Box
                        id="stickers"
                        w={"100%"}
                        h={"100%"}
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        className="bgPage"
                    >
                        <Text w={"100%"} h={"100%"} textAlign={"center"} pt={1}>
                            Click to show
                        </Text>
                    </Box>
                )}
                <Text minW={"fit-content"}>You send 114.15 {poolData.token0.emoji}</Text>
                <Tooltip
                    className="tooltip"
                    closeOnClick={false}
                    gutter={8}
                    label={
                        <VStack className="tooltipLabel" textAlign={"center"}>
                            <Text fontWeight={"bold"}>You do not have enough {poolData.token0.emoji} tokens to make this optimal swap!</Text>
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
            </HStack>
        </HStack>
    )
}
