import { VStack, Text, Link, UnorderedList, ListItem } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSatelliteDish, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import NextLink from "next/link"

import config from "../../../public/data/config.json"

export default function AboutContent() {
    const SubHeading = ({ children }) => (
        <Text
            fontSize={"lg"}
            fontWeight={"bold"}
            className={"bgPage"}
            px={3}
            py={1}
            mb={1}
            borderRadius={{ base: 0, xl: "full" }}
            textAlign={"center"}
            w={"100%"}
        >
            {children}
        </Text>
    )

    const ContractLink = ({ label, chainId }) => (
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

    return (
        <VStack
            py={4}
            px={{ base: 0, xl: 5 }}
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
                    The Pool Playground is currently in a beta testing phase.
                </Text>
                <Text px={5} textAlign={"justify"}>
                    If you notice any bugs or something is unclear, please contact{" "}
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
                    after completing the{" "}
                    <Link
                        as={NextLink}
                        href={"https://updraft.cyfrin.io/courses/uniswap-v2"}
                        color={"blue"}
                        textDecoration={"underline"}
                        target="_blank"
                    >
                        Cyfrin Updraft Uniswap V2 course <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                    </Link>
                    . The course provides an excellent introduction to Uniswap V2 and arbitrage, and this playground serves as an interactive
                    educational tool to visualize the concepts from the course. The Cyfrin Updraft course is completely free (as is all their
                    content), and I created this resource to deepen my understanding of Uniswap V2, smart contract UI building, and contract
                    interactions, while also helping others learn.
                </Text>
                <Text px={5} textAlign={"justify"}>
                    I was not paid to create this resource, and I am not affiliated with Cyfrin, but like many other Ethereum developers, I owe my
                    start in this space to{" "}
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
                    Your aim is to calculate the best trades to maximize your profit across the available pools. You can use the &quot;Optimal
                    swap&quot; hints if you need help. When you deploy or reset the playground, a new instance of all the tokens and Uniswap pool
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
                    and interacts with them directly. The contracts are deployed on:
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
                    suggestions for improvement, please open an issue on GitHub or contact{" "}
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
                    <Text w={"100%"}>A: The current high score is a total balance of $2,672.24 (+ $472.24 profit) 💰 Can you do better?</Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: What is the difference between &quot;optimal swap for max profit&quot; and &quot;optimal swap to balance pool&quot;?
                    </Text>
                    <Text w={"100%"}>
                        A: An &quot;optimal swap for max profit&quot; refers to a trade that maximizes the difference between the input and output
                        tokens, giving you the highest possible profit from the trade. A &quot;balance pool&quot; swap focuses on bringing the token
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
                        Q: Why do token0 and token1 change order when I reset the playground?
                    </Text>
                    <Text w={"100%"}>
                        A: In Uniswap V2, token0 and token1 are assigned based on the numeric value of the token addresses, with the smaller address
                        being assigned to token0. When the playground is reset, the tokens are redeployed, and the order is determined by the new
                        addresses, ensuring consistency across all pools.
                    </Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: Why don&apos;t I need to approve tokens before swapping them?
                    </Text>
                    <Text w={"100%"}>
                        A: The ERC20 tokens used in this playground{" "}
                        <Link
                            as={NextLink}
                            href={"https://github.com/EridianAlpha/pool-playground/blob/main/src/Token.sol"}
                            color={"blue"}
                            textDecoration={"underline"}
                            target="_blank"
                        >
                            are pre-approved <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>{" "}
                        for Uniswap V2 contracts for the maximum amount of tokens. This simplification reduces the number of required user
                        transactions. In real-world scenarios, you would need to manually approve the Uniswap contracts to spend your tokens before
                        swapping.
                    </Text>
                </VStack>
                <VStack px={5} textAlign={"start"} w={"100%"} gap={0}>
                    <Text w={"100%"} fontWeight={"bold"}>
                        Q: Why is the gas cost of deploying and resetting the playground so high?
                    </Text>
                    <Text w={"100%"}>
                        A: The high gas cost is due to the complexity of deploying multiple Uniswap V2 pools and tokens on-chain. The cost is
                        determined by the number and complexity of contracts deployed, as well as current network congestion. You can select from
                        multiple testnets for deployment. If you lack testnet ETH, you can use a{" "}
                        <Link as={NextLink} href={"https://www.alchemy.com/faucets"} color={"blue"} textDecoration={"underline"} target="_blank">
                            faucet <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>{" "}
                        or deploy the contracts locally using{" "}
                        <Link
                            as={NextLink}
                            href={"https://github.com/EridianAlpha/pool-playground/blob/main/README.md"}
                            color={"blue"}
                            textDecoration={"underline"}
                            target="_blank"
                        >
                            Foundry <FontAwesomeIcon icon={faUpRightFromSquare} size={"sm"} />
                        </Link>
                        .
                    </Text>
                </VStack>
            </VStack>

            <VStack w={"100%"}>
                <SubHeading>Future Development Ideas</SubHeading>
                <Text px={5} textAlign={"justify"}>
                    Currently, the Pool Playground only supports Uniswap V2 pools. Future plans include adding support for Uniswap V3 and V4, as well
                    as more complex arbitrage opportunities and different initial pool configurations. LP tokens are not currently displayed but may
                    be added in future versions.
                </Text>
            </VStack>

            <VStack>
                <SubHeading>Custom RPC</SubHeading>
                <Text px={5}>
                    If the default RPC is not working or you prefer to use a different RPC provider, you can enter an alternative URL by clicking the{" "}
                    <FontAwesomeIcon icon={faSatelliteDish} /> button in the menu bar at the top of the page. This UI can also be run locally with a
                    local RPC provider, so no external dependencies are required.
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
