import { RestResourceConfig } from '../../../../types'

export type RestSingleApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  compositeIdentifier: CompositeIdentifierType,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string
