import { useState } from "react"

import { HStack, VStack, Text, Tooltip } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"

export default function TxInfoTooltip() {
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)

    const handleClick = () => {
        setIsInfoTooltipOpen((prev) => !prev)
    }

    const handleMouseEnter = () => {
        if (!isInfoTooltipOpen) {
            setIsInfoTooltipOpen(true)
        }
    }

    const handleMouseLeave = () => {
        if (isInfoTooltipOpen) {
            setIsInfoTooltipOpen(false)
        }
    }

    return (
        <VStack
            className="bgContent"
            mt={"-20px"}
            pt={7}
            pb={2}
            w={"100%"}
            borderBottomRadius={"20px"}
            cursor={"help"}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Tooltip
                className="tooltip"
                closeOnClick={false}
                gutter={12}
                label={
                    <VStack className="tooltipLabel" alignItems={"center"} fontWeight={"semibold"}>
                        <VStack className="bgPage" py={1} px={6} borderRadius={"full"} gap={1} fontWeight={"bold"}>
                            <HStack>
                                <FontAwesomeIcon icon={faInfoCircle} size={"lg"} />
                                <Text>TESTNET ONLY</Text>
                                <FontAwesomeIcon icon={faInfoCircle} size={"lg"} />
                            </HStack>
                            <Text>No real money is ever used in this playground</Text>
                        </VStack>
                        <Text textAlign={"center"} fontSize={"md"} fontWeight={"bold"} w={"100%"}>
                            This single transaction performs all the following actions
                        </Text>
                        <VStack alignItems={"start"} w={"100%"}>
                            <Text>1. Creates a new ERC20 Token called Diamond 💎</Text>
                            <Text>2. Creates a new ERC20 Token called Wood 🪵</Text>
                            <Text>3. Creates a new ERC20 Token called Stone 🪨</Text>
                            <Text>4. Creates a new UniswapV2 Pool Diamond/Wood + adds liquidity</Text>
                            <Text>5. Creates a new UniswapV2 Pool Diamond/Stone + adds liquidity</Text>
                            <Text>6. Creates a new UniswapV2 Pool Wood/Stone + adds liquidity</Text>
                            <Text>7. Sends the initial balance of Diamond, Wood and Stone to the user </Text>
                        </VStack>
                    </VStack>
                }
                placement={"bottom"}
                borderRadius={"20px"}
                maxW={"100vw"}
                hasArrow={true}
                closeDelay={0}
                openDelay={100}
                isOpen={isInfoTooltipOpen}
            >
                <Text fontWeight={"semibold"}>What does this transaction do?</Text>
            </Tooltip>
        </VStack>
    )
}
