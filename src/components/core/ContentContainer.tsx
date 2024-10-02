import { useEffect, useState } from "react"
import { VStack, HStack, Text, Box } from "@chakra-ui/react"

import CustomRpcInput from "../wallet/CustomRpcInput"
import CurrentAddressInfo from "../wallet/CurrentAddressInfo"
import ConnectWalletButton from "../wallet/ConnectWalletButton"
import DeployPlaygroundButton from "../wallet/DeployPlaygroundButton"

import MarketPriceContainer from "../display/MarketPriceContainer"
import TokenBalanceContainer from "../display/TokenBalanceContainer"

import AboutButton from "../about/AboutButton"
import AboutContent from "../about/AboutContent"

import UniswapV2PoolContainer from "../uniswapV2Pool/UniswapV2PoolContainer"

import config from "../../../public/data/config.json"

import { ethers } from "ethers"
import { useAccount, useChainId } from "wagmi"
import BalanceProfitContainer from "../display/BalanceProfitContainer"

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
            <HStack w={"100%"} justifyContent={"space-around"} alignItems={"space-between"} mb={isAboutExpanded ? "20px" : 0} minH={"100%"}>
                <MarketPriceContainer />
                <VStack justifyContent={"space-between"}>
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
            {isConnected ? (
                <HStack w={"100%"} justifyContent={"space-around"} py={5} gap={0}>
                    <Box h={"5px"} w={"100%"} flexGrow={1} />
                    <DeployPlaygroundButton />
                    <BalanceProfitContainer />
                </HStack>
            ) : (
                <Box h={"50px"} w={"100%"} flexGrow={1} />
            )}
            <UniswapV2PoolContainer provider={provider} />
        </VStack>
    )
}
