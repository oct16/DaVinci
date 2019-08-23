import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import styles from './exam.module.css'
import { TimeDown } from '../time-down'
import { Modal } from 'antd'
import { $Api } from '@api'
import ExamFormComponent from './exam-form'
import { QuestionType } from './questions'

class AdminExamPreviewComponent extends Component<any> {
    formValue: { [key: number]: string }
    constructor(props) {
        super(props)
        this.onTimeEnd = this.onTimeEnd.bind(this)
    }

    state: {
        name: string
        questions: QuestionType[]
        remainTime: number
        examinee: { name: string }
    } = {
        questions: [],
        name: '',
        examinee: { name: '' },
        remainTime: null
    }

    componentDidMount(): void {
        this.getExam()
    }

    onTimeEnd() {
        this.alertInfo()
    }

    async alertInfo() {
        Modal.warning({
            title: 'time end'.toUpperCase(),
            content: 'Your answer has been automatically submitted',
            onOk: () => {
                this.redirectHome()
            }
        })
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

        $Api.examService.examPreview(examId).subscribe(
            res => {
                const { exam } = res
                const { name, questions } = exam
                const expireTime = Number(new Date()) + Number(exam.time)
                const now = Number(new Date())
                const remainTime = expireTime - now

                if (remainTime <= 0) {
                    this.alertInfo()
                    return
                }

                this.setState({
                    examinee: 'Preview Mode',
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
                <div className={styles.exam}>
                    <ExamTitle />
                    <div className="d-flex justify-content-between">
                        <Examinee />
                        <TimeDown remainTime={this.state.remainTime} auto={false} onTimeEnd={this.onTimeEnd} />
                    </div>
                    <hr style={{ margin: 0, marginBottom: '3rem' }} />
                    <ExamFormComponent onChange={this.onChangeHandle.bind(this)} questions={this.state.questions} />
                </div>
            </div>
        )
    }
}

export default withRouter(AdminExamPreviewComponent)
