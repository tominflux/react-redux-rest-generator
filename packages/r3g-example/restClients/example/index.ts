import generateRestClient from 'react-redux-rest-generator'
import filterExample from './queryHandlers/filter'
import sortExample from './queryHandlers/sort'
import { DateTime } from 'luxon'

//
const exampleRestClient = generateRestClient<
    ExampleCompositeIdentifier,
    ExampleSerialized,
    ReadExampleParams
>({
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
})
console.log('REST CLIENT', exampleRestClient)
console.log('INTIIAL STATE', exampleRestClient.getInitialState())
export const exampleReducer = exampleRestClient.reducer
export const useExample = exampleRestClient.controllerHook
export const useExampleScheduler = exampleRestClient.schedulerHook
