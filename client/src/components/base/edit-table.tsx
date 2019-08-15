import React, { Component } from 'react'
import { Table, Input, Select, InputNumber, Form } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { dateTimeFormat } from '@/utils/common'
import dayjs from 'dayjs'
import TextArea from 'antd/lib/input/TextArea'

export interface TableColumnProps extends ColumnProps<any> {
    editable?: boolean
    selects?: (string)[] | Function
    type?: 'number' | 'text' | 'selects' | 'textarea'
    multiple?: boolean
}

const { Option } = Select

const EditableContext = React.createContext(null)

class EditableCell extends Component<any, any> {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />
        }
        if (this.props.inputType === 'textarea') {
            return <TextArea />
        }
        if (this.props.inputType === 'selects') {
            return (
                <Select mode={this.props.multiple ? 'multiple' : 'default'} style={{ width: '100%' }}>
                    {this.props.selects.map((select, index) => (
                        <Option key={index} value={select}>
                            {select}
                        </Option>
                    ))}
                </Select>
            )
        }

        return <Input />
    }

    renderCell = ({ getFieldDecorator }) => {
        const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = this.props

        const formatChildren = (children: React.ReactNode) => {
            const childData = (children as any)[2]

            if (Array.isArray(childData)) {
                const _children = (children as any).slice()
                _children[2] = childData.join(', ')
                return _children
            }
            return children
        }

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`
                                }
                            ],
                            initialValue: record[dataIndex]
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                    formatChildren(children)
                )}
            </td>
        )
    }

    render() {
        return <EditableContext.Consumer>{(this as any).renderCell}</EditableContext.Consumer>
    }
}

class EditableTable extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = { columns: [], data: [], editingKey: '' }
    }

    componentDidMount() {}

    setColumns(columns) {
        this.setState({
            columns: [
                ...columns,
                this.props.noOperation
                    ? null
                    : {
                          title: 'Operation',
                          dataIndex: 'operation',
                          render: (text, record) => {
                              const editable = this.isEditing(record)
                              return editable ? (
                                  <span>
                                      <EditableContext.Consumer>
                                          {form => (
                                              <a
                                                  href="javascript:void(0);"
                                                  onClick={() => this.save(form, record.key)}
                                                  style={{ marginRight: 8 }}
                                              >
                                                  Save
                                              </a>
                                          )}
                                      </EditableContext.Consumer>
                                      <span onClick={() => this.cancel()}>
                                          <a>Cancel</a>
                                      </span>
                                  </span>
                              ) : (
                                  <a onClick={() => this.edit(record.key)}>Edit</a>
                              )
                          }
                      }
            ].filter(Boolean)
        })
    }

    componentWillReceiveProps(nextProps) {
        const arrayData = nextProps.data
        const data = arrayData.map(item => {
            const { createdAt, updatedAt } = item
            return {
                ...item,
                key: item.key || item.id,
                createdAt: dayjs(createdAt).format(dateTimeFormat),
                updatedAt: dayjs(updatedAt).format(dateTimeFormat)
            }
        })

        this.setState({ data })
        this.setColumns(nextProps.columns)
    }

    isEditing = record => record.key === this.state.editingKey

    cancel = () => {
        this.setState({ editingKey: '' })
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return
            }
            this.props.onRowUpdated(
                {
                    key,
                    row
                },
                () => {
                    const newData = [...this.state.data]
                    const index = newData.findIndex(item => key === item.key)
                    if (index > -1) {
                        const item = newData[index]
                        newData.splice(index, 1, {
                            ...item,
                            ...row
                        })
                        this.setState({ data: newData, editingKey: '' })
                    } else {
                        newData.push(row)
                        this.setState({ data: newData, editingKey: '' })
                    }
                }
            )
        })
    }

    edit(key) {
        this.setState({ editingKey: key })
    }

    render() {
        const components = {
            body: {
                cell: EditableCell
            }
        }

        const columns = this.state.columns.map(col => {
            if (!col.editable) {
                return col
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.type || 'text',
                    dataIndex: col.dataIndex,
                    multiple: col.multiple,
                    title: col.title,
                    editing: this.isEditing(record),
                    selects: col.selects
                })
            }
        })

        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components={components}
                    bordered={true}
                    dataSource={this.state.data}
                    columns={columns}
                    pagination={{
                        onChange: this.cancel
                    }}
                />
            </EditableContext.Provider>
        )
    }
}

export default Form.create<any>({})(EditableTable)
