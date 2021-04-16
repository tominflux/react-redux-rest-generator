import React from 'react'
import { Box, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

type ExampleGalleryControlsProps = {
    readParams: ReadExampleParams
    setReadParams: React.Dispatch<React.SetStateAction<ReadExampleParams>>
}

const ExampleGalleryControls = ({ readParams, setReadParams }: ExampleGalleryControlsProps) => {
    const handleFilterSelect = (selection: string) => {
        const filterConditions = {
            none: null,
            expired: true,
            notExpired: false
        }

        setReadParams((currentReadParams) => ({
            ...currentReadParams,
            expired: filterConditions[selection ?? 'none']
        }))
    }

    const handleSortSelect = (selection: string) => {
        const sortConditions = {
            none: false,
            expiry: true
        }

        setReadParams((currentReadParams) => ({
            ...currentReadParams,
            byExpiryDate: sortConditions[selection ?? 'none']
        }))
    }

    return (
        <Box borderWidth="1px" borderRadius="lg" p="6">
            <Box px="2">
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Filter By
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => handleFilterSelect('none')}>-None-</MenuItem>
                        <MenuItem onClick={() => handleFilterSelect('expired')}>
                            Only Expired
                        </MenuItem>
                        <MenuItem onClick={() => handleFilterSelect('notExpired')}>
                            Only Not Expired
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            <Box px="2">
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Sort By
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => handleSortSelect('none')}>-None-</MenuItem>
                        <MenuItem onClick={() => handleSortSelect('expiry')}>Expiry Date</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </Box>
    )
}

export default ExampleGalleryControls
