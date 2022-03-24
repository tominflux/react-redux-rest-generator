import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import useStore from 'redux/store'
import 'react-datepicker/dist/react-datepicker.css'
import 'styles/datePicker/styles.css'
import R3gScheduler from 'components/r3gScheduler'

const ExampleApp = ({ Component, pageProps }) => {
    const store = useStore()

    return (
        <ReduxProvider store={store}>
            <R3gScheduler />
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </ReduxProvider>
    )
}

export default ExampleApp
