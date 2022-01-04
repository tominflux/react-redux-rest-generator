import {
  RestAmbiguousPromiseResolver,
  RestAmbiguousResult,
  RestCreatePromiseResolver,
  RestCreateResult,
  RestDeleteResult,
  RestReadPromiseResolver,
  RestReadResult,
  RestRequest,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../../../../types'
import { RestHookContext } from '../../../types'
import handleProcessCreateRequest from './handleProcessCreateRequest'
import handleProcessDeleteRequest from './handleProcessDeleteRequest'
import handleProcessReadRequest from './handleProcessReadRequest'
import handleProcessUpdateRequest from './handleProcessUpdateRequest'
import RestRequestSuccessEventHandler from './types'

const handleRequestSuccess: RestRequestSuccessEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  request: RestRequest,
  result: RestAmbiguousResult,
  resolver: RestAmbiguousPromiseResolver<
    CompositeIdentifierType,
    AnonResourceType
  >
) => {
  // Deconstruct context
  const { resourceConfig } = hookContext

  // Deconstruct request
  const { method } = request

  // Deconstruct result
  const { status, message, payload } = result

  switch (method) {
    // CREATE
    case 'post': {
      const result: RestCreateResult<CompositeIdentifierType> = {
        status,
        message,
        compositeIdentifier: payload as CompositeIdentifierType,
      }

      handleProcessCreateRequest<
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
      // Extract resource list from payload
      const listName =
        resourceConfig.apiPayloadResourceListName ??
        `${resourceConfig.name}List`
      const { [listName]: resourceList } = payload as Record<
        string,
        Array<CompositeIdentifierType & AnonResourceType>
      >

      // Compose read request result
      const result: RestReadResult<
        CompositeIdentifierType,
        AnonResourceType
      > = {
        status,
        message,
        resourceList,
      }

      handleProcessReadRequest<
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
    // UPDATE & DELETE
    case 'put': {
      const result: RestUpdateResult = {
        status,
        message,
      }

      handleProcessUpdateRequest<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(hookContext, request, result, resolver as RestUpdatePromiseResolver)

      break
    }
    case 'delete': {
      const result: RestDeleteResult = {
        status,
        message,
      }

      handleProcessDeleteRequest<
        CompositeIdentifierType,
        AnonResourceType,
        ReadParamsType
      >(hookContext, request, result, resolver as RestUpdatePromiseResolver)

      break
    }
  }
}

export default handleRequestSuccess
