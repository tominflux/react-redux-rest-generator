import React, { useState } from 'react'
import { Container } from '@chakra-ui/react'
import ExampleGallery from 'components/example/exampleGallery'
import ExampleControls from 'components/example/exampleControls'
import { useSelector } from 'react-redux'
import { RestReduxState } from 'react-redux-rest-generator/dist/generateRestClient/generateRestRedux/types'

const ExamplePage = () => {
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [editId, setEditId] = useState<ExampleCompositeIdentifier>(null)
    const [deleteId, setDeleteId] = useState<ExampleCompositeIdentifier>(null)

    const state = useSelector<{
        exampleState: RestReduxState<ExampleCompositeIdentifier, ExampleSerialized>
    }>((state) => state)
    console.log('DEBUG', state)

    // Events
    // - Create modal
    const handleCreatePrompt = () => setShowCreateModal(true)
    const handleCloseCreateModal = () => setShowCreateModal(false)
    // - Edit modal
    const handleCardClick = (example: ExampleCompositeIdentifier & ExampleSerialized) => {
        setEditId({ key: example.key })
        setShowEditModal(true)
    }
    const handleCloseEditModal = () => {
        setShowEditModal(false)
        setEditId(null)
    }
    // - Delete modal
    const handlePromptDeletion = (example: ExampleCompositeIdentifier & ExampleSerialized) => {
        setDeleteId({ key: example.key })
        setShowDeleteModal(true)
    }
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
        setDeleteId(null)
    }

    return (
        <Container>
            <ExampleGallery onCardClick={handleCardClick} onPromptDeletion={handlePromptDeletion} />
            <ExampleControls
                showCreateModal={showCreateModal}
                showEditModal={showEditModal}
                showDeleteModal={showDeleteModal}
                editId={editId}
                deleteId={deleteId}
                onCreateModalClose={handleCloseCreateModal}
                onEditModalClose={handleCloseEditModal}
                onDeleteModalClose={handleCloseDeleteModal}
                onCreatePrompt={handleCreatePrompt}
            />
        </Container>
    )
}

export default ExamplePage
