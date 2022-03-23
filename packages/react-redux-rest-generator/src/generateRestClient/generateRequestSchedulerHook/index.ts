import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import generateUuid from '../../utils/generateUuid'
import handleDismount from './events/handleDismount'
import handleProcessRequest from './events/handleProcessRequest'
import { RestHookContext } from '../generateRestHook/types'
import { RestReduxState } from '../generateRestRedux/types'
import { RestReduxCreatorSet } from '../generateRestRedux/generateRestCreators/types'
import { RestResourceConfig } from '../types'

const generateRequestSchedulerHook = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  const useRequestScheduler = () => {
    // Redux
    const stateName = resourceConfig.stateName ?? `${resourceConfig.name}State`
    const state = useSelector<
      Record<string | number | symbol, unknown>,
      RestReduxState<CompositeIdentifierType, AnonResourceType>
    >(
      (state) =>
        state[stateName] as RestReduxState<
          CompositeIdentifierType,
          AnonResourceType
        >
    )
    const dispatch: Dispatch = useDispatch()

    // Effects
    // - Process request queue
    useEffect(() => {
      if (state.fetching) return
      if (state.requestKey !== null) {
        // console.error(error)
        throw new Error(
          `R3G - ${resourceConfig.name} - Not currently fetching but request key is not null.`
        )
      }

      handleProcessRequest(hookContext)
    }, [
      state.fetching,
      state.pendingRequests
        .map((request) => request.key)
        .reduce((accumulator, current) => `${accumulator}-${current}`, ''),
    ])
    // - Clean up on dismount
    useEffect(() => {
      return () => {
        handleDismount(hookContext)
      }
    }, [])
  }

  return useRequestScheduler
}

export default generateRequestSchedulerHook
