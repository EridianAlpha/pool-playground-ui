import { useEffect, useState } from "react"
import { VStack, Text, Link, HStack, Box } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSatelliteDish, faUpRightFromSquare, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"
import { useRouter } from "next/router"

import config from "../../../public/data/config.json"

export default function AboutButton({ isAboutExpanded, setIsAboutExpanded }) {
    const router = useRouter()

    // Function to check if the current hash is "#about"
    const checkHash = () => {
        if (window.location.hash === "#about") {
            setIsAboutExpanded(true)
        } else {
            setIsAboutExpanded(false)
        }
    }

    useEffect(() => {
        // Check the hash initially when the component mounts
        checkHash()

        // Listen for route changes including hash changes
        const handleRouteChange = () => {
            checkHash()
        }

        // Subscribe to the route change start event
        router.events.on("hashChangeComplete", handleRouteChange)

        // Cleanup the event listener when the component unmounts
        return () => {
            router.events.off("hashChangeComplete", handleRouteChange)
        }
    }, [router.events])

    const SubHeading = ({ children }) => {
        return (
            <Text fontSize={"lg"} fontWeight={"bold"} className={"bgPage"} px={3} py={1} borderRadius={"full"} textAlign={"center"}>
                {children}
            </Text>
        )
    }

    return (
        <VStack id="about" borderRadius={"20px"} w={"100%"} textAlign={"justify"} gap={0} minW={"400px"} position={"relative"}>
            <HStack
                justifyContent={"space-between"}
                w={"100%"}
                maxW={"400px"}
                cursor={"pointer"}
                onClick={() => setIsAboutExpanded((prev) => !prev)}
                className={isAboutExpanded ? "headingContainer" : "contentContainer"}
                py={2}
                px={5}
                pb={isAboutExpanded ? "102px" : 2}
                mb={isAboutExpanded ? "-90px" : "0px"}
                borderRadius={"20px"}
                borderBottomRadius={isAboutExpanded ? "0px" : "20px"}
                zIndex={2}
            >
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isAboutExpanded ? 45 : 0}deg)`}
                    borderRadius={"full"}
                />
                <SubHeading>About Pool Playground</SubHeading>
                <Box
                    boxSize={6}
                    as={FontAwesomeIcon}
                    icon={faChevronRight}
                    transition="all 0.2s"
                    transform={`rotate(${isAboutExpanded ? 135 : 180}deg)`}
                    borderRadius={"full"}
                />
            </HStack>
            {isAboutExpanded && (
                <Text position={"absolute"} zIndex={2} top={"66px"} maxW={"400px"} px={5} textAlign={"center"}>
                    A playground for creating and deploying Uniswap V2 pools on various networks.
                </Text>
            )}
        </VStack>
    )
}
