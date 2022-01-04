import {
  RestCreatePromiseResolver,
  RestCreateResult,
  RestDeletePromiseResolver,
  RestDeleteResult,
  RestMethod,
  RestReadPromiseResolver,
  RestReadResult,
  RestResourceConfig,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../../types'
import { RestReduxCreatorSet } from '../../generateRestRedux/generateRestCreators/types'
import { RestReduxState } from '../../generateRestRedux/types'

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
  state: RestReduxState<CompositeIdentifierType, AnonResourceType>,
  dispatch: (action: { type: string; payload: unknown }) => void,
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  putCreatePromiseResolver: (
    resolver: RestCreatePromiseResolver<CompositeIdentifierType>
  ) => void,
  putReadPromiseResolver: (
    resolver: RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
  ) => void,
  putUpdatePromiseResolver: (resolver: RestUpdatePromiseResolver) => void,
  putDeletePromiseResolver: (resolver: RestDeletePromiseResolver) => void
) => RestInterface<CompositeIdentifierType, AnonResourceType, ReadParamsType>
