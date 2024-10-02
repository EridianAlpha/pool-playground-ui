import { HStack, Text, VStack, Tooltip } from "@chakra-ui/react"

export default function TextHighlightContainer({ text, tooltipText = null, bg = null, fontWeight = null }) {
    return (
        <Tooltip
            className="tooltip"
            closeOnClick={false}
            gutter={10}
            label={
                <VStack className="tooltipLabel">
                    <Text fontWeight={"bold"}>{tooltipText}</Text>
                </VStack>
            }
            placement={"top"}
            borderRadius={"full"}
            hasArrow={true}
            closeDelay={0}
            openDelay={200}
            display={tooltipText ? "block" : "none"}
        >
            <HStack
                className={bg ? null : "bgPage"}
                gap={3}
                py={1}
                px={3}
                borderRadius={"full"}
                cursor={"default"}
                bg={bg ? bg : null}
                fontWeight={fontWeight ? fontWeight : null}
            >
                <Text textAlign={"center"}>{text}</Text>
            </HStack>
        </Tooltip>
    )
}
