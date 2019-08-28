import React, { Component } from 'react'
import { Table, Input, Select, InputNumber, Form, Pagination } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { dateTimeFormat } from '@/utils/common'
import dayjs from 'dayjs'
import TextArea from 'antd/lib/input/TextArea'
import { FormComponentProps } from 'antd/lib/form'
import { Pager } from '@/api/model/basics'

interface TableFormProps<T = any> extends FormComponentProps<any> {
    data?: T
    pager?: Pager<T>
    columns?: any
    noOperation?: boolean
    onPageChange?: (page: number) => void
    onRowUpdated: ({ key, row }, callback: () => void) => void
}

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
                                // {
                                //     required: true,
                                //     message: `Please Input ${title}!`
                                // }
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

    render(): JSX.Element {
        return <EditableContext.Consumer>{(this as any).renderCell}</EditableContext.Consumer>
    }
}

class EditableTable extends Component<TableFormProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            pager: null,
            data: [],
            columns: [] as TableColumnProps,
            editingKey: ''
        }
    }

    setColumns(columns): void {
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
            ]
                .filter(Boolean)
                .map(col => {
                    if (!col.render) {
                        col.render = val => {
                            return val ? val : '-'
                        }
                    }
                    return col
                })
        })
    }

    componentWillReceiveProps(nextProps): void {
        let arrayData
        let pager: Pager<any>
        if (nextProps.pager as Pager<any>) {
            arrayData = nextProps.pager.data
            pager = { ...nextProps.pager }
            delete pager.data
            this.setState({ isLoading: false })
        } else {
            arrayData = nextProps.data
        }
        const data = arrayData.map(item => {
            const { createdAt, updatedAt } = item
            return {
                ...item,
                key: item.key || item.id,
                createdAt: dayjs(createdAt).format(dateTimeFormat),
                updatedAt: dayjs(updatedAt).format(dateTimeFormat)
            }
        })

        this.setState({ data, pager })
        this.setColumns(nextProps.columns)
    }

    isEditing: (...arg) => boolean = record => record.key === this.state.editingKey

    cancel = (): void => {
        this.setState({ editingKey: '' })
    }
    onChange(page: number): void {
        this.setState({
            isLoading: true
        })

        this.props.onPageChange && !this.state.isLoading && this.props.onPageChange(page)
    }
    save(form, key): void {
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

    edit(key): void {
        this.setState({ editingKey: key })
    }

    render(): JSX.Element {
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
                    loading={this.state.isLoading}
                    components={components}
                    bordered={true}
                    dataSource={this.state.data}
                    columns={columns}
                    pagination={false}
                />
                {this.state.pager ? (
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="mt-3"
                            onChange={this.onChange.bind(this)}
                            current={this.state.pager.page}
                            pageSize={this.state.pager.size}
                            total={this.state.pager.total}
                        />
                    </div>
                ) : (
                    ''
                )}
            </EditableContext.Provider>
        )
    }
}

export default Form.create<TableFormProps>({})(EditableTable)
