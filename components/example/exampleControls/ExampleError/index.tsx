import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react'

type ExampleErrorProps = {
    status: number
    message: string
    onTryAgain: () => void
    onCancel: () => void
}

const ExampleError = ({ status, message, onTryAgain, onCancel }: ExampleErrorProps) => {
    return (
        <>
            <Box py={2} textAlign="center">
                <Text fontSize="2xl">Something went wrong</Text>
            </Box>
            <Box py={2} textAlign="center">
                <Text>
                    {status} - {message}
                </Text>
            </Box>
            <Box textAlign="center" py={4}>
                <Button onClick={() => onTryAgain()}>Try Again</Button>
                <Button onClick={() => onCancel()}>Cancel</Button>
            </Box>
        </>
    )
}

export default ExampleError
