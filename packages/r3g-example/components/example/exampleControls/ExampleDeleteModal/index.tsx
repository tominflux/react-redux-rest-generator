import React, { ReactElement } from 'react'
import { Box, Button, Modal, ModalContent, Text } from '@chakra-ui/react'
import Busy from 'components/busy'
import { useExample } from 'restClients/example'

type ExampleDeleteModalProps = {
    show: boolean
    example: ExampleIdentifier & ExampleBody
    onClose: () => void
    onConfirm: () => void
}
export default function ExampleDeleteModal({
    show,
    example,
    onClose,
    onConfirm
}: ExampleDeleteModalProps): ReactElement {
    const exampleInterface = useExample()

    // Events
    const handleDelete = async () => {
        // Close modal
        onClose()

        // Delete example on server
        const { status } = await exampleInterface.delete({ key: example.key })

        // If successful...
        const wasSuccessful = status === 204
        if (wasSuccessful) {
            // Notify deletion occured
            onConfirm()

            // Clear response status + message
            exampleInterface.clearResponse()
        }
    }
    const handleDismissError = () => {
        onClose()
        exampleInterface.clearResponse()
    }

    // Computations
    const deletionFailed =
        exampleInterface.method === 'delete' &&
        exampleInterface.status &&
        exampleInterface.status >= 400

    //
    return (
        <>
            {/* Prompt Modal */}
            <Modal isOpen={show} onClose={onClose}>
                <ModalContent p={5}>
                    {example ? (
                        <>
                            <Box py={4} textAlign="center">
                                <Text fontSize="2xl">Delete Example</Text>
                            </Box>
                            <Box py={1} textAlign="center">
                                <Text>
                                    Are you sure you want to delete example{' '}
                                    <strong>{example.title}</strong>?
                                </Text>
                            </Box>
                            <Box py={1} textAlign="center">
                                <Button onClick={() => handleDelete()}>Confirm</Button>
                            </Box>
                        </>
                    ) : null}
                </ModalContent>
            </Modal>

            {/* Error Modal */}
            <Modal isOpen={deletionFailed} onClose={() => handleDismissError()}>
                <ModalContent p={5}>
                    <Box py={4} textAlign="center">
                        <Text fontSize="2xl">Failed to Delete Example</Text>
                    </Box>
                    <Box py={2} textAlign="center">
                        <Text>
                            {exampleInterface.status} - {exampleInterface.message}
                        </Text>
                    </Box>
                    <Box textAlign="center" py={4}>
                        <Button onClick={() => handleDismissError()}>OK</Button>
                    </Box>
                </ModalContent>
            </Modal>

            {/* Fetching Spinner */}
            <Busy show={exampleInterface.method === 'delete' && exampleInterface.fetching} />
        </>
    )
}
