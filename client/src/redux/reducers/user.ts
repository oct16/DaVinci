import ActionEnumTypes from '../actionTypes'

const initialState = {
    user: null
}

export default function(state = initialState, action): any {
    switch (action.type) {
        case ActionEnumTypes.USER_LOGIN: {
            const user = action.payload
            return {
                ...state,
                user: user || state.user
            }
        }
        case ActionEnumTypes.USER_LOGOUT: {
            return {
                ...state,
                user: null
            }
        }

        default:
            return state
    }
}
