// useCustomToast.ts
import { Text, Link, useToast } from "@chakra-ui/react"
import NextLink from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

import config from "../../public/data/config.json"

export const TxToast = () => {
    const toast = useToast()

    const triggerTxToast = (
        title: string,
        customDescription: string,
        chainId: number,
        toastId: string,
        hash: string,
        status: "info" | "warning" | "success" | "error" | "loading",
        duration: number,
        bgColor: string
    ) => {
        toast({
            title: title,
            id: toastId,
            description: customDescription || (
                <Text pt={1}>
                    View on{" "}
                    <Link
                        className="bgPage"
                        py={"2px"}
                        px={"8px"}
                        borderRadius={"full"}
                        as={NextLink}
                        href={`${config.chains[chainId].blockExplorerUrl}/tx/${hash}`}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        block explorer <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                </Text>
            ),
            status: status,
            duration: duration,
            isClosable: true,
            position: "top-right",
            variant: "solid",
            containerStyle: {
                bg: bgColor,
                borderRadius: "15px",
            },
        })
    }

    return { triggerTxToast }
}
