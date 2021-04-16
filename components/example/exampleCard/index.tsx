import React from 'react'
import { Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react'
import { DateTime } from 'luxon'

type ExampleCardProps = {
    example: ExampleCompositeIdentifier & ExampleSerialized
    onClick: (example: ExampleCompositeIdentifier & ExampleSerialized) => void
    onDelete: (example: ExampleCompositeIdentifier & ExampleSerialized) => void
}

const ExampleCard = ({ example }: ExampleCardProps) => {
    const dateView = DateTime.fromISO(example.expiryDate).toLocaleString({ locale: 'en' })

    return (
        <Box
            maxW={'445px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
        >
            <Stack>
                <Heading
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}
                >
                    {example.title}
                </Heading>
                <Text color={'gray.500'}>{example.description}</Text>
            </Stack>
            <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                    <Text color={'gray.500'}>{dateView}</Text>
                </Stack>
            </Stack>
        </Box>
    )
}

export default ExampleCard
