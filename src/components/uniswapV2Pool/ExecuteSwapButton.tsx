import { useState, useEffect } from "react"

import { HStack, Text, Button, Spinner, useToast } from "@chakra-ui/react"
import { TxToast } from "../../utils/TxToast"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShuffle } from "@fortawesome/free-solid-svg-icons"

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi"
import BigNumber from "bignumber.js"

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
    setRefetchData,
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
                address: config.chains[chainId].uniswapV2RouterAddress,
                abi: IUniswapV2Router01Abi,
                functionName: "swapExactTokensForTokens",
                args: [
                    inputTokenAmount.shiftedBy(18).toString(), // amountIn
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

            // Trigger a new toast for the transaction confirming
            triggerTxToast("Transaction confirming", null, chainId, `txConfirming-${hash}`, hash, "info", null, "blue")

            setTransactionState({
                ...transactionState,
                error: null,
                hash: hash,
                isWaitingForSignature: false,
                isConfirming: true,
                isConfirmed: false,
            })
        }
        if (isConfirmed && !transactionState?.isConfirmed) {
            console.log("Transaction confirmed: ", hash)

            // Close the toast for the transaction confirming
            toast.close(`txConfirming-${hash}`)

            // Trigger a new toast for the transaction confirmed
            triggerTxToast("Transaction confirmed", null, chainId, `txConfirmed-${hash}`, hash, "success", 5000, "green")

            // Fetch updated pool data after the transaction is confirmed
            setPoolsToFetch([poolName])

            // Fetch updated user balance after the transaction is confirmed
            setRefetchData((prev) => !prev)

            // Clear the input fields after the transaction is confirmed
            setInputTokenAmount(new BigNumber(0))

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
        setRefetchData,
        setInputTokenAmount,
        triggerTxToast,
    ])

    return (
        <Button
            maxH={"40px"}
            variant={"ExecuteSwap"}
            borderRadius={"full"}
            my={1}
            onClick={handleTransaction}
            isDisabled={inputTokenAmount.isZero()}
            pointerEvents={transactionState.isWaitingForSignature || transactionState.isConfirming ? "none" : "auto"}
        >
            {transactionState.isWaitingForSignature && (
                <HStack>
                    <Spinner size={"sm"} speed="0.8s" />
                    <Text>Sign transaction in your wallet</Text>
                </HStack>
            )}
            {transactionState.isConfirming && (
                <HStack>
                    <Spinner size={"sm"} speed="0.8s" />
                    <Text>Confirming transaction...</Text>
                </HStack>
            )}
            {!transactionState.isWaitingForSignature && !transactionState.isConfirming && (
                <HStack>
                    <Text>Swap tokens</Text>
                    <FontAwesomeIcon size={"lg"} icon={faShuffle} />
                </HStack>
            )}
        </Button>
    )
}
