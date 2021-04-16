import React, { ReactElement } from 'react'
import { Box, Modal, ModalContent, Text } from '@chakra-ui/react'
import Busy from 'components/busy'
import ExampleForm from '../ExampleForm'
import ExampleSuccess from '../ExampleSuccess'
import ExampleError from '../ExampleError'
import { useExample } from 'restClients/example'

type ExampleCreateModalProps = {
    show: boolean
    onClose: () => void
}

export default function ExampleCreateModal({
    show,
    onClose
}: ExampleCreateModalProps): ReactElement {
    const exampleInterface = useExample()
    const {
        fetching,
        method,
        status,
        message,
        create,
        getField,
        setField,
        clearFields,
        clearResponse
    } = exampleInterface

    // Events
    const handleCreate = () => {
        create()
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
        if (method !== 'post' || status === null) {
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
        form: (
            <ExampleForm
                getField={getField}
                setField={setField}
                onConfirm={handleCreate} // onCreate onUpdate
            />
        ),
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

    return (
        <>
            <Modal isOpen={show} onClose={handleClose}>
                <ModalContent p={5}>
                    <Box py={4} textAlign="center">
                        <Text fontSize="2xl">Create Example</Text>
                    </Box>
                    {renderCases[getRenderState()]}
                </ModalContent>
            </Modal>
            <Busy show={method === 'post' && fetching} />
        </>
    )
}
