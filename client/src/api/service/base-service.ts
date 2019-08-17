import { HttpOption, RESTFul } from '@/utils/rest'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class BaseService {
    protected request: (opt: HttpOption) => Observable<any>
    protected RESTFul: RESTFul
    constructor() {
        this.request = (opt: HttpOption) => new RESTFul().request(opt).pipe(map(res => res.data))
    }
}
