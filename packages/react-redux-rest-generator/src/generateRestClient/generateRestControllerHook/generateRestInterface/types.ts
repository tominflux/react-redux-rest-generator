import { RestMethod } from '../../../types'
import {
  RestControllerHookContext,
  RestCreateResult,
  RestDeleteResult,
  RestReadResult,
  RestUpdateResult,
} from '../../generateRestControllerHook/types'

export type RestInterface<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  // API
  fetching: boolean
  method: RestMethod | null
  status: number | null
  message: string | null
  clearResponse: () => void
  // CRUD
  create: (
    parentsIdentifier?: Record<string, string>
  ) => Promise<RestCreateResult<CompositeIdentifierType>>
  read: (
    params: ReadParamsType
  ) => Promise<RestReadResult<CompositeIdentifierType, AnonResourceType>>
  update: (
    compositeIdentifier: CompositeIdentifierType,
    overrideData?: AnonResourceType
  ) => Promise<RestUpdateResult>
  delete: (
    compositeIdentifier: CompositeIdentifierType
  ) => Promise<RestDeleteResult>
  // Form
  getField: (name: keyof AnonResourceType) => unknown
  setField: (name: keyof AnonResourceType, value: unknown) => void
  clearFields: () => void
  // Cache
  getMany: (
    params?: ReadParamsType
  ) => Array<CompositeIdentifierType & AnonResourceType>
  getOne: (
    compositeIdentifier: CompositeIdentifierType
  ) => (CompositeIdentifierType & AnonResourceType) | null
  invalidate: () => void
}

export type RestInterfaceGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestInterface<CompositeIdentifierType, AnonResourceType, ReadParamsType>
