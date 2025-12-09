import { useAccount, useChainId } from "wagmi"

/**
 * Custom hook that provides wallet address and chainId.
 * When no wallet is connected, it silently falls back to example values from environment variables.
 * This allows the app to display demo data without requiring a wallet connection.
 *
 * @returns Object with address and chainId (either real or demo values)
 */
export function useWallet() {
    const { address: connectedAddress, isConnected } = useAccount()
    const connectedChainId = useChainId()

    // Get example values from environment variables
    const exampleAddress = process.env.NEXT_PUBLIC_EXAMPLE_ADDRESS
    const exampleNetworkId = process.env.NEXT_PUBLIC_EXAMPLE_NETWORK_ID

    // If wallet is connected, use real values
    if (isConnected && connectedAddress) {
        return {
            address: connectedAddress,
            chainId: connectedChainId,
        }
    }

    // If not connected, use example values if available (always use demo when no wallet connected)
    if (exampleAddress && exampleNetworkId) {
        return {
            address: exampleAddress as `0x${string}`,
            chainId: parseInt(exampleNetworkId, 10),
        }
    }

    // Fallback: return undefined values if no example wallet is configured
    return {
        address: undefined,
        chainId: undefined,
    }
}

