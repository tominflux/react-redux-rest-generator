/******************************/
/*********** CORE  ************/
/******************************/

export type RestPrimitive = string | number | boolean | null

export type RestReadParams = Record<string, RestPrimitive>

/******************************/
/************ API  ************/
/******************************/

export type RestMethod = 'get' | 'post' | 'put' | 'delete'

export type RestApiReadPayload<
  CompositeIdentifierType,
  AnonResourceType
> = Record<string, Array<CompositeIdentifierType & AnonResourceType>>

export type RestApiPayload<CompositeIdentifierType, AnonResourceType> = {
  compositeIdentifier?: CompositeIdentifierType
  resourceList?: Array<CompositeIdentifierType & AnonResourceType>
}
