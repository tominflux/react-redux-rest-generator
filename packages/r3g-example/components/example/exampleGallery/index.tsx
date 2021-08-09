import React, { ReactElement, useEffect, useState } from 'react'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import ExampleCard from '../exampleCard'
import ExampleGalleryControls from './exampleGalleryControls'
import { useExample } from 'restClients/example'
import Busy from 'components/busy'

type ExampleGalleryProps = {
    onCardClick: (example: ExampleCompositeIdentifier & ExampleSerialized) => void
    onPromptDeletion: (example: ExampleCompositeIdentifier & ExampleSerialized) => void
}

export default function ExampleGallery({
    onCardClick,
    onPromptDeletion
}: ExampleGalleryProps): ReactElement {
    // Changeable read params (filter & sort options)
    const [readParams, setReadParams] = useState<ReadExampleParams>({
        key: null,
        title: null,
        expired: null,
        byExpiryDate: false
    })

    // Get data from server via hook & store client-side
    const exampleInterface = useExample()
    const { method, fetching } = exampleInterface
    const exampleList = exampleInterface.getMany(readParams)
    const didJustCreate = exampleInterface.method === 'post' && exampleInterface.status === 201
    const didJustUpdate = exampleInterface.method === 'update' && exampleInterface.status === 204
    const didJustDelete = exampleInterface.method === 'delete' && exampleInterface.status === 204
    const invalidCache = didJustCreate || didJustUpdate || didJustDelete

    // Actions
    const readResources = async () => {
        await exampleInterface.read(readParams)
    }

    // Effects
    // - Read resources when gallery settings change
    useEffect(() => {
        readResources()
    }, [readParams.key, readParams.title, readParams.expired, readParams.byExpiryDate])
    // - Read resources when resource just created, updated or deleted
    useEffect(() => {
        if (!invalidCache) return
        readResources()
    }, [didJustCreate, didJustUpdate, didJustDelete])

    return (
        <>
            <Box pt={8} pb={4}>
                <ExampleGalleryControls readParams={readParams} setReadParams={setReadParams} />
            </Box>
            <Box py={3}>
                <Grid gap={3}>
                    {exampleList.map((example) => (
                        <GridItem colSpan={6}>
                            <ExampleCard
                                example={example}
                                onClick={onCardClick}
                                onDelete={onPromptDeletion}
                            />
                        </GridItem>
                    ))}
                </Grid>
            </Box>
            <Busy show={method === 'get' && fetching} />
        </>
    )
}
