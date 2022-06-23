import R3gClientFunctions from 'react-redux-rest-generator'
import filterExample from './queryHandlers/filter'
import sortExample from './queryHandlers/sort'
import { DateTime } from 'luxon'
import { R3gResourceConfigParams } from 'react-redux-rest-generator/dist/client/types'

const exampleConfigParams: R3gResourceConfigParams<
    ExampleCompositeIdentifier,
    ExampleSerialized,
    ReadExampleParams
> = {
    name: 'example',
    identifiers: ['key'],
    primaryIdentifier: 'key',
    initialFields: {
        title: 'Lorem ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        expiryDate: DateTime.now().plus({ days: 7 }).toISO()
    },
    filter: filterExample,
    sort: sortExample
}

//
const exampleRestClient = R3gClientFunctions.getClient<
    ExampleCompositeIdentifier,
    ExampleSerialized,
    ReadExampleParams
>(exampleConfigParams)
// console.log('REST CLIENT', exampleRestClient)
export const exampleConfig = exampleRestClient.config
export const exampleReducer = exampleRestClient.reducer
export const useExample = exampleRestClient.useResource
export const useExampleScheduler = exampleRestClient.useResourceScheduler
