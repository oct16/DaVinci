import { from, Observable } from 'rxjs'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import interceptors from './interceptors'
import { ENV } from '../env.config'

enum ContentType {
    JSON = 'application/json;charset=UTF-8',
    FORM = 'application/x-www-form-urlencoded; charset=UTF-8'
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

const BASE_RUL = ENV.API_BASE_RUL

export interface HttpOption extends AxiosRequestConfig {}
export interface HttpResponse extends AxiosResponse<any> {}

export class RESTFul {
    request(option?: HttpOption): Observable<HttpResponse> {
        const defaultOption: HttpOption = {
            baseURL: BASE_RUL,
            method: HttpMethod.GET,
            headers: {
                'Content-Type': ContentType.JSON
            },
            withCredentials: true,
            timeout: 3e4
        }
        const opt = Object.assign(defaultOption, option)

        return from(axios(opt))
    }
}

export const setupInterceptors = interceptors.setupInterceptors
