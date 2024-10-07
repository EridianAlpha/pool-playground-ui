export const abi = [
    {
        type: "constructor",
        inputs: [
            {
                name: "_contractAddresses",
                type: "tuple[]",
                internalType: "struct PoolPlayground.ContractAddress[]",
                components: [
                    {
                        name: "identifier",
                        type: "string",
                        internalType: "string",
                    },
                    {
                        name: "contractAddress",
                        type: "address",
                        internalType: "address",
                    },
                ],
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "TOKEN_DECIMALS",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "deploy",
        inputs: [
            {
                name: "_userTokenAmounts",
                type: "tuple",
                internalType: "struct PoolPlayground.TokenAmounts",
                components: [
                    { name: "diamond", type: "uint256", internalType: "uint256" },
                    { name: "wood", type: "uint256", internalType: "uint256" },
                    { name: "stone", type: "uint256", internalType: "uint256" },
                ],
            },
            {
                name: "_poolTokenAmounts",
                type: "tuple[]",
                internalType: "struct PoolPlayground.TokenAmounts[]",
                components: [
                    { name: "diamond", type: "uint256", internalType: "uint256" },
                    { name: "wood", type: "uint256", internalType: "uint256" },
                    { name: "stone", type: "uint256", internalType: "uint256" },
                ],
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "getContractAddress",
        inputs: [{ name: "_identifier", type: "string", internalType: "string" }],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getUserTokenBalances",
        inputs: [{ name: "_user", type: "address", internalType: "address" }],
        outputs: [
            {
                name: "userTokenBalances",
                type: "tuple",
                internalType: "struct PoolPlayground.TokenAmounts",
                components: [
                    { name: "diamond", type: "uint256", internalType: "uint256" },
                    { name: "wood", type: "uint256", internalType: "uint256" },
                    { name: "stone", type: "uint256", internalType: "uint256" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getUserTokens",
        inputs: [{ name: "_user", type: "address", internalType: "address" }],
        outputs: [
            {
                name: "",
                type: "tuple",
                internalType: "struct PoolPlayground.TokenAddresses",
                components: [
                    { name: "diamond", type: "address", internalType: "address" },
                    { name: "wood", type: "address", internalType: "address" },
                    { name: "stone", type: "address", internalType: "address" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "event",
        name: "TokensAndPoolsCreated",
        inputs: [
            {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
            },
        ],
        anonymous: false,
    },
]
