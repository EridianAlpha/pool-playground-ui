export const FormatDecimals = () => {
    const formatDecimals = (amount: number) => {
        if (amount < 0.02) return 0
        if (Number.isInteger(amount)) return amount

        // Determine the number of decimal places in the amount
        const decimals = amount.toString().split(".")[1]?.length || 0
        if (decimals === 1) return amount.toFixed(1)
        return amount.toFixed(2)
    }

    return { formatDecimals }
}
