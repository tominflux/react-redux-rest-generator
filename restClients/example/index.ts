import generateRestClient from 'lib/generateRestClient'
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
    identifiers: ['trainerKey', 'key'],
    primaryIdentifier: 'key',
    initialFields: {
        title: 'Lorem ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        expiryDate: DateTime.now().plus({ days: 7 }).toISO()
    },
    filter: filterExample,
    sort: sortExample
})

export const exampleReducer = exampleRestClient.reducer
export const useExample = exampleRestClient.hook