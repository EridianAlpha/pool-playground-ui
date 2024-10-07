import { Button, HStack, VStack, Text, Spinner } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"

export default function ResetPlaygroundButton({ wagmiProviderConfig, tokenAddresses, isFetchingTokenAddresses }) {
    return (
        <VStack>
            <HStack w={"100%"} justifyContent={"center"}>
                <Button
                    h={"fit-content"}
                    borderRadius={"full"}
                    py={2}
                    px={5}
                    variant={Object.keys(tokenAddresses).length === 0 ? "DeployPlaygroundButton" : "ResetPlaygroundButton"}
                    minW="fit-content"
                    onClick={() => {
                        console.log("Deploying playground...")
                    }}
                >
                    {isFetchingTokenAddresses ? (
                        <HStack>
                            <Spinner />
                            <Text fontSize={"xl"}>Loading data...</Text>
                        </HStack>
                    ) : (
                        <HStack>
                            <FontAwesomeIcon icon={Object.keys(tokenAddresses).length === 0 ? faCirclePlay : faRotateRight} size="xl" />
                            <Text fontSize={"xl"}>{Object.keys(tokenAddresses).length === 0 ? "Deploy playground" : "Reset playground"}</Text>
                        </HStack>
                    )}
                </Button>
            </HStack>
        </VStack>
    )
}
