import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '@/components/base/edit-table'
import { $Api } from '@api'
import { Button, Icon } from 'antd'
import ModalFormComponent, { FormField } from '@/components/base/modal-form'

export default class AdminQuestionComponent extends Component {
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
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            editable: true
        },
        {
            title: 'QuestionCode',
            dataIndex: 'questionCode',
            key: 'questionCode',
            editable: true,
            type: 'textarea'
        },

        {
            title: 'Selects',
            dataIndex: 'selects',
            key: 'selects',
            type: 'selects'
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            editable: true,
            type: 'selects',
            selects: new Array(5).fill('').map((_, index) => index + 1 + '')
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
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
        }
    ]

    formFields: FormField[] = [
        {
            name: 'question',
            type: 'TEXT',
            rules: [{ required: true }]
        },
        {
            name: 'questionCode',
            type: 'TEXTAREA'
        },
        {
            name: 'difficulty',
            rules: [{ required: true }],
            type: 'SELECT',
            initialValue: '1',
            selects: new Array(5).fill('').map((_, index) => index + 1 + '')
        },
        {
            name: 'type',
            required: true,
            initialValue: 'TEXT',
            type: 'SELECT',
            selects: ['TEXT', 'INPUT', 'SELECT', 'MULTIPLE_SELECT', 'CODE']
        }
    ]

    onRowUpdated(data: { row: any; key: number }, callback: Function) {
        const id = data.key
        $Api.examService.putQuestion(id, data.row).subscribe(res => {
            callback(res)
        })
    }

    componentDidMount() {
        this.getQuestions()
    }

    getQuestions(): void {
        $Api.examService.questions().subscribe(res => {
            this.setState({
                dataSource: res.map(item => ({
                    ...item,
                    selects: ~item.type.indexOf('SELECT') ? item.selects && item.selects.map(s => s.value) : '-'
                }))
            })
        })
    }

    addQuestion() {
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

            $Api.examService.createQuestion(values).subscribe(res => {
                this.getQuestions()
                form.resetFields()
                this.setState({ dialogVisible: false })
            })
        })
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end mb-2">
                    <Button onClick={this.addQuestion.bind(this)}>
                        <Icon
                            style={{ float: 'left', height: '20px', lineHeight: '20px' }}
                            className="align-middle"
                            type="plus"
                        />
                        {'Question'}
                    </Button>
                </div>
                <ModalFormComponent
                    wrappedComponentRef={formRef => {
                        this.dialogRef = formRef
                    }}
                    title="Add Question"
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
