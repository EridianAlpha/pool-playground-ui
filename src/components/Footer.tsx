import { Flex, Link, Text } from "@chakra-ui/react"

import NextLink from "next/link"

export default function Footer() {
    return (
        <Flex direction={"column"} alignItems={"center"} pb={5} px={3} gap={1}>
            <Text fontWeight={"bold"}>
                Built with ❤️ by{" "}
                <Link as={NextLink} href={"https://eridian.xyz"} color={"blue"} textDecoration={"underline"} target="_blank">
                    Eridian
                </Link>
            </Text>
        </Flex>
    )
}
