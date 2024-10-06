import { Button, HStack, VStack, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"

export default function ResetPlaygroundButton({ isConnectedAddressPlaygroundDeployed, setIsConnectedAddressPlaygroundDeployed }) {
    return (
        <VStack>
            <HStack w={"100%"} justifyContent={"center"}>
                <Button
                    h={"fit-content"}
                    borderRadius={"full"}
                    py={2}
                    px={5}
                    variant={isConnectedAddressPlaygroundDeployed ? "ResetPlaygroundButton" : "DeployPlaygroundButton"}
                    minW="fit-content"
                    onClick={() => {
                        setIsConnectedAddressPlaygroundDeployed((prev) => !prev)
                    }}
                >
                    <HStack>
                        <FontAwesomeIcon icon={isConnectedAddressPlaygroundDeployed ? faRotateRight : faCirclePlay} size="xl" />
                        <Text fontSize={"xl"}>{isConnectedAddressPlaygroundDeployed ? "Reset playground" : "Deploy playground"}</Text>
                    </HStack>
                </Button>
            </HStack>
        </VStack>
    )
}
