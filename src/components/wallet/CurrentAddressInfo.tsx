import { useState } from "react"
import { Text, HStack, VStack, Button, Image, Box, Tooltip } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { faCopy, faCircleCheck } from "@fortawesome/free-regular-svg-icons"

import config from "../../../public/data/config.json"

import { useChainModal } from "@rainbow-me/rainbowkit"
import { useChainId, useAccount, useDisconnect } from "wagmi"

export default function CurrentAddressInfo({ setIsContractDeployed }) {
    const { address: connectedWalletAddress } = useAccount()
    const { disconnect } = useDisconnect()
    const { openChainModal } = useChainModal()
    const chainId = useChainId()

    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(connectedWalletAddress).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1000)
        })
    }

    return (
        <HStack
            className="contentContainer"
            minH={"60px"}
            cursor={"default"}
            px={4}
            py={2}
            borderRadius={"20px"}
            gap={3}
            flexWrap={"wrap"}
            justifyContent={"space-around"}
            maxW={"fit-content"}
            w={"100%"}
        >
            <Button h={"fit-content"} borderRadius={"full"} onClick={openChainModal} pl={0} pr={2}>
                <HStack>
                    <Image h={"30px"} borderRadius={"full"} src={config.chains[chainId].iconUrl} alt="Chain Icon" />
                    <Text fontSize={"xl"}>{config.chains[chainId].name}</Text>
                </HStack>
            </Button>
            <HStack gap={3} w={"fit-content"} flexWrap={"wrap"} justifyContent={"center"}>
                <HStack className="bgPage" gap={3} py={1} px={3} borderRadius={"full"} onClick={handleCopy} cursor="pointer">
                    <Text
                        fontFamily={"monospace"}
                        fontSize={"lg"}
                        whiteSpace="normal"
                        overflow="visible"
                        textOverflow="clip"
                        wordBreak="break-word"
                        textAlign={"center"}
                    >
                        {`${connectedWalletAddress.substring(0, 7)}...${connectedWalletAddress.substring(connectedWalletAddress.length - 5)}`}
                    </Text>
                    <Tooltip
                        className="tooltip"
                        closeOnClick={false}
                        gutter={6}
                        label={
                            <VStack className="tooltipLabel">
                                <Text fontWeight={"bold"}>Address copied!</Text>
                            </VStack>
                        }
                        placement={"bottom"}
                        borderRadius={"full"}
                        hasArrow={true}
                        closeDelay={0}
                        openDelay={0}
                        isOpen={copied}
                    >
                        <Box w={3}>
                            <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} />
                        </Box>
                    </Tooltip>
                </HStack>
                <Tooltip
                    className="tooltip"
                    closeOnClick={false}
                    gutter={8}
                    label={
                        <VStack className="tooltipLabel">
                            <Text fontWeight={"bold"}>Disconnect wallet</Text>
                        </VStack>
                    }
                    placement={"bottom"}
                    borderRadius={"full"}
                    hasArrow={true}
                    closeDelay={0}
                    openDelay={0}
                >
                    <Button
                        variant={"WalletButton"}
                        aria-label={"Wallet button"}
                        borderRadius={"full"}
                        px={0}
                        h={8}
                        onClick={() => {
                            disconnect()
                            setIsContractDeployed(false)
                        }}
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} size={"lg"} />
                    </Button>
                </Tooltip>
            </HStack>
        </HStack>
    )
}
