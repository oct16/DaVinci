import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './entry.module.css'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field])
}

class EntryComponent extends Component<any> {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields()
    }

    handleSubmit = e => {
        const { history } = this.props

        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            history.push('/exam')
        })
    }

    form = Form.create()(EntryComponent)

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
        // Only show error after a field is touched.
        const nameError = (isFieldTouched('name') && getFieldError('name')) || ''
        const codeError = (isFieldTouched('code') && getFieldError('code')) || ''
        return (
            <div className={styles.entry}>
                <h3>{'Examination'.toUpperCase()}</h3>
                <h3>{'You have 60 minutes to finish this examination'.toUpperCase()}</h3>

                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError}>
                        {getFieldDecorator('name', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Please input your name!' }]
                        })(<Input prefix={<Icon type="user" />} placeholder="Your Name" />)}
                    </Form.Item>
                    <Form.Item validateStatus={codeError ? 'error' : ''} help={codeError}>
                        {getFieldDecorator('code', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Please input your code!' }]
                        })(<Input prefix={<Icon type="code" />} placeholder="code" />)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            start
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default Form.create()(withRouter(EntryComponent))
