import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '@/components/base/edit-table'
import { $Api } from '@api'
import { tap } from 'rxjs/operators'
import { Button, Icon } from 'antd'
import ModalFormComponent, { FormField } from '@/components/base/modal-form'
import { history } from '@/utils/history'

export default class AdminExamComponent extends Component {
    dialogRef: any
    state = {
        dataSource: [],
        columns: [],
        formFields: [],
        dialogVisible: false
    }

    questions: { question: string; id: number }[]

    onRowUpdated = (data: { row: any; key: number }, callback: Function) => {
        const { key, row } = data
        const { questionList } = row
        const examId = key
        const ids = questionList.map(name => this.questions.find(item => item.question === name)!.id)
        $Api.examService
            .putExam(examId, {
                ids,
                name: row.name
            })
            .subscribe(res => {
                callback(res)
            })
    }

    getQuestions() {
        return $Api.examService
            .questions()
            .pipe(tap(questions => (this.questions = questions)))
            .toPromise()
    }

    preview(id: number) {
        history.push('/admin/exam/preview/' + id)
    }

    createColumns(questions) {
        const columns: TableColumnProps[] = [
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
                title: 'Time',
                dataIndex: 'time',
                key: 'time',
                editable: true
            },
            {
                title: 'Question Goal',
                dataIndex: 'goal',
                key: 'goal'
            },
            {
                title: 'Question list',
                dataIndex: 'questionList',
                key: 'questionList',
                editable: true,
                type: 'selects',
                multiple: true,
                selects: questions.map(q => q.question)
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
                title: 'Preview',
                dataIndex: 'preview',
                render: (text, record) => {
                    return <a onClick={() => this.preview(record.key)}>Link</a>
                }
            }
        ]
        this.setState({
            columns
        })
    }

    async getFormFields(questions) {
        const formFields: FormField[] = [
            {
                name: 'name',
                required: true
            },
            {
                name: 'questions',
                type: 'SELECT',
                multiple: true,
                initialValue: [],
                selects: questions.map(q => q.question),
                required: true
            }
        ]

        this.setState({
            formFields
        })
    }

    async componentDidMount() {
        await this.getQuestions()
        this.createColumns(this.questions)
        this.getFormFields(this.questions)
        this.getExams()
    }

    getExams(): void {
        $Api.examService.exams().subscribe(res => {
            this.setState({
                columns: this.state.columns,
                dataSource: res.map(item => {
                    return {
                        ...item,
                        goal: item.questions.reduce((pre, cur) => pre + cur.difficulty, 0),
                        questionList: item.questions.map(q => q.question)
                    }
                })
            })
        })
    }

    addExam(): void {
        this.setState({ dialogVisible: true })
        const { form } = this.dialogRef.props
        form.validateFields()
    }

    handleCancel = (): void => {
        this.setState({ dialogVisible: false })
        const { form } = this.dialogRef.props
        form.resetFields()
    }

    handleCreate = (): void => {
        const { form } = this.dialogRef.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            const ids = values.questions.map(name => this.questions.find(q => q.question === name)!.id)
            $Api.examService.createExam({ ...values, questions: ids }).subscribe(res => {
                this.getExams()
                form.resetFields()
                this.setState({ dialogVisible: false })
            })
        })
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end mb-2">
                    <Button onClick={this.addExam.bind(this)}>
                        <Icon
                            style={{ float: 'left', height: '20px', lineHeight: '20px' }}
                            className="align-middle"
                            type="plus"
                        />
                        {'Exam'}
                    </Button>
                </div>
                <ModalFormComponent
                    wrappedComponentRef={formRef => {
                        this.dialogRef = formRef
                    }}
                    title="Add Exam"
                    visible={this.state.dialogVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    fields={this.state.formFields}
                />
                <EditTableComponent
                    data={this.state.dataSource}
                    columns={this.state.columns}
                    onRowUpdated={this.onRowUpdated}
                />{' '}
            </div>
        )
    }
}
