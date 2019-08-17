import React, { Component } from 'react'
import { Icon, Form } from 'antd'
import cn from 'classnames'
import s from './index.module.css'
import { FormComponentProps } from 'antd/lib/form'
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => {
        return fieldsError[field]
    })
}

class FlipBtnComponent extends Component<FormComponentProps<any> & { isLoading: boolean; onRegister: Function }> {
    componentDidMount() {
        const { form } = this.props
        form.validateFields()
    }
    state = {
        active: false
    }
    btnClickHandle() {
        this.setState({ active: true })
    }

    handleSubmit(e) {
        e.preventDefault()
        const { form } = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.props.onRegister(values.name)
        })
    }

    render() {
        const { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = this.props.form
        const status = (isFieldTouched('name') && getFieldError('name')) || ''

        return (
            <div className={cn(s['flip-btn-wrap'])}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Item validateStatus={status ? 'error' : ''} help={status} style={{ margin: 0 }}>
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '请输入你的姓名!' },
                                {
                                    pattern: /[\u4e00-\u9fa5]{2,4}/,
                                    message: '姓名为2-4个汉字!'
                                }
                            ],
                            initialValue: ''
                        })(
                            <div className={cn(s['flip-btn-box'])}>
                                <a
                                    href="javascript:void(0)"
                                    onClick={this.btnClickHandle.bind(this)}
                                    className={cn('flip-btn', this.state.active ? 'active' : '')}
                                >
                                    <span className="flip-text" />
                                    <span className="flip-front">
                                        <Icon
                                            style={{ verticalAlign: 'text-bottom', fontSize: '1rem', color: 'balck' }}
                                            type="arrow-right"
                                        />
                                    </span>
                                    <span className="flip-back">
                                        <input type="text" className="flip-input" placeholder="Your Name" />
                                        <button disabled={this.props.isLoading || hasErrors(getFieldsError())}>
                                            Start
                                        </button>
                                    </span>
                                </a>
                            </div>
                        )}
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Form.create<any>()(FlipBtnComponent)
