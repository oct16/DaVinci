import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '../../../base/edit-table'
import service from '../../../../api/service'
import { Button, Icon } from 'antd'
import ModalFormComponent, { FormField } from '../../../base/modal-form'
export default class AdminSelectionComponent extends Component {
    dialogRef: any
    questions: any
    state = {
        dataSource: [],
        dialogVisible: false,
        formFields: []
    }

    columns: TableColumnProps[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Question Id',
            dataIndex: 'questionId',
            key: 'questionId',
            editable: true
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            editable: true
        },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question'
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

    async componentDidMount() {
        this.getSelections()
        this.getFields()
    }
    async getFields() {
        const questions = (this.questions = await this.getQuestions())
        const formFields: FormField[] = [
            {
                name: 'question',
                required: true,
                type: 'SELECT',
                selects: questions.map(q => q.question)
            },
            {
                name: 'value',
                rules: [{ required: true }]
            }
        ]
        this.setState({
            formFields
        })
    }

    getQuestions(): Promise<any> {
        return service.examService.questions().toPromise()
    }

    onRowUpdated(data: { row: any; key: number }, callback: Function) {
        const id = data.key
        service.examService.putSelection(id, data.row).subscribe(res => {
            callback(res)
        })
    }

    addSelection() {
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

            const questionId = this.questions.find(q => q.question === values.question)!.id
            service.examService.addSelection(questionId, values!.value).subscribe(res => {
                this.getSelections()
                form.resetFields()
                this.setState({ dialogVisible: false })
            })
        })
    }

    getSelections() {
        service.examService.selections().subscribe(res => {
            this.setState({
                dataSource: res.map(item => {
                    return { ...item, question: item.question.question }
                })
            })
        })
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end mb-2">
                    <Button onClick={this.addSelection.bind(this)}>
                        <Icon style={{ float: 'left', height: '20px', lineHeight: '20px' }} className="align-middle" type="plus" />
                        {'Selection'}
                    </Button>
                    <ModalFormComponent
                        wrappedComponentRef={formRef => {
                            this.dialogRef = formRef
                        }}
                        title="Add Selection"
                        visible={this.state.dialogVisible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        fields={this.state.formFields}
                    />
                </div>
                <EditTableComponent data={this.state.dataSource} columns={this.columns} onRowUpdated={this.onRowUpdated} />
            </div>
        )
    }
}
