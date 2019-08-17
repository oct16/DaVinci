import React, { Component } from 'react'
import { Modal } from 'antd'
import { $Api } from '@api'
import { history } from '@/utils/history'

export default class DetectBlurComponent extends Component {
    constructor(props) {
        super(props)
        this.onBlurEvent = this.onBlurEvent.bind(this)
    }

    componentDidMount() {
        window.addEventListener('blur', this.onBlurEvent)
    }

    componentWillUnmount() {
        window.removeEventListener('blur', this.onBlurEvent)
    }

    onBlurEvent() {
        this.sendMsg()
    }

    sendMsg() {
        $Api.examService.switchEvent().subscribe(
            res => {
                Modal.destroyAll()
                const { lives, count } = res
                const remain = lives - count
                this.warning(lives, remain)
            },
            () => {
                this.error()
            }
        )
    }

    error() {
        Modal.error({
            title: `考试结束`,
            content: (
                <div>
                    系统检测到疑似切换考试页面行为超过上限，本次考试资格已被取消
                    <br />
                    如有任何异议请向招聘部门反馈
                </div>
            ),
            onOk: () => {
                this.goHome()
            },
            onCancel: () => {
                this.goHome()
            }
        })
    }

    goHome() {
        history.push('/')
    }

    warning(lives: number, remain: number) {
        Modal.warning({
            width: 600,
            title: `您不能切换页面超过${lives}次，目前还剩${remain}次`,
            content: (
                <div>
                    系统检测到疑似切换考试页面行为，比如鼠标移出考试页面（包括导航栏、地址栏等非考试区域）、切
                    换标签页、窗囗缩小或扩大、最大化/最小化浏览器等。如果是因为广告弹窗导致的切屏，请关闭广告 弹窗
                    <br />
                    超过<b>{lives}</b>次，将取消本次考试资格
                </div>
            )
        })
    }
    render() {
        return <div>{/* detect user on blur */}</div>
    }
}
