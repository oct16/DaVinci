import axios from 'axios'
import _ from 'lodash'
import { notification } from 'antd'
import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes'
import history from './history'

const debounceNotification = _.debounce(errNoticeHandle, 300)

function errNoticeHandle(errorMessage: any) {
    return notification.error({
        message: errorMessage,
        description: '',
        style: {
            width: 400
        }
    })
}

export default {
    setupInterceptors: store => {
        axios.interceptors.response.use(
            response => response,
            error => {
                const resp = error.response
                if (!resp) {
                    return Promise.reject(error)
                }
                if (resp.status === UNAUTHORIZED) {
                    // store.dispatch(userLogout)
                    history.push('/admin/login')
                }

                if (resp.status === FORBIDDEN) {
                    // console.log(history)
                    // history.push('/admin/login')
                }

                if (resp) {
                    if (resp.data && resp.data.message) {
                        debounceNotification(resp.data.message)
                        return Promise.reject(resp.data)
                    } else if (error instanceof Error) {
                        debounceNotification(error.message)
                        return Promise.reject({ message: error.message })
                    }
                }

                // return Promise.reject({ message: error })
            }
        )
    }
}
