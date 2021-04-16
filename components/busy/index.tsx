import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader } from '@chakra-ui/react'

type BusyProps = {
    show: boolean
}

const Busy = ({ show }: BusyProps) => {
    return (
        <Modal isOpen={show} onClose={() => {}}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Busy...</ModalHeader>
            </ModalContent>
        </Modal>
    )
}

export default Busy
