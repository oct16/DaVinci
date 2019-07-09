import ActionEnumTypes from '../actionTypes'
import service from '../../api/service'
import history from '../../utils/history'

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
        service.userService.logout().subscribe(res => {
            history.push('/admin/login')
            dispatch({
                type: ActionEnumTypes.USER_LOGOUT
            })
        })
    }
}
