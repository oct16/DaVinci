import { Store } from 'redux'
import { userLogin } from '../redux/actions/user'
import { $Api } from '@api'

export default function setInitialization(store: Store) {
    $Api.userService.getUser().subscribe(res => {
        if (res) {
            userLogin(res)(store.dispatch)
        }
    })
}
