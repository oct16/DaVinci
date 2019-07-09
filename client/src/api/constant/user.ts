import { HttpMethod, HttpOption } from '../../utils/rest'

export class UserAPIConstant {
    login = (name: string, password: string): HttpOption => ({
        url: '/user/login',
        method: HttpMethod.POST,
        data: { name, password }
    })

    logout = (): HttpOption => ({
        url: '/user/logout',
        method: HttpMethod.POST
    })

    users = (): HttpOption => ({
        url: '/user/all',
        method: HttpMethod.GET
    })

    createUser = (form: { name: string; password: string; role: string }): HttpOption => ({
        url: '/user',
        method: HttpMethod.POST,
        data: form
    })

    putUser(userId: number, data: any): HttpOption {
        return {
            url: `/user/${userId}`,
            method: HttpMethod.PUT,
            data
        }
    }

    getUser = (): HttpOption => ({
        url: '/user',
        method: HttpMethod.GET
    })
}
