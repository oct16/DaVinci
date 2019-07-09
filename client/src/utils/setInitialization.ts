import { Store } from 'redux'
import { userLogin } from '../redux/actions/user'
import service from '../api/service'

export default function setInitialization(store: Store) {
    service.userService.getUser().subscribe(res => {
        if (res) {
            userLogin(res)(store.dispatch)
        }
    })
}
