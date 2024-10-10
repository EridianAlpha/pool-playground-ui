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
                <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis aliquet arcu, quis gravida magna. Donec ac sapien eu ante
                    egestas tempor. Fusce vel faucibus velit, vel facilisis eros. Sed interdum leo velit, quis dignissim metus feugiat vitae. Donec
                    elementum posuere pretium. Nam id sem sapien. Pellentesque a ante nulla. Nullam dignissim, ex ut luctus suscipit, mauris leo
                    molestie quam, vel dictum elit mi in ex. Aliquam ac tellus et arcu sodales venenatis eu in leo. Maecenas mattis imperdiet mollis.
                </Text>
            </VStack>
            <VStack>
                <Text>
                    The contracts have been deployed on <ContractLink label={"Ethereum Sepolia"} chainId={11155111} /> and{" "}
                    <ContractLink label={"Base Sepolia"} chainId={84532} /> so anyone can mint a Settlement NFT. The contracts are verified on public
                    explorers and are not upgradeable. The source code is available on GitHub for both the contracts and this UI. All the code is
                    fully open source for anyone to copy, modify and reuse under an MIT license.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Assumptions</SubHeading>
                <Text>Assumes market prices stay constant.</Text>
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
