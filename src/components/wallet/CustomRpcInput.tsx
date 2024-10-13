import { VStack, HStack, Text, Input, Button, Link } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import { useChainId } from "wagmi"

import config from "../../../public/data/config.json"

export default function CustomRpcInput({ setUseCustomRpc, customRpc, setCustomRpc }) {
    const chainId = useChainId()
    const buttonSize = "27px"

    return (
        <VStack maxW={"800px"} alignItems={"start"} gap={3} px={3} pt={2} pb={3} borderRadius={"20px"} bg={"orange"} mb={5}>
            <HStack justifyContent={"space-between"} w={"100%"} px={1}>
                <Text fontSize={"lg"} fontWeight={"semibold"}>
                    Use a custom RPC (optional)
                </Text>
                <Button
                    variant={"HeaderButton"}
                    borderRadius={"full"}
                    p={0}
                    h={buttonSize}
                    w={buttonSize}
                    maxW={buttonSize}
                    minW={buttonSize}
                    onClick={() => {
                        setUseCustomRpc(false)
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} size={"lg"} />
                </Button>
            </HStack>
            <Text px={1}>
                If the default RPC{" "}
                <Link
                    className="bgPage"
                    py={"2px"}
                    px={"8px"}
                    borderRadius={"full"}
                    as={NextLink}
                    href={config.chains[chainId].publicJsonRpc}
                    color={"blue"}
                    textDecoration={"underline"}
                    target="_blank"
                >
                    {config.chains[chainId].publicJsonRpc} <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                </Link>{" "}
                is not working and/or you would prefer to use a different RPC provider to query the network you can enter a custom RPC URL here.
            </Text>
            <Text px={1}>
                Alternative RPC providers:{" "}
                <Link
                    className="bgPage"
                    py={"2px"}
                    px={"8px"}
                    borderRadius={"full"}
                    as={NextLink}
                    href={"https://chainlist.org/"}
                    color={"blue"}
                    textDecoration={"underline"}
                    target="_blank"
                >
                    https://chainlist.org <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                </Link>
            </Text>
            <Input
                placeholder="e.g. http://localhost:8545"
                p={5}
                w={"100%"}
                borderRadius={"20px"}
                fontFamily={"monospace"}
                value={customRpc}
                onChange={(event) => setCustomRpc(event.target.value)}
                variant={"AddressInput"}
            />
        </VStack>
    )
}
