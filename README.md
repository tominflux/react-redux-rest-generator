# react-redux-rest-generator (R3G)

Generate a reducer and a hook for performing CRUD operations on a REST API without all the boilerplate. 

## Types

A few types need to be defined to ensure your hook is meaningfully typed.

### Composite Identifier

Resources may be uniquely identified by one or more properties. *R3G* uses the combination of these properties in a single object to handle identification of resources.

*The composite identifier must be compatible with *JSON.stringify(...)**

```typescript
// Properties that uniquely identify an ~Example~
type ExampleCompositeIdentifier = {
    key: string
}
```

### Serialized Generic Resource

*R3G* also requires a type that reflects the data/fields of your resource.

Often times the composite identifier and serialized generic will be combined (resulting type will be an intersection of the two) to represent a complete identifiable resource with all its data.

*The serialized generic resource must be compatible with *JSON.stringify(...)**

```typescript
// Properties that represent an ~Example's~ fields
type ExampleSerialized = {
    title: string
    description: string
    expiryDate: string
}
```

### Read Params

*R3G* allows client-side filtering and sorting of resources that have been locally cached. In order to do so, an object of optional parameters is required.

```typescript
// Parameters that resources can be filtered and sorted by.
type ReadExampleParams = {
    key?: string
    title?: string
    expired?: boolean
    byExpiryDate?: boolean
}
```

## Query Functions

To facilitate filtering and sorting of resources from the client-side cache, *R3G* requires two user-defined functions to handle this behavior. 

### Filter

Resembling the native *Array.filter(...)* function, the *R3G* filter function is given a resource object and read parameters, which it can use to determine if the resource is to be filtered out of the query or not. 

Returning **true** indicates the resource is valid and will be returned in the query. Returning **false** indicated the resource will be filtered out of the query.

*Example snippet makes use of DateTime object from [**luxon**](https://www.npmjs.com/package/luxon) library*

```typescript
const filterExample = (
    example: ExampleCompositeIdentifier & ExampleSerialized,
    params: ReadExampleParams
) => {
    const { key, title, expired } = params

    // Match key filter
    const keyFilterEnabled = (key ?? null) !== null
    if (keyFilterEnabled && example.key !== key) return false

    // Match title filter
    const titleFilterEnabled = (title ?? null) !== null
    if (titleFilterEnabled && example.title !== title) return false

    // Match expired filter
    const expiredFilterEnabled = (expired ?? null) !== null
    if (expiredFilterEnabled) {
        const expiryTimestamp = DateTime.fromISO(example.expiryDate).valueOf()
        const currentTimestamp = DateTime.now().valueOf()
        const isExpired = expiryTimestamp <= currentTimestamp
        const conditionGetters = {
            true: () => isExpired,
            false: () => !isExpired
        }
        const getCondition = conditionGetters[expired.toString()]
        const matchesCondition = getCondition()
        return matchesCondition
    }

    return true
}
```

### Sort

Resembling the native *Array.sort(...)* function, the R3G sort function is given two resources to compare and read parameters. It uses these to determine if resource A should come before or after resource B in the resulting array.

Returning value **greater than 0** indicates resource B comes after resource A. Returning value **less than 0** indicates resource B combes before resource A. Return value **equal to 0** leaves the resources in the same comparative position in the resulting array.

