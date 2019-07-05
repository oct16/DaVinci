import React, { Component } from 'react'

class Timer extends Component<any> {
    render() {
        return (
            <span>
                {this.props.value}:{this.props.seconds}
            </span>
        )
    }
}

export class TimeDown extends Component<any, any> {
    secondsRemaining: number
    intervalHandle: any

    constructor(props) {
        super(props)
        this.state = {
            seconds: '00',
            value: '60',
            isClicked: false
        }
        this.startTimeDown = this.startTimeDown.bind(this)
        this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    timeEnd() {
        const { onTimeEnd } = this.props
        onTimeEnd()
    }

    tick() {
        var min = Math.floor(this.secondsRemaining / 60)
        var sec = this.secondsRemaining - min * 60

        this.setState({
            value: min,
            seconds: sec
        })

        if (sec < 10) {
            this.setState({
                seconds: '0' + this.state.seconds
            })
        }

        if (min < 10) {
            this.setState({
                value: '0' + min
            })
        }

        if (min === 0 && sec === 0) {
            clearInterval(this.intervalHandle)
            this.timeEnd()
        }

        this.secondsRemaining--
    }

    startTimeDown() {
        this.intervalHandle = setInterval(this.tick, 1000)
        let time = this.state.value
        this.secondsRemaining = time * 60
    }

    render() {
        return (
            <div>
                <h5>
                    <span>Time Down: </span>
                    <Timer value={this.state.value} seconds={this.state.seconds} />
                </h5>
            </div>
        )
    }
}
