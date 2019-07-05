import React, { Component } from 'react'
import styles from './exam-form.module.css'
import TextArea from 'antd/lib/input/TextArea'
import CodeEditorComponent from './code-editor'
import { questions, QuestionType } from './questions'
type QuestionTypes = 'default' | 'code'
export default class ExamFormComponent extends Component {
    title = 'Please Answer These Questions'
    questionTitlePrefix = 'Question'
    questionTitleSuffix = '？'
    questionPlaceHolder = 'Write your answer here'

    questions: QuestionType[]

    constructor(props) {
        super(props)
        this.questions = questions
}

    render() {
        return (
            <div>
                <h4>{this.title}:</h4>
                <ul>
                    {this.questions.map((question, index) => {
                        return (
                            <li key={index} className={styles.questionItem}>
                                <h6>
                                    {this.questionTitlePrefix + ' ' + (index + 1) + ': ' + question.question + this.questionTitleSuffix}
                                </h6>
                                {question.type === 'code' ? (
                                    <CodeEditorComponent code={question.code} />
                                ) : (
                                    <TextArea rows={6} placeholder={this.questionPlaceHolder} />
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
