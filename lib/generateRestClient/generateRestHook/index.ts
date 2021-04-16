import generateRestInterface from './generateRestInterface'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import flattenObjectArray from 'lib/utils/flattenObjectArray'

/*
<
    CompositeIdentifierType extends Record<string | number | symbol, unknown>,
    AnonResourceType extends Record<string | number | symbol, unknown>,
    ReadParamsType extends Record<string | number | symbol, unknown>
>
*/

const generateRestHook: (
    creators: RestReduxCreatorSet,
    resourceConfig: RestResourceConfig
) => RestHook = (creators, resourceConfig) => {
    const useRestResource: RestHook = (paramsList, readExplicitly) => {
        const stateName = resourceConfig.stateName ?? `${resourceConfig.name}State`
        const state = useSelector((state) => state[stateName])
        const dispatch = useDispatch()

        const _interface = generateRestInterface(
            state,
            dispatch,
            creators as RestReduxCreatorSet,
            resourceConfig
        )

        // Fetch specified
        useEffect(() => {
            if (!paramsList) return

            paramsList.forEach((params) => {
                const hasParams = Object.keys(params).length > 0
                if (!hasParams) return

                _interface.read(params)
            })
        }, [...flattenObjectArray(paramsList ?? []), state.invalidationIndex])

        // Fetch all
        useEffect(() => {
            if (!paramsList && !readExplicitly) _interface.read({})
        }, [readExplicitly, state.invalidationIndex])

        return _interface
    }

    return useRestResource
}

export default generateRestHook
