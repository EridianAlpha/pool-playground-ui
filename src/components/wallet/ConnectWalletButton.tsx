import { Text, Button, VStack } from "@chakra-ui/react"
import { useConnectModal } from "@rainbow-me/rainbowkit"

export default function ConnectWalletButton() {
    const { openConnectModal } = useConnectModal()

    return (
        <VStack gap={0}>
            <Button
                minH="60px"
                maxW="300px"
                w="100%"
                py={3}
                px={8}
                variant="RainbowButton"
                className="rainbowButtonAnimation"
                fontSize="2xl"
                borderRadius="full"
                h={"fit-content"}
                whiteSpace="normal"
                textAlign="center"
                onClick={openConnectModal}
                fontWeight={"extrabold"}
            >
                <VStack gap={1}>
                    <Text>Connect wallet</Text>
                </VStack>
            </Button>
        </VStack>
    )
}
