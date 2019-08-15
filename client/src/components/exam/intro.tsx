import React, { Component } from 'react'
import s from './intro.module.css'
import cn from 'classnames'

import { withRouter, RouteComponentProps } from 'react-router'
import { $Api } from '@api'
import { Icon, Button } from 'antd'
import { history } from '@/utils/history'

class ExamIntroComponent extends Component<RouteComponentProps<{ examId: string }>> {
    state = {
        title: '',
        minutes: 0,
        count: 0
    }

    constructor(props) {
        super(props)
        this.getData()
    }

    getData(): void {
        const examId = Number(this.props.match.params.examId)
        $Api.examService.getExam(examId).subscribe(res => {
            const { exam } = res
            this.setState({
                title: exam.name,
                minutes: (exam.time / (1000 * 60)).toFixed(0),
                count: exam.questions.length
            })
        })
    }

    goExam(): void {
        const examId = Number(this.props.match.params.examId)
        history.push(`/exam/${examId}`)
    }

    render() {
        const Title = (props: { title: string; minutes: number; count: number }) => (
            <div className={s.titleContainer}>
                <h3 className={s.title}>{props.title}</h3>
                <p className={s.subTitle}>
                    共{props.count}道题 限时{props.minutes}分钟
                </p>
            </div>
        )
        const Rules = (props: { minutes: number; count: number }) => (
            <ul className={s.list}>
                <li>考试共{props.count}道题</li>
                <li>
                    考试需在{props.minutes}
                    分钟内交卷，过程中无法暂停，请提前安排好时间；如未及时交卷，则本次考试作废
                </li>
                <li>
                    推荐使用 <Icon style={{ verticalAlign: 'text-bottom', fontSize: '1.2rem' }} type="chrome" />
                    Chrome 浏览器（版本：73及以上的正式版本），或
                    <Icon style={{ verticalAlign: 'text-bottom', fontSize: '1.2rem' }} type="html5" />
                    Firefox浏览器（版本：66及以上的正式版本)
                </li>
                <li>
                    考试过程中，系统将判断您的浏览器状态，如发现最小化浏览器、切换标签页、窗口缩小或扩大等行为，以及弹出广告弹窗，将会给出警告。如果次数过多您的考试成绩将作废
                </li>
                <li>考试前请关闭即时通信软件以及其他可能会有弹窗的软件，以免影响您的考试</li>
            </ul>
        )
        return (
            <div className={cn('d-flex flex-column justify-content-center align-items-center h-100')}>
                <Title minutes={this.state.minutes} count={this.state.count} title={this.state.title} />
                <div className={cn(s.intro)}>
                    <b>答题开始即开始计时，中途不可暂停，如超时则自动提交</b>
                    <Rules minutes={this.state.minutes} count={this.state.count} />
                </div>

                <div className={s.btnBox}>
                    <a href="#" className={s.btn}>
                        <span className={s.text} />
                        <span className={s['flip-front']}>
                            <Icon
                                style={{ verticalAlign: 'text-bottom', fontSize: '1rem', color: 'balck' }}
                                type="arrow-right"
                            />
                        </span>
                        <span onClick={this.goExam.bind(this)} className={s['flip-back']}>
                            Start Exam
                        </span>
                    </a>
                </div>
            </div>
        )
    }
}

export default withRouter(ExamIntroComponent)
