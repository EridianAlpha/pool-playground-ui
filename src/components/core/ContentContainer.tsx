import { useEffect, useState } from "react"
import { VStack, HStack, Text, Box, Grid, GridItem } from "@chakra-ui/react"

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
            <Grid templateColumns={"1fr 1fr 1fr"} rowGap={4} columnGap={6} w="100%" minH="100%" justifyItems="center" alignItems="start" pb={5}>
                <GridItem>
                    <VStack gap={5}>
                        <MarketPriceContainer />
                        <DeployPlaygroundButton />
                    </VStack>
                </GridItem>
                <GridItem h="100%">
                    <VStack gap={0} minH={"100%"} justifyContent={"space-between"} mx={{ lg: "-30px", xl: "-75px", "2xl": "-80px" }}>
                        {isConnected ? <CurrentAddressInfo setIsContractDeployed={setIsContractDeployed} /> : <ConnectWalletButton />}
                        <VStack fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
                            <Text>
                                An interactive educational playground for visualizing and understanding Uniswap V2 mechanics by swapping ERC20 tokens
                                deployed on a testnet
                            </Text>
                        </VStack>
                        <AboutButton isAboutExpanded={isAboutExpanded} setIsAboutExpanded={setIsAboutExpanded} />
                    </VStack>
                </GridItem>
                <GridItem>
                    <VStack gap={5}>
                        <TokenBalanceContainer provider={provider} />
                        <BalanceProfitContainer />
                    </VStack>
                </GridItem>
            </Grid>
            {isAboutExpanded && <AboutContent />}
            {isConnected && !isContractDeployed && (
                <Text className={"errorText"} borderRadius={"20px"} px={2} py={1} textAlign={"center"}>
                    Contract not yet deployed on the {config.chains[chainId].name} network
                </Text>
            )}
            <UniswapV2PoolContainer provider={provider} />
        </VStack>
    )
}
