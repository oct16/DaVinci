import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '@/components/base/edit-table'
import { $Api } from '@api'
import { Button, Icon } from 'antd'
import ModalFormComponent, { FormField } from '@/components/base/modal-form'

export default class AdminTokenComponent extends Component {
    dialogRef: any
    exams: any
    constructor(props) {
        super(props)
        this.dialogRef = React.createRef<any>()
    }
    state = {
        source: {
            data: [],
            size: null,
            page: null,
            pages: null,
            total: null
        },
        dialogVisible: false,
        formFields: [],
        columns: []
    }

    onRowUpdated = (data: { row: any; key: number }, callback: Function) => {
        const { exam } = data.row
        const id = data.key
        const examId = this.exams.find(e => e.name === exam)!.id

        $Api.examService.putToken(id, { examId }).subscribe(res => {
            callback()
        })
    }

    getColumns(exams) {
        const columns: TableColumnProps[] = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Token',
                dataIndex: 'value',
                key: 'value'
            },
            {
                title: 'Examinee',
                dataIndex: 'examinee',
                key: 'examinee'
            },
            {
                title: 'Exam',
                dataIndex: 'exam',
                key: 'exam',
                editable: true,
                type: 'selects',
                selects: exams
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

        this.setState({
            columns
        })
    }

    getFormFields(exams) {
        const formFields: FormField[] = [
            {
                name: 'exam',
                type: 'SELECT',
                selects: exams,
                required: true
            }
        ]

        this.setState({
            formFields
        })
    }

    async componentDidMount() {
        await this.initData()
    }

    async initData() {
        const exams = (this.exams = await this.getExams())
        const mapExams = exams.map(exam => exam.name)

        this.getFormFields(mapExams)
        this.getColumns(mapExams)
        this.getTokens()
    }

    getExams() {
        return $Api.examService.exams().toPromise()
    }

    getTokens(page?: number): void {
        $Api.examService.tokens(page).subscribe(res => {
            res.data.map(item => ({
                ...item,
                exam: item.exam.name,
                examinee: item.examinee ? item.examinee.name : '-'
            }))
            this.setState({
                source: res
            })
        })
    }

    addToken(): void {
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
            const { exam } = values
            const examId = this.exams.find(e => e.name === exam)!.id
            $Api.examService.createToken(examId).subscribe(res => {
                this.getTokens()
                form.resetFields()
                this.setState({ dialogVisible: false })
            })
        })
    }

    onPageChange(page: number): void {
        this.getTokens(page)
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end mb-2">
                    <Button onClick={this.addToken.bind(this)}>
                        <Icon
                            style={{ float: 'left', height: '20px', lineHeight: '20px' }}
                            className="align-middle"
                            type="plus"
                        />
                        {'Token'}
                    </Button>
                </div>
                <ModalFormComponent
                    wrappedComponentRef={formRef => {
                        this.dialogRef = formRef
                    }}
                    title="Add Token"
                    visible={this.state.dialogVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    fields={this.state.formFields}
                />
                <EditTableComponent
                    onPageChange={this.onPageChange.bind(this)}
                    pager={this.state.source}
                    columns={this.state.columns}
                    onRowUpdated={this.onRowUpdated}
                />
            </div>
        )
    }
}
