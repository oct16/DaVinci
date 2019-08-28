import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '@/components/base/edit-table'
import { $Api } from '@api'
import { Button, Icon } from 'antd'
import ModalFormComponent, { FormField } from '@/components/base/modal-form'
export default class AdminSelectionComponent extends Component {
    dialogRef: any
    questions: any
    state = {
        source: {
            data: [],
            size: null,
            page: null,
            pages: null,
            total: null
        },
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
        return $Api.examService.questions().toPromise()
    }

    onRowUpdated(data: { row: any; key: number }, callback: Function) {
        const id = data.key
        $Api.examService.putSelection(id, data.row).subscribe(res => {
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
            $Api.examService.addSelection(questionId, values!.value).subscribe(res => {
                this.getSelections()
                form.resetFields()
                this.setState({ dialogVisible: false })
            })
        })
    }

    getSelections(page?: number) {
        $Api.examService.selections(page).subscribe(res => {
            const source = {
                ...res,
                data: res.data.map(item => {
                    return { ...item, question: item.question.question }
                })
            }
            this.setState({
                source
            })
        })
    }

    onPageChange(page: number): void {
        this.getSelections(page)
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end mb-2">
                    <Button onClick={this.addSelection.bind(this)}>
                        <Icon
                            style={{ float: 'left', height: '20px', lineHeight: '20px' }}
                            className="align-middle"
                            type="plus"
                        />
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
                <EditTableComponent
                    onPageChange={this.onPageChange.bind(this)}
                    pager={this.state.source}
                    columns={this.columns}
                    onRowUpdated={this.onRowUpdated}
                />
            </div>
        )
    }
}
