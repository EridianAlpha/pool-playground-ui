import { Text, Grid, GridItem } from "@chakra-ui/react"

import TextHighlightContainer from "./TextHighlightContainer"

export default function PoolPriceGrid() {
    return (
        <Grid templateColumns="repeat(5, auto)" columnGap={2} rowGap={3} justifyContent="center" alignItems={"baseline"}>
            <GridItem>
                <TextHighlightContainer text={"1 💎"} />
            </GridItem>
            <GridItem>
                <Text>=</Text>
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={"10 🪵"} />
            </GridItem>
            <GridItem>
                <Text>=</Text>
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={"$200"} fontWeight={"semibold"} borderColor={"green"} tooltipText={"$100 (50%) above market price"} />
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={"1 🪵"} />
            </GridItem>
            <GridItem>
                <Text>=</Text>
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={"0.1 💎"} />
            </GridItem>
            <GridItem>
                <Text>=</Text>
            </GridItem>
            <GridItem>
                <TextHighlightContainer text={"$10"} fontWeight={"semibold"} borderColor={"red"} tooltipText={"$10 (50%) below market price"} />
            </GridItem>
        </Grid>
    )
}
