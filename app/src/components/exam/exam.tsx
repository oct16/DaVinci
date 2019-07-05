import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import styles from './exam.module.css'
import ExamFormComponent from './exam-form'
import { TimeDown } from '../time-down'
import { Modal } from 'antd'
import ExamConfirmComponent from './exam-confirm'
class ExamComponent extends Component<any> {
    TimeDownComponentRef: TimeDown
    constructor(props) {
        super(props)
        this.onTimeEnd = this.onTimeEnd.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount(): void {
        setTimeout(() => this.TimeDownComponentRef.startTimeDown(), 1000)
    }

    onTimeEnd() {
        this.alertInfo()
    }

    alertInfo() {
        Modal.warning({
            title: 'time end'.toUpperCase(),
            content: 'Your answer has been automatically submitted'
        })
    }

    onSubmit() {
        const modal = Modal.success({
            title: 'submitted'.toUpperCase(),
            onOk: () => {
                const { history } = this.props
                history.push('/')
            }
        })
    }

    render() {
        const ExamTitle = () => <h3 className={styles.title}>Front-End Examination</h3>

        return (
            <div className="container">
                <div className={styles.exam}>
                    <ExamTitle />
                    <TimeDown onTimeEnd={this.onTimeEnd} onRef={ref => (this.TimeDownComponentRef = ref)} />
                    <ExamFormComponent />
                    <ExamConfirmComponent onClick={this.onSubmit} />
                </div>
            </div>
        )
    }
}

export default withRouter(ExamComponent)
