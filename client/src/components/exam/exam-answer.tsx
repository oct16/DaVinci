import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import styles from './exam.module.css'
import { ExamService } from '../../api/service/exam'
import service from '../../api/service'
import ExamFormComponent from './exam-form'
import { QuestionType } from './questions'

class AdminExamAnswerComponent extends Component<any> {
    examService: ExamService

    formValue: { [key: number]: string }
    constructor(props) {
        super(props)

        this.examService = new ExamService()
    }

    state: {
        name: string
        questions: QuestionType[]
        examinee: { name: string }
        values: { [key: number]: any }
    } = {
        questions: [],
        name: '',
        examinee: { name: '' },
        values: []
    }

    componentDidMount(): void {
        this.getExam()
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
        const examineeId = this.props.match.params.examineeId

        service.examService.examineeAnswer(examineeId).subscribe(res => {
            const { exam, answers, examinee } = res

            const questions = answers.map(a => this.formatQuestion(a.question))
            const values = answers.reduce((pre, cur) => {
                pre[cur.question.id] = cur.value
                return pre
            }, {})
            this.setState({
                examinee,
                name: exam.name,
                questions,
                values
            })

        })
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
        const Examinee = () => <h5>Examinee: {this.state.examinee.name}</h5>

        return (
            <div className="container">
                <div className={styles.exam}>
                    <ExamTitle />
                    <div className="d-flex justify-content-between">
                        <Examinee />
                    </div>
                    <hr style={{ margin: 0, marginBottom: '3rem' }} />
                    <ExamFormComponent
                        onChange={this.onChangeHandle.bind(this)}
                        values={this.state.values}
                        questions={this.state.questions}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(AdminExamAnswerComponent)
