import React, { Component } from 'react'
import { Form, Icon } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './entry.module.css'
import { $Api } from '@api'
import { finalize } from 'rxjs/operators'
import { FormComponentProps } from 'antd/lib/form'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field])
}

class EntryComponent extends Component<any> {
    // class EntryComponent extends Component<FormComponentProps<any> & RouteComponentProps<any>> {
    visible: boolean
    state = {
        isLoading: false,
        visible: true
    }
    _isMounted = true

    constructor(props) {
        super(props)
        this.getProgress()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true

        // To disabled submit button at the beginning.
        this.props.form.validateFields()
    }

    getProgress() {
        const { history } = this.props
        $Api.examService.progress().subscribe(({ inProgress, examId }) => {
            if (inProgress) {
                history.push(`/exam/${examId}`)
            }
        })
    }

    handleSubmit = (e: any) => {
        const { history } = this.props
        e.preventDefault()
        this.setState({ isLoading: true })

        this.props.form.validateFields((err, values) => {
            const { code } = values
            const CODE = (code as String).toUpperCase()
            $Api.examService
                .validToken(CODE)
                .pipe(
                    finalize(() => {
                        setTimeout(() => {
                            this._isMounted && this.setState({ isLoading: false })
                        }, 1000)
                    })
                )
                .subscribe(res => {
                    const { examId } = res
                    history.push(`/exam/intro/${examId}?code=${CODE}`)
                })
        })
    }

    form = Form.create()(EntryComponent)

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
        // Only show error after a field is touched.
        const codeError = (isFieldTouched('code') && getFieldError('code')) || ''
        return (
            <div className="d-flex align-items-center justify-content-center h-100">
                <div className={styles.entryBox}>
                    <h3>{'Enter Exam Code'}</h3>

                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item
                            className={styles.formItem}
                            validateStatus={codeError ? 'error' : ''}
                            help={codeError}
                        >
                            {getFieldDecorator('code', {
                                initialValue: null,
                                rules: [
                                    { required: true, message: '请输入代码！' },
                                    { pattern: /^[0-9a-zA-Z]{4}$/, message: '请输入正确的代码，长度为4位！' }
                                ]
                            })(
                                <div className={styles.inputContainer}>
                                    <input type="text" placeholder="Your Code" />
                                    <button disabled={this.state.isLoading || hasErrors(getFieldsError())}>
                                        <Icon type="arrow-right" />
                                    </button>
                                </div>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create<any>()(withRouter(EntryComponent))
