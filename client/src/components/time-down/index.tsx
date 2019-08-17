import React, { Component } from 'react'

class Timer extends Component<any> {
    render() {
        return (
            <span>
                {this.props.minute}:{this.props.seconds}
            </span>
        )
    }
}

export class TimeDown extends Component<Readonly<{ remainTime: number; onTimeEnd: Function }>, any> {
    secondsRemaining: number
    endTime: number
    intervalHandle: any
    state = {
        seconds: '00',
        minute: '0',
        endTime: 0
    }
    constructor(props) {
        super(props)
        this.startTimeDown = this.startTimeDown.bind(this)
        this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        this.init()
    }

    init(): void {
        const { remainTime } = this.props

        if (remainTime) {
            const endTime = +new Date() + remainTime
            const time = remainTime / 1000 / 60
            const minute = ~~time
            const seconds = ~~(
                (Number(
                    time
                        .toFixed(3)
                        .toString()
                        .split('.')[1]
                ) /
                    1000) *
                60
            )
            this.endTime = endTime
            this.setState({ minute, seconds })
            this.startTimeDown()
        }
    }

    componentWillUnmount() {
        this.clearHandle()
    }

    clearHandle() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle)
        }
    }

    timeEnd() {
        const { onTimeEnd } = this.props
        onTimeEnd()
        this.clearHandle()
    }

    tick() {
        this.secondsRemaining = ~~((+new Date(this.endTime) - +Date.now()) / 1000)
        var min = Math.floor(this.secondsRemaining / 60)
        var sec = this.secondsRemaining - min * 60

        this.setState({
            minute: min,
            seconds: sec
        })

        if (sec < 10) {
            this.setState({
                seconds: '0' + this.state.seconds
            })
        }

        if (min < 10) {
            this.setState({
                minute: '0' + min
            })
        }

        if (min === 0 && sec === 0) {
            clearInterval(this.intervalHandle)
            this.timeEnd()
        }
    }

    startTimeDown() {
        this.tick()
        this.intervalHandle = setInterval(this.tick, 1000)
    }

    render() {
        return (
            <div>
                <h5>
                    <span>Time Down: </span>
                    <Timer minute={this.state.minute} seconds={this.state.seconds} />
                </h5>
            </div>
        )
    }
}
