import { VStack, Text, Link } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSatelliteDish, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

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
                href={`${config.chains[chainId].blockExplorerUrl}/address/${config.chains[chainId].poolPlaygroundContractAddress}`}
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
            py={4}
            px={5}
            mb={12}
            gap={6}
            className={"contentContainer"}
            borderRadius={"30px"}
            borderTopRadius={{ base: "0px", sm: "30px" }}
            maxW={{ base: "100vw", xl: "90vw" }}
        >
            <VStack>
                <Text fontWeight={"bold"}>🧪 Beta Testing Phase 🧪</Text>
            </VStack>
            <VStack>
                <Text fontWeight={"bold"}>Can you perform arbitrage swaps between pools to maximize your profit?</Text>
                <Text>Assumes market prices stay constant.</Text>
            </VStack>
            <VStack>
                <SubHeading>Notes</SubHeading>
                <Text>
                    The contracts have been deployed on <ContractLink label={"Ethereum Holesky"} chainId={17000} />,{" "}
                    <ContractLink label={"Ethereum Sepolia"} chainId={11155111} />, <ContractLink label={"Ethereum Sepolia"} chainId={11155111} />,{" "}
                    <ContractLink label={"Base Sepolia"} chainId={84532} />, <ContractLink label={"Arbitrum Sepolia"} chainId={421614} /> and{" "}
                    <ContractLink label={"Optimism Sepolia"} chainId={11155420} />.
                </Text>
                <Text>
                    The source code is available on GitHub for both the{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/pool-playground"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        contracts <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    and this{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/pool-playground-ui"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        UI <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                    . All the code is fully open source for anyone to copy, modify and reuse under an MIT license.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Custom RPC</SubHeading>
                <Text>
                    If the default RPC is not working and/or you would prefer to use a different RPC provider to query the network you can enter an
                    alternative RPC URL by clicking the <FontAwesomeIcon icon={faSatelliteDish} /> button in the menu bar at the top of this page.
                    This UI can be run locally with a local RPC provider so no external dependencies are required. See the{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/pool-playground-ui"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        GitHub README <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    for more information.
                </Text>
            </VStack>
        </VStack>
    )
}
