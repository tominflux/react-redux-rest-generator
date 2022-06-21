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
export type R3gAmbiguousPromiseResolver<
  CompositeIdentifierType,
  AnonResourceType
> =
  | R3gCreatePromiseResolver<CompositeIdentifierType>
  | R3gReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  | R3gUpdatePromiseResolver
  | R3gDeletePromiseResolver

// Create Promise Resolver
export type R3gCreatePromiseResolver<CompositeIdentifierType> = {
  requestKey: string
  resolve: (result: R3gCreateOperationResult<CompositeIdentifierType>) => void
  reject: (reason: string) => void
}

// Read Promise Resolver
export type R3gReadPromiseResolver<
  CompositeIdentifierType,
  AnonResourceType
> = {
  requestKey: string
  resolve: (
    result: R3gReadOperationResult<CompositeIdentifierType, AnonResourceType>
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
export type R3gRequestPromiseController<
  CompositeIdentifierType,
  AnonResourceType
> = {
  createPromiseResolverList: Array<
    R3gCreatePromiseResolver<CompositeIdentifierType>
  >
  readPromiseResolverList: Array<
    R3gReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  >
  updatePromiseResolverList: Array<R3gUpdatePromiseResolver>
  deletePromiseResolverList: Array<R3gDeletePromiseResolver>
  putCreatePromiseResolver: (
    createPromiseResolver: R3gCreatePromiseResolver<CompositeIdentifierType>
  ) => void
  removeCreatePromiseResolver: (requestKey: string) => void
  putReadPromiseResolver: (
    readPromiseResolver: R3gReadPromiseResolver<
      CompositeIdentifierType,
      AnonResourceType
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
  CompositeIdentifierType,
  AnonResourceType
>() => R3gRequestPromiseController<CompositeIdentifierType, AnonResourceType>
