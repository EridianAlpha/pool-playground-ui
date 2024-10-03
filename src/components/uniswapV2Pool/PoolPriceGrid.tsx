import { Grid, GridItem } from "@chakra-ui/react"
import TextHighlightContainer from "./TextHighlightContainer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEquals } from "@fortawesome/free-solid-svg-icons"

export default function PoolPriceGrid({ data }) {
    const token0Amount = data.token0.tokenAmount
    const token1Amount = data.token1.tokenAmount

    const formatNumber = (number) => (number % 1 === 0 ? number : number.toFixed(1))

    // First row calculations
    const token1PerToken0 = token1Amount / token0Amount
    const poolPriceToken0InUSD = token1PerToken0 * data.token1.marketPrice
    const marketPriceToken0 = data.token0.marketPrice

    const priceDifferenceToken0 = poolPriceToken0InUSD - marketPriceToken0
    const percentageDifferenceToken0 = (priceDifferenceToken0 / marketPriceToken0) * 100

    const tooltipTextToken0 =
        Math.abs(priceDifferenceToken0).toFixed(0) === "0"
            ? "At market price"
            : `${formatNumber(Math.abs(percentageDifferenceToken0))}% ${priceDifferenceToken0 > 0 ? "above" : "below"} market price`

    // Second row calculations
    const token0PerToken1 = token0Amount / token1Amount
    const poolPriceToken1InUSD = token0PerToken1 * data.token0.marketPrice
    const marketPriceToken1 = data.token1.marketPrice

    const priceDifferenceToken1 = poolPriceToken1InUSD - marketPriceToken1
    const percentageDifferenceToken1 = (priceDifferenceToken1 / marketPriceToken1) * 100
    const isAboveMarketPriceToken1 = priceDifferenceToken1 > 0

    const tooltipTextToken1 =
        Math.abs(priceDifferenceToken1).toFixed(0) === "0"
            ? "At market price"
            : `${formatNumber(Math.abs(percentageDifferenceToken1))}% ${isAboveMarketPriceToken1 ? "above" : "below"} market price`

    return (
        <Grid templateColumns="repeat(5, auto)" columnGap={2} rowGap={3} justifyContent="center" alignItems={"baseline"} whiteSpace={"nowrap"}>
            <GridItem>
                <TextHighlightContainer text={`1 ${data.token0.emoji}`} />
            </GridItem>
            <GridItem>
                <FontAwesomeIcon icon={faEquals} size={"xs"} />
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={`${formatNumber(token1PerToken0)} ${data.token1.emoji}`} />
            </GridItem>
            <GridItem>
                <FontAwesomeIcon icon={faEquals} size={"xs"} />
            </GridItem>
            <GridItem>
                <TextHighlightContainer
                    text={`$${poolPriceToken0InUSD.toFixed(0)}`}
                    fontWeight={"semibold"}
                    borderColor={
                        Number(priceDifferenceToken0.toFixed(0)) > 0 ? "green" : Number(priceDifferenceToken0.toFixed(0)) < 0 ? "red" : "transparent"
                    }
                    tooltipText={tooltipTextToken0}
                />
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={`1 ${data.token1.emoji}`} />
            </GridItem>
            <GridItem>
                <FontAwesomeIcon icon={faEquals} size={"xs"} />
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={`${formatNumber(token0PerToken1)} ${data.token0.emoji}`} />
            </GridItem>
            <GridItem>
                <FontAwesomeIcon icon={faEquals} size={"xs"} />
            </GridItem>
            <GridItem minW={"85px"}>
                <TextHighlightContainer
                    text={`$${poolPriceToken1InUSD.toFixed(0)}`}
                    fontWeight={"semibold"}
                    borderColor={
                        Number(priceDifferenceToken1.toFixed(0)) > 0 ? "green" : Number(priceDifferenceToken1.toFixed(0)) < 0 ? "red" : "transparent"
                    }
                    tooltipText={tooltipTextToken1}
                />
            </GridItem>
        </Grid>
    )
}
