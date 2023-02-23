# react-redux-rest-generator (R3G)

## Summary

R3G is a library for React-Redux applications that facilitates declarative configuration of REST API consumers.


## Client

Each R3G client is configured on a 'per-resource' basis and provides all the necessary elements for integration with React and Redux.

```ts
type MyResourceIdentifier = {
  myParentResourceId: string
  myResourceId: string
}
type MyResourceBody = {
  name: string
}
type MyResourceParams = {
  matchMyResourceId: string
  matchName: string
  sortByNameAsc: boolean
  sortByNameDec: Boolean
}

const MyResourceClient = R3gClientFunctions.getClient<
  MyResourceIdentifier,
  MyResourceBody,
  MyResourceParams
>({
  name: 'my-resource',
  identifiers: ['myParentResourceId', 'myResourceId'],
  primaryIdentifier: 'myResourceId',
  initialFields: {
    name: 'Lorem Ipsum'
  },
  filter: (
    myResourceInstance: MyResourceIdentifier & MyResourceBody,
    params: Partial<MyResourceParams>,
    index: number
  ) => {
    // Filter Logic Goes Here
  }
  sort: (
    myResourceInstanceA: MyResourceIdentifier & MyResourceBody,
    myResourceInstanceA: MyResourceIdentifier & MyResourceBody,
    params: Partial<MyResourceParams>,
  ) => {
    // Sort Logic Goes Here
  }
  postProcess: (
    resourceList: Array<MyResourceIdentifier & MyResourceBody>,
    params: Partial<MyResourceParams>
  ) => {
    // Post Process Logic Goes Here
  }
})
```

### Scheduler Hook

The scheduler hook is responsible for queuing and executing API requests regarding its corresponding reosurce.

The presence of a single scheduler hook for each of your resources is required somewhere in your app at all times, and inside of the ReduxProvider.

Good practice is to group every scheduler hook for all of your resources into a single component/hook.

### Controller Hook

The controller hook provides means for your components to:
- Make CRUD requests
- Retrieve cached resource instances



Goto /packages/react-redux-rest-generator/README.md for full library documentation.
