import { RestResourceConfig } from '../../../../types'

export type RestSingleAnonApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  parentsIdentifier: Record<string, string>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string
