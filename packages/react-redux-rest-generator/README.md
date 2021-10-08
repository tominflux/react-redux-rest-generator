# react-redux-rest-generator (R3G)

Generate a reducer and a hook for performing CRUD operations on a REST API without all the boilerplate.

---

## Essential Theory

### REST

First and foremost, R3G is entirely dependent on and strictly adheres to RESTful architecture. Many questions concerning R3G can be answered by gaining a deeper understanding of what REST is.

### Resources are Atomic in R3G

REST resources can be interacted with in four different ways; creating, reading, updating and deleting (CRUD). This is achieved via the execution of 5 different kinds of operations; POST, GET, PUT, PATCH and DELETE.

- POST concerns the creation of a _new_ resource instance (not to be used if the instance of said resource can pre-empted to exist at some point in the future).
- GET concerns the reading of resource instances.
- PUT concerns the updating of resource instances in an atomic fashion (entire resource is replaced at once), and also the creation of a specified resource instance if it's existence can be pre-empted.
- PATCH concerns editing specified properties of a resource instance.
- DELETE concerns the removal of resource instances entirely.

R3G only makes use of and only allows 4 of these 5 operations; POST, GET, PUT and DELETE.

Allowing resources to be interacted with non-atomically adds a lot of entropy to a system that handles them. If you wish to have certain properties read-only whilst others are editable, this actually suggests a need for slight re-design, where you covert the read-only properties into a read-only sub-resource.

---

## What is R3G?

R3G is a REST client generator that integrates with React + Redux applications. It abstracts away many common aspects of dealing with a REST API from the client-side.

### Typed Interface for CRUD Operations

At the highest level, R3G's rest clients take on the form of an interface that is produced by a React hook. This interface provides typed methods for executing REST CRUD operations.

### Request Scheduler

R3G REST clients queue and process requests linearly, waiting for one request to resolve (either receive a response or timeout) before sending the next.

### State Machine

R3G REST clients are state machines that represent the current state and history of states of REST API interaction. Public REST client state properties consist of:

- **fetching** - _Boolean_ - Whether or not the client is currently waiting on a response from the server
- **method** - _HTTP Method_ - The HTTP method ('_post_', '_get_', '_put_', '_delete_', _null_) of the most recent/current request (_null_ if no requests have been made or if response information has been cleared).
- **status** - _HTTP Status Code_ - The status code of the most recent HTTP response (_null_ if no responses have been received or if response information has been cleared).
- **message** - _String_ - The message received from the most recent HTTP response (_null_ if no responses have been received or if response information has been cleared).

Internally, other state properties exist within the R3G state machine regarding the scheduling of requests.

All above request and response information can be cleared via the interface's _clearResponse_ method that essentially makes the state machine forget about any API interaction.

This state machine relies on redux for transitioning between immutable states. Part of the the R3G client is a reducer that should be included in the composite reducer of your react-redux based application.

### Resource Cache

R3G REST clients act as a local cache for resources that have been read. If your redux store is persisted to long-term storage (such as LocalStorage in browsers), then resource caches will persist between sessions. This is one reason why resource properties must be of JSON-friendly types (contain no functions or objects with functions as properties).

A resource cache can be cleared by calling the interface's method _invalidate_.

### Form State Manager

It is often the case that when REST resource instances are created or updated, their properties are edited asynchronously client-side before an operation if finally performed on the REST API.

To facilitate this, R3G clients feature a form state and typed methods for manipulating said form state. Only one resource instance can be handled at a time in this way. The current instance's in-situ state consists of _fields_ which represent the resource's properties. Form fields can be accessed and modified via the _getField_ and _setField_ methods of an R3G client interface.

---

## Types

A few types need to be defined to ensure your hook is meaningfully typed.

### Composite Identifier

Resources may be uniquely identified by one or more properties. _R3G_ uses the combination of these properties in a single object to handle identification of resources.

*The composite identifier must be compatible with *JSON.stringify(...)\*\*

