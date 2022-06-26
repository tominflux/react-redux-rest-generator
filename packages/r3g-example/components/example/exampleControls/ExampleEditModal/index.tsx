import React, { ReactElement, useEffect } from 'react'
import { Box, Modal, ModalContent, Text } from '@chakra-ui/react'
import Busy from 'components/busy'
import ExampleForm from '../ExampleForm'
import ExampleSuccess from '../ExampleSuccess'
import ExampleError from '../ExampleError'
import { useExample } from 'restClients/example'

type ExampleEditModalProps = {
    show: boolean
    example: ExampleIdentifier & ExampleBody
    onClose: () => void
}

export default function ExampleEditModal({
    show,
    example,
    onClose
}: ExampleEditModalProps): ReactElement {
    const exampleInterface = useExample()
    const {
        fetching,
        method,
        status,
        message,
        update,
        getField,
        setField,
        clearFields,
        clearResponse
    } = exampleInterface

    // Events
    const handleEdit = () => {
        update({ key: example.key })
    }
    const handleClose = () => {
        clearFields()
        clearResponse()
        onClose()
    }
    const handleTryAgain = () => {
        clearResponse()
    }

    // Functions
    const getRenderState = () => {
        if (method !== 'put' || status === null) {
            return 'form'
        }
        if (status >= 200 && status < 300) {
            return 'success'
        }
        if (status >= 400) {
            return 'error'
        }
        // Never get here.
        return 'error'
    }

    // Computations
    const renderCases = {
        form: <ExampleForm getField={getField} setField={setField} onConfirm={handleEdit} />,
        success: <ExampleSuccess onContinue={handleClose} />,
        error: (
            <ExampleError
                status={status}
                message={message}
                onTryAgain={handleTryAgain}
                onCancel={handleClose}
            />
        )
    }

    // Effects
    // - Initialize fields
    useEffect(() => {
        if (!example) return
        const exampleFields = Object.entries(example)
        exampleFields.forEach(([name, value]) => setField(name as keyof ExampleBody, value))
    }, [example ? example.key : null, show])

    return (
        <>
            <Modal isOpen={show} onClose={handleClose}>
                <ModalContent p={5}>
                    <Box py={4} textAlign="center">
                        <Text fontSize="2xl">Edit Example</Text>
                    </Box>
                    {renderCases[getRenderState()]}
                </ModalContent>
            </Modal>
            <Busy show={method === 'put' && fetching} />
        </>
    )
}
