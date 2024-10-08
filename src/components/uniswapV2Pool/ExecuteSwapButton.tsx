import { useState, useEffect } from "react"

import { HStack, Text, Button, Link, Spinner, useToast } from "@chakra-ui/react"
import NextLink from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi"

import config from "../../../public/data/config.json"
import { abi as IUniswapV2Router01Abi } from "../../../public/data/IUniswapV2Router01Abi"

export default function ExecuteSwapButton({
    wagmiProviderConfig,
    poolName,
    setPoolsToFetch,
    inputToken,
    outputToken,
    inputTokenAmount,
    setInputTokenAmount,
    setUseBalanceFetchTrigger,
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
                address: config.chains[chainId].uniswapV2RouterAddress,
                abi: IUniswapV2Router01Abi,
                functionName: "swapExactTokensForTokens",
                args: [
                    inputTokenAmount * 1e18, // amountIn
                    0, // amountOutMin,
                    [inputToken.address, outputToken.address], // Token addresses
                    connectedWalletAddress, // Recipient address
                    Math.floor(Date.now() / 1000) + 60 * 20, // deadline: 20 minutes from now
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

            // Fetch updated pool data after the transaction is confirmed
            setPoolsToFetch([poolName])

            // Fetch updated user balance after the transaction is confirmed
            setUseBalanceFetchTrigger((prev) => !prev)

            // Clear the input fields after the transaction is confirmed
            setInputTokenAmount(0)

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
    }, [
        isConfirming,
        isConfirmed,
        error,
        hash,
        transactionState,
        chainId,
        toast,
        poolName,
        setPoolsToFetch,
        setUseBalanceFetchTrigger,
        setInputTokenAmount,
    ])

    return (
        <Button maxH={"40px"} variant={"ExecuteSwap"} borderRadius={"full"} my={1} onClick={handleTransaction}>
            {transactionState.isWaitingForSignature && (
                <HStack>
                    <Spinner size={"sm"} speed="0.8s" />
                    <Text>Sign transaction in your wallet</Text>
                </HStack>
            )}
            {transactionState.isConfirming && (
                <HStack>
                    <Spinner size={"sm"} speed="0.8s" />
                    <Text>Confirming</Text>
                </HStack>
            )}
            {!transactionState.isWaitingForSignature && !transactionState.isConfirming && (
                <HStack>
                    <Text>Execute swap</Text>
                    <FontAwesomeIcon icon={faArrowRight} />
                </HStack>
            )}
        </Button>
    )
}
