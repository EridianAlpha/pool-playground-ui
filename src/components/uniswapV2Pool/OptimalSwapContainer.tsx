import { useState } from "react"
import { HStack, Text, VStack, Box, Tooltip, Menu, MenuButton, Button, MenuList, MenuItemOption, MenuOptionGroup } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faTriangleExclamation, faChevronDown } from "@fortawesome/free-solid-svg-icons"

export default function OptimalSwapContainer({ optimalSwap, calculationType, setCalculationType }) {
    const [isOptimalSwapVisible, setIsOptimalSwapVisible] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <HStack gap={2} mb={5} justifyContent={"center"} w={"100%"}>
            <Menu variant={"OptimalSwapTypeSelector"} placement="bottom-start" gutter={3} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <MenuButton
                    as={Button}
                    variant={"OptimalSwapTypeSelector"}
                    borderRadius={"full"}
                    onClick={() => setIsMenuOpen(true)}
                    className={"bgPage"}
                    pl={3}
                    pr={3}
                    maxH={"32px"}
                    minW={"270px"}
                >
                    <HStack gap={0} justifyContent={"space-between"} pb={"2px"} pt={"3px"}>
                        <Text pr={2}>Optimal swap {calculationType === "maxProfit" ? "for max profit" : "to balance pool"}</Text>
                        <Box>
                            <FontAwesomeIcon icon={faChevronDown} size={"sm"} />
                        </Box>
                    </HStack>
                </MenuButton>
                <MenuList minW={1}>
                    <MenuOptionGroup value={calculationType} type="radio">
                        <MenuItemOption value={"maxProfit"} onClick={() => setCalculationType("maxProfit")}>
                            Optimal swap for max profit
                        </MenuItemOption>
                        <MenuItemOption value={"balance"} onClick={() => setCalculationType("balance")}>
                            Optimal swap to balance pool
                        </MenuItemOption>
                    </MenuOptionGroup>
                </MenuList>
            </Menu>
            <HStack
                className={"bgPage"}
                px={3}
                py={1}
                borderRadius={"full"}
                overflow={"hidden"}
                position={"relative"}
                onClick={() => setIsOptimalSwapVisible(true)}
                minW={"150px"}
            >
                {/* Overlaying Box */}
                <Box
                    cursor={"pointer"}
                    w={"100%"}
                    h={"100%"}
                    position="absolute"
                    top="0"
                    left="0"
                    className="bgPage"
                    style={{
                        transform: isOptimalSwapVisible ? "translateX(100%)" : "translateX(0)",
                        transition: "transform 0.5s ease-in-out",
                        borderRadius: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(to right, transparent -20px, rgb(13, 166, 216, 1) 85px, #0da6d8 100%)",
                    }}
                >
                    <HStack w={"100%"} justifyContent={"end"} pr={3}>
                        <FontAwesomeIcon icon={faEye} size={"xl"} />
                    </HStack>
                </Box>

                {/* Underlying Content */}
                <Text minW={"fit-content"}>
                    You send {optimalSwap.optimalAmount.toFixed(2)} {optimalSwap.optimalTokenEmoji}
                </Text>
                {optimalSwap.isUserBalanceExceeded && (
                    <Tooltip
                        className="tooltip"
                        closeOnClick={false}
                        gutter={8}
                        label={
                            <VStack className="tooltipLabel" textAlign={"center"}>
                                <Text fontWeight={"bold"}>
                                    You do not have enough {optimalSwap.optimalTokenEmoji} tokens to make this optimal swap!
                                </Text>
                            </VStack>
                        }
                        placement={"right"}
                        borderRadius={"full"}
                        hasArrow={true}
                        closeDelay={0}
                        openDelay={100}
                    >
                        <FontAwesomeIcon icon={faTriangleExclamation} color={"orange"} />
                    </Tooltip>
                )}
            </HStack>
        </HStack>
    )
}