```typescript
// Properties that uniquely identify an ~Example~
type ExampleCompositeIdentifier = {
  key: string
}
```

### Serialized Generic Resource

_R3G_ also requires a type that reflects the data/fields of your resource.

Often times the composite identifier and serialized generic will be combined (resulting type will be an intersection of the two) to represent a complete identifiable resource with all its data.

*The serialized generic resource must be compatible with *JSON.stringify(...)\*\*

```typescript
// Properties that represent an ~Example's~ fields
type ExampleSerialized = {
  title: string
  description: string
  expiryDate: string
}
```

### Read Params

_R3G_ allows client-side filtering and sorting of resources that have been locally cached. In order to do so, an object of optional parameters is required.

```typescript
// Parameters that resources can be filtered and sorted by.
type ReadExampleParams = {
  key?: string
  title?: string
  expired?: boolean
  byExpiryDate?: boolean
}
```

---

## Query Functions

To facilitate filtering and sorting of resources from the client-side cache, _R3G_ requires two user-defined functions to handle this behavior.

### Filter

Resembling the native _Array.filter(...)_ function, the _R3G_ filter function is given a resource object and read parameters, which it can use to determine if the resource is to be filtered out of the query or not.

Returning **true** indicates the resource is valid and will be returned in the query. Returning **false** indicated the resource will be filtered out of the query.

_Example snippet makes use of DateTime object from [**luxon**](https://www.npmjs.com/package/luxon) library_

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
      false: () => !isExpired,
    }
    const getCondition = conditionGetters[expired.toString()]
    const matchesCondition = getCondition()
    return matchesCondition
  }

  return true
}
```

### Sort

Resembling the native _Array.sort(...)_ function, the _R3G_ sort function is given two resources to compare and read parameters. It uses these to determine if resource A should come before or after resource B in the resulting array.

Returning value **greater than 0** indicates resource B comes after resource A. Returning value **less than 0** indicates resource B combes before resource A. Return value **equal to 0** leaves the resources in the same comparative position in the resulting array.

---

## Configuration

_R3G's_ generator function requires a configuration object to generate a reducer and hook for the specified resource.

```typescript
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
    expiryDate: DateTime.now().plus({ days: 7 }).toISO(),
  },
  filter: filterExample,
  sort: sortExample,
})
```

### Name

The name of the resource in question.

### Identifiers

A list of all the resource's identifying properties (primary identifier + parent identifiers).

### Primary Identifier

The identifier belonging solely to the resource and not parents.

### Initial Fields

An initialized instance of your generic resource (no identifiers). This will be used as the initial state of a new resource being created.

---

## Conventions and Limitations

The automated nature of REST client generation that _R3G_ provides requires that you design your REST API in a highly standardized fashion.

### API Routes

For sake of simplicity and keeping things systematic and therefore convenient for the REST client generator to interpret, API routes are always identified by singular nouns rather than plurals, and follow a specific pattern. Essentially, only a sub-set of the REST pattern is supported.

**POST** (single) - `/api/parent/[pid]/child`

Requires request body to contain all fields of serialized generic resource object.

```typescript
// e.g. req.body
{
    title: 'Sample Title',
    description: 'Lorem ipsum dolor sit amet',
    expiryDate: DateTime.now().plus({ days: 7 }).toISO()
}
```

Returns composite identifier.

```typescript
// e.g. response.data
{
  key: 'abc'
}
```

**GET** (many) - `/api/parent/child?[query]`

Requires query string, which is the read params converted into URLSearchParams type.

Returns array of identified resource objects (composite identifier & serialized generic) in property named as the resource name suffixed with '_List_'.

```typescript
// e.g. response.data
{
    exampleList: [
        {
            title: 'Sample Title',
            description: 'Lorem ipsum dolor sit amet',
            expiryDate: '2021-04-23T22:07:43.796+00:00'
        },
        ...
    ]
}
```

**PUT** - (single) - `/api/parent/[pid]/child/[cid]`

**DELETE** - (single) - `/api/parent/[pid]/child/[cid]`
