import { useState, useEffect } from "react"

import { Button, HStack, VStack, Text, Spinner, useToast, Link } from "@chakra-ui/react"
import NextLink from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { faRotateRight, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi"

import config from "../../../public/data/config.json"
import { abi as poolPlaygroundAbi } from "../../../public/data/poolPlaygroundAbi"

export default function ResetPlaygroundButton({
    wagmiProviderConfig,
    tokenAddresses,
    isFetchingTokenAddresses,
    setPlaygroundInstanceDeployedTrigger,
}) {
    const [transactionState, setTransactionState] = useState({
        isWaitingForSignature: false,
        isConfirming: false,
        isConfirmed: false,
        hash: null,
        error: null,
    })

    const chainId = useChainId()
    const { address: connectedWalletAddress } = useAccount()
    const { data: hash, error, writeContract } = useWriteContract()

    // Create a toast to display transaction status notifications
    const toast = useToast()

    // Use the useWaitForTransactionReceipt hook to check the status of the transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
        config: wagmiProviderConfig,
    })

    const handleTransaction = async () => {
        try {
            setTransactionState({ ...transactionState, error: null, isWaitingForSignature: true })

            const txObject = {
                address: config.chains[chainId].poolPlaygroundContractAddress,
                abi: poolPlaygroundAbi,
                functionName: "deploy",
                args: [
                    {
                        diamond: 10 * 1e18,
                        wood: 50 * 1e18,
                        stone: 100 * 1e18,
                    },
                    [
                        {
                            diamond: 10 * 1e18,
                            wood: 100 * 1e18,
                            stone: 0,
                        },
                        {
                            diamond: 10 * 1e18,
                            wood: 0,
                            stone: 100 * 1e18,
                        },
                        {
                            diamond: 0,
                            wood: 100 * 1e18,
                            stone: 100 * 1e18,
                        },
                    ],
                ],
                chain: wagmiProviderConfig,
                account: connectedWalletAddress,
            }

            console.log("Waiting for signature on transaction: \n", txObject)

            writeContract(txObject, {
                onSuccess: async () => {
                    console.log("Transaction sent to network.")
                },
            })
        } catch (err) {
            console.error(err)
            setTransactionState({ ...transactionState, error: err.message, isWaitingForSignature: false })
        }
    }

    useEffect(() => {
        if (isConfirming && !transactionState?.isConfirming) {
            console.log("Transaction is confirming...")
            setTransactionState({ ...transactionState, error: null, hash: hash, isWaitingForSignature: false, isConfirming: true })
        }
        if (isConfirmed && !transactionState?.isConfirmed) {
            console.log("Transaction confirmed: ", hash)

            // Trigger the state update to fetch user token addresses when the transaction is confirmed
            setPlaygroundInstanceDeployedTrigger(true)

            toast({
                title: "Transaction confirmed!",
                description: (
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
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                variant: "solid",
                containerStyle: {
                    bg: "green",
                    borderRadius: "15px",
                },
            })

            setTransactionState({ ...transactionState, error: null, isWaitingForSignature: false, isConfirming: false, isConfirmed: true })
        }
        if (error && !transactionState?.error) {
            console.log("Error:", error)
            toast({
                title: "Transaction error!",
                description: error.message.split("\n")[0],
                status: "success",
                duration: 10000,
                isClosable: true,
                position: "top-right",
                variant: "solid",
                containerStyle: {
                    bg: "red",
                    borderRadius: "15px",
                },
            })

            setTransactionState({
                ...transactionState,
                error: error.message,
                isWaitingForSignature: false,
                isConfirming: false,
                isConfirmed: false,
            })
        }
    }, [isConfirming, isConfirmed, error, hash, transactionState, chainId, toast, setPlaygroundInstanceDeployedTrigger])

    const ButtonContent = () => {
        if (isFetchingTokenAddresses) {
            return (
                <HStack>
                    <Spinner />
                    <Text fontSize={"xl"}>Loading data...</Text>
                </HStack>
            )
        } else if (transactionState.isWaitingForSignature) {
            return (
                <HStack>
                    <Spinner size={"sm"} speed="0.8s" />
                    <Text fontSize={"xl"}>Sign transaction in your wallet</Text>
                </HStack>
            )
        } else if (transactionState.isConfirming) {
            return (
                <HStack>
                    <Spinner size={"sm"} speed="0.8s" />
                    <Text fontSize={"xl"}>Confirming transaction...</Text>
                </HStack>
            )
        } else {
            return (
                <HStack>
                    <FontAwesomeIcon icon={Object.keys(tokenAddresses).length === 0 ? faCirclePlay : faRotateRight} size="xl" />
                    <Text fontSize={"xl"}>{Object.keys(tokenAddresses).length === 0 ? "Deploy playground" : "Reset playground"}</Text>
                </HStack>
            )
        }
    }

    return (
        <VStack>
            <HStack w={"100%"} justifyContent={"center"}>
                <Button
                    h={"fit-content"}
                    borderRadius={"full"}
                    py={2}
                    px={5}
                    variant={Object.keys(tokenAddresses).length === 0 ? "DeployPlaygroundButton" : "ResetPlaygroundButton"}
                    minW="fit-content"
                    onClick={handleTransaction}
                >
                    <ButtonContent />
                </Button>
            </HStack>
        </VStack>
    )
}
