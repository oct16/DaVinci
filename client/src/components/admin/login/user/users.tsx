import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '@/components/base/edit-table'
import { $Api } from '@api'
import { dateTimeFormat } from '@/utils/common'
import dayjs from 'dayjs'
import { Button, Icon } from 'antd'
import ModalFormComponent, { FormField } from '@/components/base/modal-form'

export default class AdminUserComponent extends Component {
    dialogRef: any
    constructor(props) {
        super(props)
        this.dialogRef = React.createRef<any>()
    }
    state = {
        dataSource: [],
        dialogVisible: false
    }

    columns: TableColumnProps[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 200,
            editable: true,
            type: 'selects',
            selects: ['ADMIN', 'SUPER_ADMIN']
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt'
        },
        {
            title: 'Last Login Time',
            dataIndex: 'lastLoginAt',
            key: 'lastLoginAt'
        }
    ]

    formFields: FormField[] = [
        {
            name: 'name',
            required: true
        },
        {
            name: 'password',
            required: true
        },
        {
            name: 'role',
            initialValue: 'ADMIN',
            type: 'SELECT',
            selects: ['ADMIN', 'SUPER_ADMIN'],
            required: true
        }
    ]

    onRowUpdated(data: { row: any; key: number }, callback: Function) {
        const userId = data.key
        $Api.userService.putUser(userId, data.row).subscribe(res => {
            callback(res)
        })
    }

    componentDidMount() {
        this.getUsers()
    }

    getUsers(): void {
        $Api.userService.users().subscribe(res => {
            this.setState({
                dataSource: res.map(item => {
                    const { lastLoginAt } = item
                    return {
                        ...item,
                        lastLoginAt: dayjs(lastLoginAt).format(dateTimeFormat)
                    }
                })
            })
        })
    }

    addUser(): void {
        this.setState({ dialogVisible: true })
        const { form } = this.dialogRef.props
        form.validateFields()
    }

    handleCancel = () => {
        this.setState({ dialogVisible: false })
    }

    handleCreate = () => {
        const { form } = this.dialogRef.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }

            $Api.userService.createUser(values).subscribe(res => {
                this.getUsers()
                form.resetFields()
                this.setState({ dialogVisible: false })
            })
        })
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end mb-2">
                    <Button onClick={this.addUser.bind(this)}>
                        <Icon
                            style={{ float: 'left', height: '20px', lineHeight: '20px' }}
                            className="align-middle"
                            type="plus"
                        />
                        {'User'}
                    </Button>
                </div>
                <ModalFormComponent
                    wrappedComponentRef={formRef => {
                        this.dialogRef = formRef
                    }}
                    title="Add User"
                    visible={this.state.dialogVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    fields={this.formFields}
                />
                <EditTableComponent
                    data={this.state.dataSource}
                    columns={this.columns}
                    onRowUpdated={this.onRowUpdated}
                />
            </div>
        )
    }
}
