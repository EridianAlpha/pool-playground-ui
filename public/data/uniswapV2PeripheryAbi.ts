export const abi = [
    { type: "constructor", inputs: [{ name: "_nftAddress", type: "address", internalType: "address" }], stateMutability: "nonpayable" },
    {
        type: "function",
        name: "SETTLEMENT_NFT",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "contract SettlementNft" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "SETTLERS_TOKEN",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "contract SettlerToken" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getRandomData",
        inputs: [{ name: "requestedNumber", type: "uint256", internalType: "uint256" }],
        outputs: [
            {
                name: "results",
                type: "tuple[]",
                internalType: "struct ViewAggregator.SettlementData[]",
                components: [
                    { name: "owner", type: "address", internalType: "address" },
                    { name: "daysSinceMint", type: "uint256", internalType: "uint256" },
                    { name: "tokens", type: "uint256", internalType: "uint256" },
                    { name: "chainId", type: "uint256", internalType: "uint256" },
                    { name: "nftId", type: "uint256", internalType: "uint256" },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getSequentialData",
        inputs: [
            { name: "_startingNftId", type: "uint256", internalType: "uint256" },
            { name: "_endingNftId", type: "uint256", internalType: "uint256" },
        ],
        outputs: [
            {
                name: "results",
                type: "tuple[]",
                internalType: "struct ViewAggregator.SettlementData[]",
                components: [
                    { name: "owner", type: "address", internalType: "address" },
                    { name: "daysSinceMint", type: "uint256", internalType: "uint256" },
                    { name: "tokens", type: "uint256", internalType: "uint256" },
                    { name: "chainId", type: "uint256", internalType: "uint256" },
                    { name: "nftId", type: "uint256", internalType: "uint256" },
                ],
            },
        ],
        stateMutability: "view",
    },
]
