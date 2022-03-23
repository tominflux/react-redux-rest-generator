import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import handleProcessRequest from './events/handleProcessRequest'
import { RestReduxState } from '../generateRestRedux/types'
import { RestReduxCreatorSet } from '../generateRestRedux/generateRestCreators/types'
import { RestResourceConfig } from '../types'
import {
  RestSchedulerHook,
  RestSchedulerHookContext,
  RestSchedulerHookGenerator,
} from './types'

const generateRequestSchedulerHook: RestSchedulerHookGenerator = <
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
  const useRequestScheduler: RestSchedulerHook = () => {
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

    // Construct scheduler hook context
    const schedulerHookContext: RestSchedulerHookContext<
      CompositeIdentifierType,
      AnonResourceType,
      ReadParamsType
    > = {
      resourceConfig,
      state,
      creators,
      dispatch,
    }

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

      handleProcessRequest(schedulerHookContext)
    }, [
      state.fetching,
      state.pendingRequests
        .map((request) => request.requestKey)
        .reduce((accumulator, current) => `${accumulator}-${current}`, ''),
    ])
    // - Clean up on dismount
    useEffect(() => {
      return () => {
        // TODO: Add all queued requests to abandoned request queue
      }
    }, [])
  }

  return useRequestScheduler
}

export default generateRequestSchedulerHook
