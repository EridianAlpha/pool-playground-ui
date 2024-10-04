import React, { useRef, useEffect, useState } from "react"
import { Box } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"

const ParticleAnimation = () => {
    const containerRef = useRef(null)
    const [pageSize, setPageSize] = useState({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
    })

    useEffect(() => {
        const updatePageSize = () => {
            setPageSize({
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
            })
        }

        window.addEventListener("resize", updatePageSize)
        updatePageSize()

        return () => window.removeEventListener("resize", updatePageSize)
    }, [])

    const animParticle = keyframes`
    from { transform: translateY(0px); }
    to { transform: translateY(-${2 * pageSize.height}px); }
  `

    // Helper function to generate particle shadows within the viewport dimensions
    function generateParticles(maxParticles) {
        const colorParticle = "#0da6d8"
        let particles = `0px 0px ${colorParticle}`

        for (let i = 1; i <= maxParticles; i++) {
            const x = Math.random() * pageSize.width
            const y = Math.random() * (2 * pageSize.height) // Multiply by 2 here
            particles += `, ${x}px ${y}px ${colorParticle}`
        }
        return particles
    }

    const particleStyles = {
        position: "absolute",
        borderRadius: "50%",
        background: "transparent",
    }

    const particle1Styles = {
        ...particleStyles,
        animation: `${animParticle} 120s linear infinite`,
        boxShadow: generateParticles(200),
        height: "2px",
        width: "2px",
        "&:after": {
            content: '""',
            borderRadius: "50%",
            position: "absolute",
            boxShadow: generateParticles(180),
            height: "2px",
            width: "2px",
        },
    }

    const particle2Styles = {
        ...particleStyles,
        animation: `${animParticle} 240s linear infinite`,
        boxShadow: generateParticles(160),
        height: "2px",
        width: "2px",
        "&:after": {
            content: '""',
            borderRadius: "50%",
            position: "absolute",
            boxShadow: generateParticles(100),
            height: "3px",
            width: "3px",
        },
    }

    const particle3Styles = {
        ...particleStyles,
        animation: `${animParticle} 240s linear infinite`,
        boxShadow: generateParticles(160),
        height: "2px",
        width: "2px",
        "&:after": {
            content: '""',
            borderRadius: "50%",
            position: "absolute",
            boxShadow: generateParticles(220),
            height: "3px",
            width: "3px",
        },
    }

    const particle4Styles = {
        ...particleStyles,
        animation: `${animParticle} 400s linear infinite`,
        boxShadow: generateParticles(240),
        height: "1px",
        width: "1px",
        "&:after": {
            content: '""',
            borderRadius: "50%",
            position: "absolute",
            boxShadow: generateParticles(140),
            height: "1px",
            width: "1px",
        },
    }

    return (
        <Box ref={containerRef} position="relative" width="100%" height="100%" overflow="visible">
            <Box sx={particle1Styles} />
            <Box sx={particle2Styles} />
            <Box sx={particle3Styles} />
            <Box sx={particle4Styles} />
        </Box>
    )
}

export default ParticleAnimation
