import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import useStore from 'redux/store'
import 'react-datepicker/dist/react-datepicker.css'
import 'styles/datePicker/styles.css'

const ExampleApp = ({ Component, pageProps }) => {
    const store = useStore()

    return (
        <ReduxProvider store={store}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </ReduxProvider>
    )
}

export default ExampleApp
