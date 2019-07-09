import { ExamService } from './exam'
import { UserService } from './user'

class Service {
    examService: ExamService
    userService: UserService
    constructor() {
        this.examService = new ExamService()
        this.userService = new UserService()
    }
}

export default new Service()
