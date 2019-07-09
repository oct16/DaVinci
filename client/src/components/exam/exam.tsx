import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import styles from './exam.module.css'
import { TimeDown } from '../time-down'
import { Modal } from 'antd'
import ExamConfirmComponent from './exam-confirm'
import service from '../../api/service'
import ExamFormComponent from './exam-form'
import { QuestionType } from './questions'
import { ExamService } from '../../api/service/exam'

class ExamComponent extends Component<any> {
    TimeDownComponentRef: TimeDown
    examService: ExamService

    formValue: { [key: number]: string }
    constructor(props) {
        super(props)
        this.onTimeEnd = this.onTimeEnd.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.examService = new ExamService()
    }

    state: {
        name: string
        questions: QuestionType[]
        remainTime: number
        examinee: { name: string }
        blocker: boolean
    } = {
        questions: [],
        name: '',
        examinee: { name: '' },
        remainTime: null,
        blocker: false
    }

    componentDidMount(): void {
        this.getExam()
    }

    onTimeEnd() {
        this.alertInfo()
    }

    async alertInfo() {
        await this.doSubmit()
        Modal.warning({
            title: 'time end'.toUpperCase(),
            content: 'Your answer has been automatically submitted',
            onOk: () => {
                this.redirectHome()
            }
        })
    }

    async onSubmit() {
        await this.doSubmit()
        Modal.success({
            title: 'submitted'.toUpperCase(),
            onOk: () => {
                this.redirectHome()
            }
        })
    }

    doSubmit() {
        return service.examService.answer(this.formValue).toPromise()
    }

    formatQuestion(question: any): any {
        return {
            id: question.id,
            type: question.type,
            question: question.question,
            selects: question.selects.map(select => select.value),
            code: question.code,
            questionCode: question.questionCode
        }
    }

    getExam(): void {
        const examId = this.props.match.params.examId

        service.examService.getExam(examId).subscribe(
            res => {
                const { exam, token } = res
                const { name, questions } = exam
                const expireTime = Number(new Date(token.updatedAt)) + Number(exam.time)
                const now = Number(new Date())
                const remainTime = expireTime - now

                if (remainTime <= 0) {
                    this.alertInfo()
                    return
                }

                this.setState({
                    examinee: token.examinee.name,
                    name,
                    questions: questions.map(this.formatQuestion),
                    remainTime
                })
            },
            err => {
                this.redirectHome()
            }
        )
    }

    redirectHome() {
        const { history } = this.props
        history.push('/')
    }
    onChangeHandle(formValue: { [key: number]: string }) {
        this.formValue = formValue
    }
    render() {
        const ExamTitle = () => <h3 className={styles.title}>{this.state.name}</h3>
        const Examinee = () => <h5>Examinee: {this.state.examinee}</h5>
        if (!this.state.remainTime) {
            return ''
        }

        return (
            <div className="container">
                {this.state.blocker ? <div className={styles.blocker} /> : ''}
                <div className={styles.exam}>
                    <ExamTitle />
                    <div className="d-flex justify-content-between">
                        <Examinee />
                        <TimeDown
                            remainTime={this.state.remainTime}
                            onTimeEnd={this.onTimeEnd}
                            onRef={ref => (this.TimeDownComponentRef = ref)}
                        />
                    </div>
                    <hr style={{ margin: 0, marginBottom: '3rem' }} />
                    <ExamFormComponent onChange={this.onChangeHandle.bind(this)} questions={this.state.questions} />
                    <ExamConfirmComponent onClick={this.onSubmit} />
                </div>
            </div>
        )
    }
}

export default withRouter(ExamComponent)
