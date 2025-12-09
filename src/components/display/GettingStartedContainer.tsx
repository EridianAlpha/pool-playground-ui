import { HStack, VStack, Text, Box } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons"

import { useWallet } from "../../utils/useWallet"

export default function GettingStartedContainer() {
    const { address } = useWallet()
    const isConnected = !!address

    return (
        <VStack maxW={"500px"} gap={0} flexGrow={1}>
            <Text
                className="headingContainer"
                fontSize={"xl"}
                fontWeight={"bold"}
                w={"fit-content"}
                px={5}
                py={1}
                borderTopRadius={"15px"}
                mb={"-4px"}
                zIndex={2}
            >
                Getting Started
            </Text>
            <VStack w={"100%"} gap={4} borderRadius={"15px"} className="contentContainer" py={4} px={5} alignItems={"start"}>
                <HStack color={isConnected ? "green" : null}>
                    <Box position={"relative"}>
                        <FontAwesomeIcon icon={isConnected ? faCheckCircle : faCircle} size="xl" />
                        {!isConnected && (
                            <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" fontSize="md" fontWeight="bold">
                                1
                            </Text>
                        )}
                    </Box>
                    <Text fontWeight={"bold"}>Connect your wallet</Text>
                </HStack>
                <HStack>
                    <Box position={"relative"}>
                        <FontAwesomeIcon icon={faCircle} size="xl" />
                        <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" fontSize="md" fontWeight="bold">
                            2
                        </Text>
                    </Box>
                    <Text fontWeight={"bold"}>Deploy your playground</Text>
                </HStack>
            </VStack>
        </VStack>
    )
}
