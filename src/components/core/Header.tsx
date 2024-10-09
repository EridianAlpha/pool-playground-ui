import {
    Box,
    Text,
    HStack,
    VStack,
    Button,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useColorMode,
    Tooltip,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faSun, faMoon, faBars, faSatelliteDish } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

function HeaderButtons({ displayZone, buttonLabels, useCustomRpc, setUseCustomRpc }) {
    const { colorMode, toggleColorMode } = useColorMode()

    const CustomButtonTooltip = ({ labelText, children }) => {
        return (
            <Tooltip
                className="tooltip"
                closeOnClick={false}
                gutter={8}
                label={
                    <VStack className="tooltipLabel">
                        <Text fontWeight={"bold"}>{labelText}</Text>
                    </VStack>
                }
                placement={"bottom"}
                borderRadius={"full"}
                hasArrow={true}
                closeDelay={0}
                openDelay={0}
                isDisabled={displayZone === "drawer"}
            >
                {children}
            </Tooltip>
        )
    }

    return (
        <>
            {displayZone == "drawer" && (
                <Text fontWeight={"bold"} pl={1} pt={1} fontSize={"lg"}>
                    Links
                </Text>
            )}
            <Link href={"https://github.com/EridianAlpha/pool-playground-ui"} target="_blank">
                <Button variant={"HeaderButton"} aria-label={"View GitHub Source"} borderRadius={"full"} p={2}>
                    <HStack gap={3}>
                        <FontAwesomeIcon icon={faGithub} size={"xl"} />
                        {buttonLabels && <Text pr={1}>UI Repo</Text>}
                    </HStack>
                </Button>
            </Link>
            <Link href={"https://github.com/EridianAlpha/pool-playground"} target="_blank">
                <Button variant={"HeaderButton"} aria-label={"View GitHub Source"} borderRadius={"full"} p={2}>
                    <HStack gap={3}>
                        <FontAwesomeIcon icon={faGithub} size={"xl"} />
                        {buttonLabels && <Text pr={1}>Contract Repo</Text>}
                    </HStack>
                </Button>
            </Link>
            {displayZone == "header" && <Box borderLeftWidth={1} className={"borderColorDivider"} height={8} />}
            {displayZone == "drawer" && (
                <Text fontWeight={"bold"} pl={1} pt={3} fontSize={"lg"}>
                    Settings
                </Text>
            )}
            <CustomButtonTooltip labelText="Use a custom RPC">
                <Button
                    variant={"HeaderButton"}
                    px={2}
                    aria-label="Use a custom RPC"
                    onClick={() => {
                        setUseCustomRpc(!useCustomRpc)
                    }}
                    borderRadius={"full"}
                >
                    <HStack gap={3}>
                        <Box color={useCustomRpc ? "orange" : null}>
                            <FontAwesomeIcon icon={faSatelliteDish} size={"xl"} />
                        </Box>
                        {displayZone == "drawer" && <Text pr={1}>Use a custom RPC</Text>}
                    </HStack>
                </Button>
            </CustomButtonTooltip>
            <CustomButtonTooltip labelText="Toggle color theme">
                <Button variant={"HeaderButton"} px={2} aria-label="Toggle color theme" onClick={toggleColorMode} borderRadius={"full"}>
                    <HStack gap={3}>
                        {colorMode == "light" ? <FontAwesomeIcon icon={faMoon} size={"xl"} /> : <FontAwesomeIcon icon={faSun} size={"xl"} />}
                        {displayZone == "drawer" && <Text pr={1}>Toggle color theme</Text>}
                    </HStack>
                </Button>
            </CustomButtonTooltip>
        </>
    )
}

export default function Header({ useCustomRpc, setUseCustomRpc }) {
    const isSSR = typeof window === "undefined"
    const { isOpen, onOpen, onClose } = useDisclosure()

    function navigateHome() {
        if (!isSSR) {
            window.history.replaceState({}, "", `${window.location.pathname}`)
            window.location.reload()
        }
    }

    return (
        <HStack width="100vw" borderBottomWidth={1} className={"borderColorDivider"} justifyContent={"center"}>
            <Box width="100%" px={{ base: "10px", xl: "3rem" }} maxW="1780px">
                <HStack h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack spacing={3} alignItems={"center"} cursor={"pointer"} onClick={navigateHome}>
                        <Text mt={"-5px"} fontSize={"5xl"}>
                            🏖️️
                        </Text>
                        <Box pr={2} minW={"fit-content"} fontWeight="extrabold" fontSize="xl" whiteSpace="nowrap" overflow="hidden">
                            Pool Playground
                        </Box>
                    </HStack>
                    <HStack display={{ base: "none", xl: "flex" }} spacing={5}>
                        <HeaderButtons displayZone={"header"} buttonLabels={true} useCustomRpc={useCustomRpc} setUseCustomRpc={setUseCustomRpc} />
                    </HStack>
                    <Button
                        variant={"HeaderButton"}
                        aria-label="Open Menu"
                        display={{ base: "flex", xl: "none" }}
                        onClick={onOpen}
                        borderRadius={"full"}
                        p={0}
                    >
                        <FontAwesomeIcon icon={faBars} size={"lg"} />
                    </Button>
                </HStack>
            </Box>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <VStack spacing={5} alignItems={"start"}>
                            <HeaderButtons displayZone={"drawer"} buttonLabels={true} useCustomRpc={useCustomRpc} setUseCustomRpc={setUseCustomRpc} />
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </HStack>
    )
}
