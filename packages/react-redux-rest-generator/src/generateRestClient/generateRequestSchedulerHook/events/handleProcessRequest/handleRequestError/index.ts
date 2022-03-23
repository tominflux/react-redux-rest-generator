import { RestRequest } from '../../../../generateRestRedux/types'
import {
  RestControllerHookContext,
  RestAmbiguousResult,
  RestAmbiguousPromiseResolver,
  RestCreateResult,
  RestCreatePromiseResolver,
  RestReadResult,
  RestReadPromiseResolver,
  RestUpdateResult,
  RestUpdatePromiseResolver,
  RestDeleteResult,
  RestDeletePromiseResolver,
} from '../../../types'
import handleProcessCreateError from './handleProcessCreateError'
import handleProcessDeleteError from './handleProcessDeleteError'
import handleProcessReadError from './handleProcessReadError'
import handleProcessUpdateError from './handleProcessUpdateError'
import RestRequestErrorEventHandler from './types'

const handleRequestError: RestRequestErrorEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  request: RestRequest,
  result: RestAmbiguousResult,
  resolver: RestAmbiguousPromiseResolver<
    CompositeIdentifierType,
    AnonResourceType
  >,
  axiosMessage: string
) => {
  // Deconstruct result
  const { status, message } = result

  // Deconstruct request
  const { method } = request

  // Log both axios error message and API error message
  console.error(axiosMessage)
  console.error(message)

  // Dispatch response action & resolve promise
  switch (method) {
    // CREATE
    case 'post': {
      const result: RestCreateResult<CompositeIdentifierType> = {
        status,
        message,
        compositeIdentifier: null,
      }

      handleProcessCreateError<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(
        hookContext,
        request,
        result,
        resolver as RestCreatePromiseResolver<CompositeIdentifierType>
      )

      break
    }
    // READ
    case 'get': {
      const result: RestReadResult<
        CompositeIdentifierType,
        AnonResourceType
      > = {
        status,
        message,
        resourceList: [],
      }

      handleProcessReadError<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(
        hookContext,
        request,
        result,
        resolver as RestReadPromiseResolver<
          CompositeIdentifierType,
          AnonResourceType
        >
      )

      break
    }
    // UPDATE
    case 'put': {
      const result: RestUpdateResult = {
        status,
        message,
      }

      handleProcessUpdateError<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(hookContext, request, result, resolver as RestUpdatePromiseResolver)

      break
    }
    // DELETE
    case 'delete': {
      const result: RestDeleteResult = {
        status,
        message,
      }

      handleProcessDeleteError<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(hookContext, request, result, resolver as RestDeletePromiseResolver)

      break
    }
  }
}

export default handleRequestError
