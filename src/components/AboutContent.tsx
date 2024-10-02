import { useEffect, useState } from "react"
import { VStack, Text, Link, HStack, Box } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSatelliteDish, faUpRightFromSquare, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"
import { useRouter } from "next/router"

import config from "../../public/data/config.json"

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
        <VStack py={6} px={5} gap={6} className={"contentContainer"} borderRadius={"30px"} borderTopRadius={{ base: "0px", md: "30px" }}>
            <VStack>
                <Text>
                    This project is a free mint NFT for anyone who feels at home as part of the Ethereum ecosystem. It has been created as an example
                    project to experiment with ERC721 and ERC20 tokens. There are no fees, royalties, or costs associated with minting other than the
                    gas fee. The contracts have been deployed on multiple chains ({/*<ContractLink label={"Ethereum mainnet"} chainId={1} />, */}
                    <ContractLink label={"Base mainnet"} chainId={8453} />, <ContractLink label={"Ethereum Holesky"} chainId={17000} /> and{" "}
                    <ContractLink label={"Base Sepolia"} chainId={84532} />) so anyone can mint a Settlement NFT. The contracts are verified on public
                    explorers and are not upgradeable. The source code is available on GitHub for both the contracts and this UI. All the code is
                    fully open source for anyone to copy, modify and reuse under an MIT license.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Getting Started</SubHeading>
                <Text>
                    Simply connect your wallet using the glowing button at the top of this page, select the chain you wish to mint your Settlement NFT
                    on, and click the mint button. You will be prompted to sign a transaction to mint your NFT. Once the transaction is confirmed, you
                    will be able to view your NFT and the metadata associated with it.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Settlement NFT</SubHeading>
                <Text>
                    An unlimited number of SETTLER NFTs can be minted, and each one has the mint timestamp stored as an attribute, so the older the
                    timestamp, the longer you have been an Ethereum Settler. Only one NFT can be held in a wallet at a time. There is nothing stopping
                    you minting multiple Settlement NFTs from multiple wallets, as this is a personal collectable, you can use the project however you
                    wish. This UI will display the dynamic Settlement NFT SVG which shows how many days the NFT has been minted.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>SETTLER Token</SubHeading>
                <Text>
                    For every second you hold a Settlement NFT in your wallet, you will get 1 SETTLER token. Your SETTLER token balance is calculated
                    based on the mint timestamp of your NFT and the current time. Every time you interact with the Settlement NFT (e.g. transfer it to
                    a new wallet) and every time you transfer SETTLER tokens, the calculated tokens will be minted to your wallet. The SETTLER token
                    will never have any value, and it is not listed on any exchanges.
                </Text>
            </VStack>
            <VStack pb={2}>
                <SubHeading>Custom RPC</SubHeading>
                <Text>
                    If the default RPC is not working and/or you would prefer to use a different RPC provider to query the network you can enter an
                    alternative RPC URL by clicking the <FontAwesomeIcon icon={faSatelliteDish} /> button in the menu bar at the top of this page.
                    This UI can be run locally with a local RPC provider so no external dependencies are required. See the{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/ethereum-settlers-ui"}
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
