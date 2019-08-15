import React, { Component } from 'react'
import styles from './exam-form.module.css'
import CodeEditorComponent from './code-editor'
import SelectEditorComponent from './select-editor'
import TextEditorComponent from './text-editor'
import { Form } from 'antd'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs'
class ExamFormComponent extends Component<Readonly<{ form: any; onChange: any; values: any; questions: any }>> {
    title = 'Please Answer These Questions'
    questionTitlePrefix = 'Question'

    state: { [key: number]: string } = {}

    componentDidMount(): void {
        const { form, onChange } = this.props
        const { getFieldsValue } = form
        onChange(getFieldsValue())
    }

    QuestionCaseComponent = ({ question }): JSX.Element => {
        const { getFieldDecorator } = this.props.form
        const { type, selects } = question

        switch (type) {
            case 'CODE':
                return getFieldDecorator(question.id.toString(), {
                    initialValue: this.getQuestionValue(question) || null
                })(<CodeEditorComponent question={question.question} />)
            case 'SELECT':
                return (
                    <div style={{ marginLeft: '90px' }}>
                        {getFieldDecorator(question.id.toString(), {
                            initialValue: this.getQuestionValue(question) || []
                        })(<SelectEditorComponent question={question.question} selects={selects} />)}
                    </div>
                )
            case 'MULTIPLE_SELECT':
                return (
                    <div style={{ marginLeft: '90px' }}>
                        {getFieldDecorator(question.id.toString(), {
                            initialValue: this.getQuestionValue(question) || []
                        })(<SelectEditorComponent question={question.question} selects={selects} multiple={true} />)}
                    </div>
                )
            default:
                return getFieldDecorator(question.id.toString(), {
                    initialValue: this.getQuestionValue(question) || ''
                })(<TextEditorComponent question={question.question} />)
        }
    }

    getQuestionValue(question: any): string | string[] {
        if (!this.props.values) {
            return null
        }
        const { id, type } = question
        const value = this.props.values[id]
        if (type === 'MULTIPLE_SELECT' || type === 'SELECT') {
            return Array.from(value.split('|'))
        }
        return this.props.values[id]
    }

    QuestionCode = ({ question }): JSX.Element => {
        const { questionCode } = question
        if (questionCode) {
            return (
                <div style={{ marginLeft: '82px' }}>
                    <SyntaxHighlighter language="javascript" style={vs}>
                        {questionCode}{' '}
                    </SyntaxHighlighter>{' '}
                </div>
            )
        }
        return <div />
    }

    ListItem = ({ index, question }): JSX.Element => {
        const title = this.questionTitlePrefix + ' ' + (index + 1) + ': ' + question.question
        return (
            <li className={styles.questionItem}>
                <h6>
                    {title.split('').map((text, idx) => (
                        <a key={idx}>
                            <b>
                                <span>{text}</span>
                            </b>
                        </a>
                    ))}
                </h6>
                <this.QuestionCode question={question} />
                <this.QuestionCaseComponent question={question} />
            </li>
        )
    }

    render(): JSX.Element {
        return (
            <div className={styles.container}>
                <form>
                    {/* <h4 style={{ marginBottom: '3rem' }}>{this.title}:</h4> */}
                    <ul>
                        {this.props.questions.map((question, index) => {
                            return <this.ListItem key={index} index={index} question={question} />
                        })}
                    </ul>
                </form>
            </div>
        )
    }
}

const wrappedExamFormComponent = Form.create<any>({
    onValuesChange(props, values, all) {
        props.onChange(all)
    }
})(ExamFormComponent)

export default wrappedExamFormComponent
