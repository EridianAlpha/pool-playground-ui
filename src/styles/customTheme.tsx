import { extendTheme } from "@chakra-ui/react"
import type { StyleFunctionProps } from "@chakra-ui/styled-system"
import { cssVar } from "@chakra-ui/theme-tools"
import { lighten, darken, border, borderColor, opacify, margin, padding } from "polished"

import { keyframes } from "@emotion/react"

function lightenColor(mainColor, value) {
    return lighten(value, mainColor)
}
function darkenColor(mainColor, value) {
    return darken(value, mainColor)
}

const rainbowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const scaleAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const scaleAnimationOffset = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
  100% { transform: translate(-50%, -50%) scale(1); }
`

const customTheme = extendTheme({
    styles: {
        global: (props: StyleFunctionProps) => ({
            ".bgPage": {
                bg: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
            },
            ".bgContent": {
                bg:
                    props.colorMode === "dark"
                        ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                        : darkenColor(props.theme.colors.pageBackground.light, 0.05),
            },
            ".contentContainer": {
                bg:
                    props.colorMode === "dark"
                        ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                        : darkenColor(props.theme.colors.contentBackground.light, 0),
                border: `4px solid ${props.theme.colors.blue}`,
            },
            ".headingContainer": {
                bg:
                    props.colorMode === "dark"
                        ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                        : darkenColor(props.theme.colors.contentBackground.light, 0),
                borderTop: `4px solid ${props.theme.colors.blue}`,
                borderLeft: `4px solid ${props.theme.colors.blue}`,
                borderRight: `4px solid ${props.theme.colors.blue}`,
            },
            ".tokenBalanceContainer": {
                bg:
                    props.colorMode === "dark"
                        ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                        : darkenColor(props.theme.colors.contentBackground.light, 0),
                border: "4px solid gold",
            },
            ".errorText": {
                bg:
                    props.colorMode === "dark"
                        ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                        : darkenColor(props.theme.colors.contentBackground.light, 0),
                border: "4px solid red",
            },
            ".tooltip": {
                bg:
                    props.colorMode === "dark"
                        ? `${lightenColor(props.theme.colors.pageBackground.dark, 0.1)} !important`
                        : `${darkenColor(props.theme.colors.pageBackground.light, 0.05)} !important`,
                [cssVar("popper-arrow-bg").variable]:
                    props.colorMode === "dark"
                        ? `${lightenColor(props.theme.colors.pageBackground.dark, 0.1)} !important`
                        : `${darkenColor(props.theme.colors.pageBackground.light, 0.05)} !important`,
            },
            ".tooltipLabel": {
                paddingX: "10px",
                paddingY: "5px",
                borderRadius: "7px",
                color: "var(--chakra-colors-chakra-body-text)",
            },
            // Increase the tooltip arrow size
            "div .chakra-tooltip__arrow": {
                width: "130% !important",
                height: "130% !important",
            },
            ".rainbowButtonAnimation": {
                animation: `${rainbowAnimation} 20s linear infinite, ${scaleAnimation} 2s ease-in-out infinite`,
            },
            ".rainbowButtonAnimationOffset": {
                animation: `${rainbowAnimation} 20s linear infinite, ${scaleAnimationOffset} 2s ease-in-out infinite`,
            },
        }),
    },
    components: {
        Code: {
            baseStyle: (props: StyleFunctionProps) => ({
                bg:
                    props.colorMode === "dark"
                        ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                        : darkenColor(props.theme.colors.pageBackground.light, 0.05),
            }),
        },
        Drawer: {
            variants: {
                solid: (props) => ({
                    dialog: {
                        bg: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
                    },
                }),
            },
            defaultProps: {
                variant: "solid",
            },
        },
        Input: {
            variants: {
                ValueInput: (props: StyleFunctionProps) => ({
                    field: {
                        bg: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
                        marginRight: "-3px",
                        paddingLeft: "10px",
                        paddingRight: "0px",
                        border: "3px solid",
                        borderRadius: "full",
                        borderColor: props.theme.colors.blue,
                        _hover: {
                            borderColor:
                                props.colorMode === "dark" ? lightenColor(props.theme.colors.blue, 0.2) : darkenColor(props.theme.colors.blue, 0.2),
                        },
                        _focus: {
                            borderColor:
                                props.colorMode === "dark" ? lightenColor(props.theme.colors.blue, 0.4) : darkenColor(props.theme.colors.blue, 0.4),
                        },
                        _disabled: {
                            opacity: 1,
                            cursor: "default",
                            borderColor: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
                            _hover: {
                                borderColor: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
                            },
                        },
                    },
                }),
            },
        },
        Button: {
            variants: {
                HeaderButton: (props: StyleFunctionProps) => ({
                    bg:
                        props.colorMode === "dark"
                            ? lightenColor(props.theme.colors.pageBackground.dark, 0.1)
                            : darkenColor(props.theme.colors.pageBackground.light, 0.05),
                    _hover: {
                        bg:
                            props.colorMode === "dark"
                                ? lightenColor(props.theme.colors.pageBackground.dark, 0.2)
                                : darkenColor(props.theme.colors.pageBackground.light, 0.15),
                    },
                    _active: {
                        bg:
                            props.colorMode === "dark"
                                ? lightenColor(props.theme.colors.pageBackground.dark, 0.3)
                                : darkenColor(props.theme.colors.pageBackground.light, 0.2),
                    },
                }),
                RainbowButton: (props: StyleFunctionProps) => ({
                    filter: "brightness(1.7)",
                    _hover: {
                        filter: "brightness(2)",
                    },
                    _active: {
                        filter: "brightness(2.3)",
                    },
                    backgroundImage: "linear-gradient(270deg, pink, purple, blue, red, blue, purple, pink)",
                    backgroundSize: "1000% 1000%",
                    textShadow: props.colorMode === "dark" ? "0px 0px 5px black" : "0px",
                }),
                WalletButton: (props: StyleFunctionProps) => ({
                    border: "3px solid",
                    borderColor: props.theme.colors.orange,
                    bg:
                        props.colorMode === "dark"
                            ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                            : darkenColor(props.theme.colors.contentBackground.light, 0),
                    _hover: {
                        bg: props.colorMode === "dark" ? darkenColor(props.theme.colors.orange, 0.2) : lightenColor(props.theme.colors.orange, 0.2),
                    },
                    _active: {
                        bg: props.theme.colors.orange,
                    },
                }),
                DeployPlaygroundButton: (props: StyleFunctionProps) => ({
                    border: "3px solid",
                    borderColor: props.theme.colors.gold,
                    bg:
                        props.colorMode === "dark"
                            ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                            : darkenColor(props.theme.colors.contentBackground.light, 0),
                    _hover: {
                        bg: props.colorMode === "dark" ? darkenColor(props.theme.colors.gold, 0.2) : lightenColor(props.theme.colors.gold, 0.2),
                    },
                    _active: {
                        bg: props.theme.colors.gold,
                    },
                }),
                ResetPlaygroundButton: (props: StyleFunctionProps) => ({
                    border: "3px solid",
                    borderColor: props.theme.colors.orange,
                    bg:
                        props.colorMode === "dark"
                            ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                            : darkenColor(props.theme.colors.contentBackground.light, 0),
                    _hover: {
                        bg: props.colorMode === "dark" ? darkenColor(props.theme.colors.orange, 0.2) : lightenColor(props.theme.colors.orange, 0.2),
                    },
                    _active: {
                        bg: props.theme.colors.orange,
                    },
                }),
                ExecuteSwap: (props: StyleFunctionProps) => ({
                    border: "3px solid",
                    borderColor: props.theme.colors.gold,
                    bg:
                        props.colorMode === "dark"
                            ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                            : darkenColor(props.theme.colors.contentBackground.light, 0),
                    _hover: {
                        bg: props.colorMode === "dark" ? darkenColor(props.theme.colors.gold, 0.2) : lightenColor(props.theme.colors.gold, 0.2),
                    },
                    _active: {
                        bg: props.theme.colors.gold,
                    },
                }),
                SwitchTokenButton: (props: StyleFunctionProps) => ({
                    border: "3px solid",
                    borderColor: props.theme.colors.blue,
                    bg:
                        props.colorMode === "dark"
                            ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                            : darkenColor(props.theme.colors.contentBackground.light, 0),
                    _hover: {
                        bg: props.colorMode === "dark" ? darkenColor(props.theme.colors.blue, 0.1) : lightenColor(props.theme.colors.blue, 0.2),
                    },
                    _active: {
                        bg: props.theme.colors.blue,
                    },
                }),
                OptimalSwapTypeSelector: (props: StyleFunctionProps) => ({
                    _hover: {
                        bg:
                            props.colorMode === "dark"
                                ? lightenColor(props.theme.colors.pageBackground.dark, 0.1)
                                : lightenColor(props.theme.colors.blue, 0.2),
                    },
                    _active: {
                        bg:
                            props.colorMode === "dark"
                                ? lightenColor(props.theme.colors.pageBackground.dark, 0.15)
                                : lightenColor(props.theme.colors.blue, 0.2),
                    },
                }),
            },
        },
        Menu: {
            baseStyle: (props: StyleFunctionProps) => ({
                list: {
                    bg: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
                    borderColor: props.theme.colors.blue,
                    borderRadius: "20px",
                    overflow: "hidden",
                    paddingTop: "0",
                    paddingBottom: "0",
                    borderWidth: "3px",
                },
                item: {
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    bg: props.colorMode === "dark" ? "pageBackground.dark" : "pageBackground.light",
                    _hover: {
                        bg:
                            props.colorMode === "dark"
                                ? lightenColor(props.theme.colors.pageBackground.dark, 0.05)
                                : darkenColor(props.theme.colors.pageBackground.light, 0.05),
                    },
                },
                groupTitle: {
                    textAlign: "left",
                    marginLeft: "0.8rem",
                },
            }),
        },
    },
    colors: {
        pageBackground: {
            light: "#FFFFFF",
            dark: "#032e63",
        },
        contentBackground: {
            light: "#EDF2F7",
            dark: "#053520",
        },
        gold: "#e7c60d",
        red: "#EC420C",
        green: "#289e33",
        blue: "#0da6d8",
        pink: "#b124b1",
        purple: "#54199b",
        orange: "#d66b13",
    },
})

export default customTheme
