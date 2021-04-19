import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react'

type ExampleSuccessProps = {
    onContinue: () => void
}

const ExampleSuccess = ({ onContinue }: ExampleSuccessProps) => {
    return (
        <>
            <Box pt={2} pb={3} textAlign="center">
                <Text fontSize="2xl">Success</Text>
            </Box>
            <Box textAlign="center" py={4}>
                <Button onClick={() => onContinue()}>Continue</Button>
            </Box>
        </>
    )
}

export default ExampleSuccess
