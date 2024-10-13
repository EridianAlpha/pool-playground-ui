import { useState, useEffect } from "react"

import { Button, HStack, VStack, Text, Spinner, useToast } from "@chakra-ui/react"
import { TxToast } from "../../utils/TxToast"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"

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

    const toast = useToast()
    const { triggerTxToast } = TxToast()

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
                            wood: 20 * 1e18,
                            stone: 200 * 1e18,
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

            // Trigger a new toast for the transaction confirming
            triggerTxToast("Transaction confirming", null, chainId, `txConfirming-${hash}`, hash, "info", null, "blue")

            setTransactionState({ ...transactionState, error: null, hash: hash, isWaitingForSignature: false, isConfirming: true })
        }
        if (isConfirmed && !transactionState?.isConfirmed) {
            console.log("Transaction confirmed: ", hash)

            // Trigger the state update to fetch user token addresses when the transaction is confirmed
            setPlaygroundInstanceDeployedTrigger(true)

            // Close the toast for the transaction confirming
            toast.close(`txConfirming-${hash}`)

            // Trigger a new toast for the transaction confirmed
            triggerTxToast("Transaction confirmed", null, chainId, `txConfirmed-${hash}`, hash, "success", 5000, "green")

            setTransactionState({ ...transactionState, error: null, isWaitingForSignature: false, isConfirming: false, isConfirmed: true })
        }
        if (error && !transactionState?.error) {
            console.log("Error:", error)

            // Trigger a new toast for the transaction error
            triggerTxToast(
                "Transaction error",
                `${error.message.split("\n")[0]}. View the console for more details.`,
                chainId,
                `txError-${hash}`,
                hash,
                "error",
                10000,
                "red"
            )

            setTransactionState({
                ...transactionState,
                error: error.message,
                isWaitingForSignature: false,
                isConfirming: false,
                isConfirmed: false,
            })
        }
    }, [isConfirming, isConfirmed, error, hash, transactionState, chainId, toast, setPlaygroundInstanceDeployedTrigger, triggerTxToast])

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
