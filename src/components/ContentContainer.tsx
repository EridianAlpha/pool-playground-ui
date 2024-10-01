import { useEffect, useState } from "react"
import { VStack, HStack, Text, Box } from "@chakra-ui/react"

import ConnectWalletButton from "./ConnectWalletButton"
import CurrentAddressInfo from "./CurrentAddressInfo"
import CustomRpcInput from "./CustomRpcInput"
import TokenBalanceContainer from "./TokenBalanceContainer"
import UniswapV2PoolDisplay from "./UniswapV2PoolDisplay"
import MarketPriceDisplay from "./MarketPriceDisplay"
import ResetPlaygroundButton from "./ResetPlaygroundButton"
import AboutButton from "./AboutButton"
import AboutContent from "./AboutContent"

import config from "../../public/data/config.json"

import { ethers } from "ethers"
import { useAccount, useChainId } from "wagmi"

export default function ContentContainer({ wagmiProviderConfig, customRpc, setCustomRpc, useCustomRpc, setUseCustomRpc }) {
    const chainId = useChainId()
    const [provider, setProvider] = useState(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
    const [isContractDeployed, setIsContractDeployed] = useState(false)
    const [isAboutExpanded, setIsAboutExpanded] = useState(false)

    const { isConnected } = useAccount()

    // UseEffect - Set JSON RPC provider
    useEffect(() => {
        setProvider(new ethers.JsonRpcProvider(customRpc ? customRpc : config.chains[chainId].publicJsonRpc))
    }, [customRpc, chainId])

    // UseEffect - Check if contract is deployed on selected network
    useEffect(() => {
        setIsContractDeployed(
            config.chains[chainId].nftContractAddress && config.chains[chainId].nftContractAddress != "0x0000000000000000000000000000000000000000"
                ? true
                : false
        )
    }, [chainId, isConnected])

    return (
        <VStack w={"100vw"} alignItems={"center"} gap={0} px={3} pt={"20px"}>
            {useCustomRpc && <CustomRpcInput setUseCustomRpc={setUseCustomRpc} customRpc={customRpc} setCustomRpc={setCustomRpc} />}
            <HStack w={"100%"} justifyContent={"space-between"} alignItems={"start"} mb={"30px"} h="162px">
                <MarketPriceDisplay />
                <VStack justifyContent={"space-between"} h={"100%"}>
                    {isConnected ? <CurrentAddressInfo setIsContractDeployed={setIsContractDeployed} /> : <ConnectWalletButton />}
                    <AboutButton isAboutExpanded={isAboutExpanded} setIsAboutExpanded={setIsAboutExpanded} />
                </VStack>
                <TokenBalanceContainer provider={provider} />
            </HStack>
            {isAboutExpanded && <AboutContent />}
            {isConnected && !isContractDeployed && (
                <Text className={"errorText"} borderRadius={"20px"} px={2} py={1} textAlign={"center"}>
                    Contract not yet deployed on the {config.chains[chainId].name} network
                </Text>
            )}
            <UniswapV2PoolDisplay provider={provider} />
        </VStack>
    )
}
