import glob = require('glob')
import path = require('path')
import { ExamControllerMethods } from './exam-controller'
import { UserControllerMethods } from './user-controller';

export interface Controllers {
    exam: ExamControllerMethods
    user: UserControllerMethods
}

const controllers: Controllers = glob.sync(path.join(__dirname, '*-controller.ts')).reduce((pre: any, file: any) => {
    const r = require(path.resolve(file))
    file.match(/(\w+)-controller.ts/)
    const name = RegExp.$1
    if (name) {
        const control = (pre[name] = {})
        const instant = r.default
        Object.keys(instant).forEach(key => {
            control[key] = instant[key]
        })
    }
    return pre
}, {})

export default controllers
