import { useState, useEffect } from "react"

import { HStack, Text, Button } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

export default function ExecuteSwapButton({ wagmiProviderConfig }) {
    return (
        <Button maxH={"40px"} variant={"ExecuteSwap"} borderRadius={"full"} my={1}>
            <HStack>
                <Text>Execute swap</Text>
                <FontAwesomeIcon icon={faArrowRight} />
            </HStack>
        </Button>
    )
}
