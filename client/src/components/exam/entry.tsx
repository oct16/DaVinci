import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './entry.module.css'
import service from '../../api/service'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field])
}

class EntryComponent extends Component<any> {
    visible: boolean

    state = {
        visible: true
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields()
        const { history } = this.props

        service.examService.progress().subscribe(({inProgress, examId}) => {
            if (inProgress) {
                history.push(`/exam/${examId}`)
            }
        })
    }

    handleSubmit = (e: any) => {
        const { history } = this.props

        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            const { code, name } = values
            service.examService.register(name, code).subscribe(res => {
                const { exam } = res
                history.push(`/exam/${exam.id}`)
            })
        })
    }

    form = Form.create()(EntryComponent)

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
        // Only show error after a field is touched.
        const nameError = (isFieldTouched('name') && getFieldError('name')) || ''
        const codeError = (isFieldTouched('code') && getFieldError('code')) || ''
        return (
            <div className={styles.entry + ' d-flex align-items-center'}>
                <div className={styles.entryBox}>
                    <h3>{'Examination'.toUpperCase()}</h3>
                    <h3>{'You have limit times to finish this examination'.toUpperCase()}</h3>

                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError}>
                            {getFieldDecorator('name', {
                                initialValue: null,
                                rules: [
                                    { required: true, message: 'Please input your name!' },
                                    {
                                        pattern: new RegExp('^([\u4e00-\u9fa5·]{2,4})$'),
                                        message: 'Two to four Chinese characters!'
                                    }
                                ]
                            })(<Input style={{ width: '220px' }} prefix={<Icon type="user" />} placeholder="Your Name" />)}
                        </Form.Item>
                        <Form.Item validateStatus={codeError ? 'error' : ''} help={codeError}>
                            {getFieldDecorator('code', {
                                initialValue: null,
                                rules: [{ required: true, message: 'Please input your code!' }]
                            })(<Input style={{ width: '220px' }} prefix={<Icon type="code" />} placeholder="Exam Code" />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                                Start
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create()(withRouter(EntryComponent))
