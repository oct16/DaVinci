import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './entry.module.css'
import { $Api } from '@api'
import LampComponent from '@/components/lamp'
import { finalize } from 'rxjs/operators'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field])
}

class EntryComponent extends Component<any> {
    visible: boolean
    state = {
        isLoading: false,
        visible: true
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields()
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
            const { code, name } = values
            $Api.examService
                .register(name, code)
                .pipe(
                    finalize(() => {
                        setTimeout(() => {
                            this.setState({ isLoading: false })
                        }, 1000)
                    })
                )
                .subscribe(res => {
                    const { exam } = res
                    history.push(`/exam/${exam.id}`)
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
                <LampComponent />
                <div className={styles.entryBox}>
                    <h3>{'Enter Code'}</h3>

                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item
                            className={styles.formItem}
                            validateStatus={codeError ? 'error' : ''}
                            help={codeError}
                        >
                            {getFieldDecorator('code', {
                                initialValue: null,
                                rules: [{ required: true }]
                            })(
                                <div className={styles.inputContainer}>
                                    <input type="text" placeholder="Code" />
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
export default Form.create()(withRouter(EntryComponent))
