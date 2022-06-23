import {
  R3gCreateOperationResult,
  R3gDeleteOperationResult,
  R3gReadOperationResult,
  R3gUpdateOperationResult,
} from '../../types'

/*********************************/
/*******  Data Structures  *******/
/*********************************/

// Ambiguous Promise Resolver
export type R3gAmbiguousPromiseResolver<ResourceIdentifier, ResourceBody> =
  | R3gCreatePromiseResolver<ResourceIdentifier>
  | R3gReadPromiseResolver<ResourceIdentifier, ResourceBody>
  | R3gUpdatePromiseResolver
  | R3gDeletePromiseResolver

// Create Promise Resolver
export type R3gCreatePromiseResolver<ResourceIdentifier> = {
  requestKey: string
  resolve: (result: R3gCreateOperationResult<ResourceIdentifier>) => void
  reject: (reason: string) => void
}

// Read Promise Resolver
export type R3gReadPromiseResolver<ResourceIdentifier, ResourceBody> = {
  requestKey: string
  resolve: (
    result: R3gReadOperationResult<ResourceIdentifier, ResourceBody>
  ) => void
  reject: (reason: string) => void
}

// Update Promise Resolver
export type R3gUpdatePromiseResolver = {
  requestKey: string
  resolve: (result: R3gUpdateOperationResult) => void
  reject: (reason: string) => void
}

// Delete Promise Resolver
export type R3gDeletePromiseResolver = {
  requestKey: string
  resolve: (result: R3gDeleteOperationResult) => void
  reject: (reason: string) => void
}

// Request Promise Controller
export type R3gRequestPromiseController<ResourceIdentifier, ResourceBody> = {
  createPromiseResolverList: Array<R3gCreatePromiseResolver<ResourceIdentifier>>
  readPromiseResolverList: Array<
    R3gReadPromiseResolver<ResourceIdentifier, ResourceBody>
  >
  updatePromiseResolverList: Array<R3gUpdatePromiseResolver>
  deletePromiseResolverList: Array<R3gDeletePromiseResolver>
  putCreatePromiseResolver: (
    createPromiseResolver: R3gCreatePromiseResolver<ResourceIdentifier>
  ) => void
  removeCreatePromiseResolver: (requestKey: string) => void
  putReadPromiseResolver: (
    readPromiseResolver: R3gReadPromiseResolver<
      ResourceIdentifier,
      ResourceBody
    >
  ) => void
  removeReadPromiseResolver: (requestKey: string) => void
  putUpdatePromiseResolver: (
    updatePromiseResolver: R3gUpdatePromiseResolver
  ) => void
  removeUpdatePromiseResolver: (requestKey: string) => void
  putDeletePromiseResolver: (
    deletePromiseResolver: R3gDeletePromiseResolver
  ) => void
  removeDeletePromiseResolver: (requestKey: string) => void
}

/*********************************/
/************  Hook  *************/
/*********************************/

export type R3gRequestPromiseControllerHook = <
  ResourceIdentifier,
  ResourceBody
>() => R3gRequestPromiseController<ResourceIdentifier, ResourceBody>
