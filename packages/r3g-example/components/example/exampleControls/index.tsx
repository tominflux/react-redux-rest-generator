import React from 'react'
import { Box, Button } from '@chakra-ui/react'
import { useExample } from 'restClients/example'
import ExampleCreateModal from './ExampleCreateModal'
import ExampleEditModal from './ExampleEditModal'
import ExampleDeleteModal from './ExampleDeleteModal'

type ExampleControlsProps = {
    showCreateModal: boolean
    showEditModal: boolean
    showDeleteModal: boolean
    editId: ExampleIdentifier
    deleteId: ExampleIdentifier
    onCreateModalClose: () => void
    onEditModalClose: () => void
    onDeleteModalClose: () => void
    onCreatePrompt: () => void
}

const ExampleControls = ({
    showCreateModal,
    showEditModal,
    showDeleteModal,
    editId,
    deleteId,
    onCreateModalClose,
    onEditModalClose,
    onDeleteModalClose,
    onCreatePrompt
}: ExampleControlsProps) => {
    // Interface for manipulating server-side data
    const exampleInterface = useExample()

    // Events
    // - Create Modal
    const handleCreateModalClose = () => {
        exampleInterface.read({})
        onCreateModalClose()
    }
    // - Edit Modal
    const handleEditModalClose = () => {
        exampleInterface.read({})
        onEditModalClose()
    }
    // - Delete Modal
    const handleDeleteModalClose = () => {
        onDeleteModalClose()
    }
    const handleDeletionOccured = () => {
        exampleInterface.invalidate()
    }

    return (
        <>
            {/* Create Button */}
            <Box py={4}>
                <Button onClick={() => onCreatePrompt()}>Create</Button>
            </Box>
            {/* Create Modal */}
            <ExampleCreateModal show={showCreateModal} onClose={handleCreateModalClose} />
            {/* Edit Modal */}
            <ExampleEditModal
                show={showEditModal}
                example={editId ? exampleInterface.getOne(editId) : null}
                onClose={handleEditModalClose}
            />
            {/* Delete Modal */}
            <ExampleDeleteModal
                show={showDeleteModal}
                example={deleteId ? exampleInterface.getOne(deleteId) : null}
                onClose={handleDeleteModalClose}
                onConfirm={handleDeletionOccured}
            />
        </>
    )
}

export default ExampleControls
