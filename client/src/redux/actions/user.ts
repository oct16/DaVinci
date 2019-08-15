import ActionEnumTypes from '../actionTypes'
import { $Api } from '@api'
import { history } from '@/utils/history'

export const userLogin = user => {
    return dispatch => {
        dispatch({
            type: ActionEnumTypes.USER_LOGIN,
            payload: user
        })
    }
}
export const userLogout = () => {
    return dispatch => {
        $Api.userService.logout().subscribe(res => {
            history.push('/admin/login')
            dispatch({
                type: ActionEnumTypes.USER_LOGOUT
            })
        })
    }
}
