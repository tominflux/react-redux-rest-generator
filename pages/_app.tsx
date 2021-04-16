import { ChakraProvider } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css'
import 'styles/datePicker/styles.css'

const ExampleApp = ({ Component, pageProps }) => {
    return (
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default ExampleApp
