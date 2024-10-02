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
            py={6}
            px={5}
            gap={6}
            className={"contentContainer"}
            borderRadius={"30px"}
            borderTopRadius={{ base: "0px", md: "30px" }}
            minW={"100%"}
        >
            <VStack>
                <Text>Assumes market prices stay constant.</Text>
            </VStack>
            <VStack>
                <SubHeading>Getting Started</SubHeading>
                <Text>TODO</Text>
            </VStack>
        </VStack>
    )
}
