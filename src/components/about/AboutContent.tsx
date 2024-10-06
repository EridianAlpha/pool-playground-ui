import { useEffect, useState } from "react"
import { VStack, Text, Link, HStack, Box } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSatelliteDish, faUpRightFromSquare, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"
import { useRouter } from "next/router"

import config from "../../../public/data/config.json"

export default function AboutContent() {
    const SubHeading = ({ children }) => {
        return (
            <Text fontSize={"lg"} fontWeight={"bold"} className={"bgPage"} px={3} py={1} borderRadius={"full"} textAlign={"center"}>
                {children}
            </Text>
        )
    }

    const ContractLink = ({ label, chainId }) => {
        return (
            <Link
                as={NextLink}
                href={`${config.chains[chainId].blockExplorerUrl}/address/${config.chains[chainId].nftContractAddress}`}
                color={"blue"}
                textDecoration={"underline"}
                target="_blank"
            >
                {label} <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
            </Link>
        )
    }

    return (
        <VStack
            pb={4}
            px={5}
            mb={5}
            gap={6}
            className={"contentContainer"}
            borderRadius={"30px"}
            borderTopRadius={{ base: "0px", md: "30px" }}
            minW={"100%"}
        >
            <VStack mt={"-14px"} zIndex={2}>
                <SubHeading>Getting Started</SubHeading>
                <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis aliquet arcu, quis gravida magna. Donec ac sapien eu ante
                    egestas tempor. Fusce vel faucibus velit, vel facilisis eros. Sed interdum leo velit, quis dignissim metus feugiat vitae. Donec
                    elementum posuere pretium. Nam id sem sapien. Pellentesque a ante nulla. Nullam dignissim, ex ut luctus suscipit, mauris leo
                    molestie quam, vel dictum elit mi in ex. Aliquam ac tellus et arcu sodales venenatis eu in leo. Maecenas mattis imperdiet mollis.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Assumptions</SubHeading>
                <Text>Assumes market prices stay constant.</Text>
            </VStack>
        </VStack>
    )
}
