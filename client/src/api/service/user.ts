import { BaseService } from './base-service'
import { Observable } from 'rxjs'
import { UserAPIConstant } from '../constant/user'

export class UserService extends BaseService {
    protected userConstant: UserAPIConstant
    constructor() {
        super()
        this.userConstant = new UserAPIConstant()
    }

    login(name: string, password: string): Observable<any> {
        return this.request(this.userConstant.login(name, password))
    }

    logout(): Observable<any> {
        return this.request(this.userConstant.logout())
    }

    users(): Observable<any> {
        return this.request(this.userConstant.users())
    }

    createUser(form: { name: string; password: string; role: string }): Observable<any> {
        return this.request(this.userConstant.createUser(form))
    }

    putUser(userId: number, data: any): Observable<any> {
        return this.request(this.userConstant.putUser(userId, data))
    }

    getUser(): Observable<any> {
        return this.request(this.userConstant.getUser())
    }
}
