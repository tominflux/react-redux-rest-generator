import React from 'react'
import { Box, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'
import DatePicker from 'components/datePicker'

type ExampleFormProps = {
    getField: (name: keyof ExampleSerialized) => unknown
    setField: (name: keyof ExampleSerialized, value: unknown) => void
    onConfirm: () => void
}

const ExampleForm = ({ getField, setField, onConfirm }: ExampleFormProps) => {
    return (
        <>
            <Box py={1}>
                <FormControl id="title">
                    <FormLabel>Title</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter a title..."
                        defaultValue={(getField('title') as string) ?? ''}
                        onChange={(e) => setField('title', e.target.value)}
                    />
                </FormControl>
            </Box>
            <Box py={1}>
                <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        type="text"
                        placeholder="Enter a description..."
                        defaultValue={(getField('description') as string) ?? ''}
                        onChange={(e) => setField('description', e.target.value)}
                    />
                </FormControl>
            </Box>
            <Box py={1}>
                <FormControl id="expiry-date">
                    <FormLabel>Expiry Date</FormLabel>
                    <DatePicker
                        selectedDate={new Date(getField('expiryDate') as string)}
                        onChange={(date) => setField('expiryDate', date.toISOString())}
                        showPopperArrow={true}
                    />
                </FormControl>
            </Box>
            <Box py={1} textAlign="center">
                <Button onClick={() => onConfirm()}>Confirm</Button>
            </Box>
        </>
    )
}

export default ExampleForm
