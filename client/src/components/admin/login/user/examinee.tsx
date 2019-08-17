import React, { Component } from 'react'
import EditTableComponent, { TableColumnProps } from '@/components/base/edit-table'
import { $Api } from '@api'
import { history } from '@/utils/history'

export default class AdminExamineeComponent extends Component {
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
            key: 'name'
        },
        {
            title: 'Exam',
            dataIndex: 'exam',
            key: 'exam'
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time'
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',

            render: (text, record) => {
                return <a onClick={() => this.preview(record.key)}>Link</a>
            }
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

    preview(id: number) {
        history.push(`/admin/exam/answer/${id}`)
    }

    onRowUpdated(data: { row: any; key: number }, callback: Function) {}

    componentDidMount() {
        this.getExaminees()
    }

    getExaminees(): void {
        $Api.examService.examinees().subscribe(res => {
            this.setState({
                dataSource: res.map(item => {
                    const { token, answers, createdAt } = item
                    const exam = token && token.exam
                    let diffTime
                    if (answers && answers.length) {
                        const [firstA] = answers.slice(0, 1)
                        const aTime = Number(new Date(firstA.createdAt))
                        const cTime = Number(new Date(createdAt))
                        // console.log(firstA.createdAt, createdAt)
                        // console.log(aTime - cTime)
                        diffTime = aTime - cTime
                    }
                    return {
                        ...item,
                        time: diffTime ? (diffTime / 1000 / 60).toFixed(1) + 'min' : '-',
                        exam: exam ? exam.name : '-'
                    }
                })
            })
        })
    }

    render() {
        return (
            <EditTableComponent
                noOperation={true}
                data={this.state.dataSource}
                columns={this.columns}
                onRowUpdated={this.onRowUpdated}
            />
        )
    }
}
