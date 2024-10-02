import { HStack, Text, VStack } from "@chakra-ui/react"

export default function UniswapV2PoolContainer({ provider }) {
    const PoolContainer = ({ title }) => {
        return (
            <VStack minH={"50vh"} w={"100%"} className="contentContainer" borderRadius="30px">
                <Text textAlign={"center"}>{title}</Text>
            </VStack>
        )
    }

    return (
        <HStack w={"100%"} gap={3}>
            <PoolContainer title={"Gold/Silver Pool"} />
            <PoolContainer title={"Silver/Bronze Pool"} />
            <PoolContainer title={"Bronze/Gold Pool"} />
        </HStack>
    )
}
