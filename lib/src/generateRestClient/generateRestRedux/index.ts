import generateRestActions from './generateRestActions'
import generateRestCreators from './generateRestCreators'
import generateRestReducer from './generateRestReducer'

const generateRestRedux = (resourceConfig: RestResourceConfig) => {
    const actions = generateRestActions(resourceConfig)
    const creators = generateRestCreators(actions)
    const reducer = generateRestReducer(actions, resourceConfig)

    return {
        actions,
        creators,
        reducer
    }
}

export default generateRestRedux
