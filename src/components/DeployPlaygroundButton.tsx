import { Button, HStack, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"

export default function ResetPlaygroundButton() {
    return (
        <HStack w={"100%"} flexGrow={1} justifyContent={"center"}>
            <Button h={"fit-content"} borderRadius={"full"} py={2} px={5} variant={"DeployPlaygroundButton"} minW="fit-content">
                <HStack>
                    <FontAwesomeIcon icon={faCirclePlay} size="xl" />
                    <Text fontSize={"xl"}>Deploy Playground</Text>
                </HStack>
            </Button>
        </HStack>
    )
}
