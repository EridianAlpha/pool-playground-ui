import React, { useState, useEffect } from "react"
import { HStack, Text, Box, Flex } from "@chakra-ui/react"
import { FormatDecimals } from "../../utils/FormatDecimals"

export default function BalanceProfitContainer({ marketPrice, userBalance, initialUserBalance }) {
    const [totalValue, setTotalValue] = useState(0)
    const [profit, setProfit] = useState(0)

    const { formatDecimals } = FormatDecimals()

    // Calculate total value
    useEffect(() => {
        const newValue = Object.keys(userBalance).reduce((acc, key) => {
            return acc + userBalance[key] * marketPrice[key]
        }, 0)
        setTotalValue(newValue)
    }, [userBalance, marketPrice])

    // Calculate profit
    useEffect(() => {
        const newProfit = Object.keys(userBalance).reduce((acc, key) => {
            return acc + (userBalance[key] - initialUserBalance[key]) * marketPrice[key]
        }, 0)
        setProfit(newProfit)
    }, [userBalance, initialUserBalance, marketPrice])

    return (
        <HStack w={"100%"} justifyContent={"center"}>
            <Flex
                direction={{ base: "column", xl: "row" }}
                alignItems={"center"}
                className="contentContainer"
                borderRadius={{ base: "30px", xl: "full" }}
                minH={"38px"}
                overflow={"hidden"}
                gap={0}
            >
                <HStack px={{ base: 5, xl: 3 }} minH={"38px"} fontWeight={"bold"}>
                    <Text fontSize={"lg"} whiteSpace={"nowrap"}>
                        Your total balance
                    </Text>
                    <Text className={"bgPage"} borderRadius={"full"} px={2}>
                        ${formatDecimals(totalValue)}
                    </Text>
                </HStack>
                <Box w={{ base: "100%", xl: "4px" }} bg="blue" minH={{ base: "4px", xl: "38px" }} />
                <HStack px={{ base: 5, xl: 3 }} minH={"38px"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                    <Text fontSize={"lg"}>{profit >= 0 ? "Profit" : "Loss"}</Text>
                    <Text
                        className={profit === 0 ? "bgPage" : null}
                        bg={profit > 0 ? "green" : profit < 0 ? "red" : null}
                        borderRadius={"full"}
                        px={2}
                    >
                        {profit > 0 ? "+ " : profit < 0 ? "- " : ""}${formatDecimals(Math.abs(profit))}
                    </Text>
                </HStack>
            </Flex>
        </HStack>
    )
}
