import { HStack, Text, VStack, Tooltip } from "@chakra-ui/react"

export default function TextHighlightContainer({ text, tooltipText = null, bg = null, fontWeight = null, borderColor = null }) {
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
                py={0}
                px={2}
                borderRadius={"full"}
                cursor={tooltipText ? "help" : "default"}
                bg={bg ? bg : null}
                fontWeight={fontWeight ? fontWeight : null}
                w="fit-content"
                border={"3px solid"}
                // TODO: Update border color to use the correct color depending on the value
                borderColor={borderColor ? borderColor : "transparent"}
            >
                <Text textAlign={"center"}>{text}</Text>
            </HStack>
        </Tooltip>
    )
}
