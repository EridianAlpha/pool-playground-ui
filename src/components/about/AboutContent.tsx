import { VStack, Text, Link, UnorderedList, ListItem } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSatelliteDish, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import config from "../../../public/data/config.json"

export default function AboutContent() {
    const SubHeading = ({ children }) => {
        return (
            <Text fontSize={"lg"} fontWeight={"bold"} className={"bgPage"} px={3} py={1} mb={1} borderRadius={"full"} textAlign={"center"} w={"100%"}>
                {children}
            </Text>
        )
    }

    const ContractLink = ({ label, chainId }) => {
        return (
            <Link
                as={NextLink}
                href={`${config.chains[chainId].blockExplorerUrl}/address/${config.chains[chainId].poolPlaygroundContractAddress}`}
                color={"blue"}
                textDecoration={"underline"}
                target="_blank"
            >
                {label} <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
            </Link>
        )
    }

    return (
        <VStack
            py={4}
            px={5}
            mb={12}
            gap={6}
            className={"contentContainer"}
            borderRadius={"30px"}
            borderTopRadius={{ base: "0px", sm: "30px" }}
            maxW={{ base: "100vw", xl: "900px" }}
        >
            <VStack w={"100%"}>
                <SubHeading>🧪 Beta Testing Phase 🧪</SubHeading>
                <Text px={5} textAlign={"justify"}>
                    The Pool Playground is currently in a Beta testing phase.
                </Text>
                <Text px={5} textAlign={"justify"}>
                    If you notice any bugs or something is not clear, please contact{" "}
                    <Link as={NextLink} href={"https://t.me/eridianalpha"} color={"blue"} textDecoration={"underline"} target="_blank">
                        Eridian <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    so I can fix it 🔧
                </Text>
            </VStack>
            <VStack w={"100%"}>
                <SubHeading>What is the Pool Playground?</SubHeading>
                <Text px={5} textAlign={"justify"}>
                    The Pool Playground was built by{" "}
                    <Link as={NextLink} href={"https://eridian.xyz"} color={"blue"} textDecoration={"underline"} target="_blank">
                        Eridian <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    after taking the{" "}
                    <Link
                        as={NextLink}
                        href={"https://updraft.cyfrin.io/courses/uniswap-v2"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        Cyfrin Updraft Uniswap V2 course <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                    . The course is an excellent introduction to Uniswap V2 and arbitrage, with this playground providing an interactive educational
                    tool for visualizing the concepts explained in that course. The Cyfrin Updraft course is completely free (as is all of their
                    content) and I created this resource so I could learn more about Uniswap V2, Smart Contract UI building, contract interactions,
                    and to help others learn as well.
                </Text>
                <Text px={5} textAlign={"justify"}>
                    I was not paid by anyone to create this free resource and I am not affiliated with Cyfrin, but like many other Ethereum
                    developers, I owe my start in this space to{" "}
                    <Link as={NextLink} href={"https://x.com/PatrickAlphaC"} color={"blue"} textDecoration={"underline"} target="_blank">
                        Patrick Collins <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    and the{" "}
                    <Link as={NextLink} href={"https://www.cyfrin.io"} color={"blue"} textDecoration={"underline"} target="_blank">
                        Cyfrin team <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                    .
                </Text>
            </VStack>
            <VStack w={"100%"}>
                <SubHeading>How to use the playground</SubHeading>
                <Text px={5} textAlign={"justify"} fontWeight={"bold"}>
                    Can you perform arbitrage swaps between pools to maximize your profit?
                </Text>
                <Text px={5} textAlign={"justify"}>
                    Your goal is to calculate the best trades to maximize your profit across the available pools. You can use the &quot;Optimal
                    swap&quot; hints if you need help. When you deploy or reset the playground a new instance of all the tokens and Uniswap pool
                    contracts is deployed onchain.
                </Text>
                <Text px={5} textAlign={"justify"}>
                    To keep the playground simple, market prices remain constant and are not impacted by your trades. The initial pools are already
                    imbalanced to provide opportunities for arbitrage.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Source Code Notes</SubHeading>
                <Text px={5} textAlign={"justify"}>
                    The Pool Playground deploys full{" "}
                    <Link as={NextLink} href={"https://github.com/Uniswap/v2-core"} color={"blue"} textDecoration={"underline"} target="_blank">
                        Uniswap V2 contracts <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    and interacts with them directly. The contracts have been deployed on:
                </Text>
                <UnorderedList px={8} w={"100%"}>
                    <ListItem>
                        <ContractLink label={"Ethereum Holesky"} chainId={17000} />
                    </ListItem>
                    <ListItem>
                        <ContractLink label={"Ethereum Sepolia"} chainId={11155111} />
                    </ListItem>
                    <ListItem>
                        <ContractLink label={"Base Sepolia"} chainId={84532} />
                    </ListItem>
                    <ListItem>
                        <ContractLink label={"Arbitrum Sepolia"} chainId={421614} />
                    </ListItem>
                    <ListItem>
                        <ContractLink label={"Optimism Sepolia"} chainId={11155420} />
                    </ListItem>
                </UnorderedList>
                <Text px={5} textAlign={"justify"}>
                    The source code is available on GitHub for both the{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/pool-playground"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        deployment contracts <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    and this{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/pool-playground-ui"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        UI <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                    . All the code is fully open source for anyone to copy, modify and reuse under an MIT license. If you notice any bugs or have any
                    suggestions for improvements, please open an issue on GitHub or contact{" "}
                    <Link as={NextLink} href={"https://t.me/eridianalpha"} color={"blue"} textDecoration={"underline"} target="_blank">
                        Eridian <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                    .
                </Text>
            </VStack>
            <VStack w={"100%"} gap={5}>
                <SubHeading>FAQ</SubHeading>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: What is the current high score?
                    </Text>
                    <Text w={"100%"}>A: The current hight score is a total balance of $2,668.66 (+ $468.66 profit) 💰 Can you do better?</Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: What is the difference between &quot;optimal swap for max profit&quot; and &quot;optimal swap to balance pool&quot;?
                    </Text>
                    <Text w={"100%"}>
                        A: An &quot;optimal swap for max profit&quot; refers to a trade that maximizes the difference between the input and output
                        tokens, giving you the highest possible profit from the trade. A &quot;balance pool&quot; swap focus on bringing the token
                        reserves in the pool closer to equilibrium, reducing any significant imbalance between token0 and token1 reserves. The reason
                        for the difference between the two swap types is the pool fee and the price impact of the trade. Every swap in a Uniswap V2
                        pool incurs a fee of 0.3% of the trade. This fee is taken from the input tokens before the swap is executed. For a &quot;max
                        profit&quot; swap you are looking to maximize your returns, but the pool fee reduces the final output slightly. To balance the
                        pool, you need to send slightly more tokens to the pool than a &quot;max profit&quot; trade to account for the fee, resulting
                        in a lower profit but a balanced pool.
                    </Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: Why do the token0 and token1 change order when I reset the playground?
                    </Text>
                    <Text w={"100%"}>
                        A: In Uniswap V2, token0 and token1 are assigned based on the numeric value of the token addresses in ascending order. When
                        you reset the playground, the tokens are redeployed, and the order is determined by their new addresses. This ensures
                        consistency across all pools, as the token with the smaller address is always assigned to token0.
                    </Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: Why don&apos;t I need to approve tokens before swapping them?
                    </Text>
                    <Text w={"100%"}>
                        A: The ERC20 tokens{" "}
                        <Link
                            as={NextLink}
                            href={"https://github.com/EridianAlpha/pool-playground/blob/main/src/Token.sol"}
                            color={"blue"}
                            textDecoration={"underline"}
                            target="_blank"
                        >
                            used in this playground <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>{" "}
                        have been customized to preapprove the Uniswap V2 contracts for the maximum amount of tokens. This is not standard practice
                        and is only done to simplify the playground by reducing the number of transactions required by the user. In a real-world
                        scenario, you would need to approve the Uniswap V2 contracts to spend your tokens before swapping them.
                    </Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: Why is the gas cost of deploying and resetting the playground so high?
                    </Text>
                    <Text w={"100%"}>
                        A: The gas cost of deploying the playground is high because it deploys multiple Uniswap V2 pools and tokens onchain. The gas
                        cost is determined by the complexity of the contracts being deployed and the current network congestion. The contracts have
                        been deployed on multiple testnets so you can select the best one for you. If you do not have enough testnet ETH to deploy
                        your playground instance, you can use a{" "}
                        <Link as={NextLink} href={"https://www.alchemy.com/faucets"} color={"blue"} textDecoration={"underline"} target="_blank">
                            faucet <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>{" "}
                        or deploy the contracts on a{" "}
                        <Link
                            as={NextLink}
                            href={"https://github.com/EridianAlpha/pool-playground/blob/main/README.md"}
                            color={"blue"}
                            textDecoration={"underline"}
                            target="_blank"
                        >
                            local fork using Foundry <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>
                        .
                    </Text>
                </VStack>
            </VStack>
            <VStack w={"100%"}>
                <SubHeading>Future Development Ideas</SubHeading>
                <Text px={5} textAlign={"justify"}>
                    Currently, the Pool Playground only supports Uniswap V2 pools. Future development plans include adding support for Uniswap V3 and
                    V4. There are also plans to add different initial pool configurations and more complex arbitrage opportunities. LP tokens are not
                    displayed in the current version of the playground and could be added in the future.
                </Text>
            </VStack>
            <VStack>
                <SubHeading>Custom RPC</SubHeading>
                <Text px={5}>
                    If the default RPC is not working and/or you would prefer to use a different RPC provider to query the network you can enter an
                    alternative RPC URL by clicking the <FontAwesomeIcon icon={faSatelliteDish} /> button in the menu bar at the top of this page.
                    This UI can be run locally with a local RPC provider so no external dependencies are required.
                </Text>
                <Text px={5}>
                    See the{" "}
                    <Link
                        as={NextLink}
                        href={"https://github.com/EridianAlpha/pool-playground-ui"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        GitHub README <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>{" "}
                    for more information.
                </Text>
            </VStack>
        </VStack>
    )
}
