import React, { Component } from 'react'
import { Form, Modal, Input, Select, Button } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => {
        return fieldsError[field]
    })
}

export interface FormModel {
    title: string
    visible: boolean
    onCancel: () => void
    onCreate: () => void
    form?: any
    fields: FormField[]
}

type FormFieldType = 'TEXT' | 'SELECT' | 'TEXTAREA' | 'CODE'
type requireType = { [key: string]: FormFieldType }
export interface FormField {
    name: string
    initialValue?: string | string[]
    required?: boolean
    type?: FormFieldType
    selects?: string[]
    multiple?: boolean
    rules?: Rule[]
    // requireBy?: { [key: string]: string }
}

interface Rule {
    required?: boolean
}

class ModalFormComponent extends Component<any, any> {
    state = {
        visible: false
    }

    render() {
        const { title, visible, onCancel, onCreate, form, fields } = this.props
        const { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = form
        const { Option } = Select

        const FieldInput = (fieldItem: FormField) => {
            const { type, selects, multiple } = fieldItem

            if (type === 'SELECT') {
                return (
                    <Select filterOption={false} mode={multiple ? 'multiple' : 'default'} style={{ width: '100%' }}>
                        {selects!.map((select, index) => {
                            return (
                                <Option key={index} value={select}>
                                    {select}
                                </Option>
                            )
                        })}
                    </Select>
                )
            } else if (type === 'TEXTAREA') {
                return <TextArea />
            }
            return <Input />
        }

        return (
            <Modal
                title={title}
                visible={visible}
                onOk={onCreate}
                onCancel={onCancel}
                okText="确认"
                cancelText="取消"
                footer={[
                    <Button key="back" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" disabled={hasErrors(getFieldsError())} onClick={onCreate}>
                        Submit
                    </Button>
                ]}
            >
                <Form>
                    {fields.map((fieldItem: FormField, index) => {
                        const status = (isFieldTouched(fieldItem.name) && getFieldError(fieldItem.name)) || ''
                        const requireRule = [
                            {
                                required: true,
                                message: `Please input your ${fieldItem.name}!`
                            }
                        ]
                        let rules: any[] = [
                            // {
                            //     type: 'string',
                            //     message: `The input is not valid ${fieldItem.name}`
                            // }
                        ]
                        if (fieldItem.required) {
                            rules = rules.concat(requireRule)
                        }
                        if (fieldItem.rules && fieldItem.rules.length) {
                            fieldItem.rules.forEach(rule => {
                                if (rule.required && !fieldItem.required) {
                                    rules = rules.concat(requireRule)
                                }
                            })
                        }

                        // const requireBy = fieldItem.requireBy
                        // if (requireBy) {
                        //     Object.keys(requireBy).forEach(key => {
                        //         const val = requireBy[key]
                        //         console.log(val)
                        //     })
                        // }
                        return (
                            <Form.Item
                                key={index + fieldItem.name}
                                validateStatus={status ? 'error' : ''}
                                help={status}
                                style={{ margin: 0 }}
                                label={fieldItem.name}
                            >
                                {getFieldDecorator(fieldItem.name, {
                                    rules,
                                    initialValue: fieldItem.initialValue || null
                                })(FieldInput(fieldItem))}
                            </Form.Item>
                        )
                    })}
                </Form>
            </Modal>
        )
    }
}

export default Form.create<any>()(ModalFormComponent)
