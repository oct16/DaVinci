import React, { Component } from 'react'

export default class TextEditorComponent extends Component<{ onChange?: (obj: any) => void; question: string }> {
    state = {
        value: ''
    }

    constructor(props) {
        super(props)
        const value = props.value || ''
        this.state.value = value
    }

    questionPlaceHolder = 'Write your answer here'

    triggerChange(changedValue) {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props
        if (onChange) {
            onChange(changedValue.value)
        }
    }

    handleChange(e) {
        const value = e.target.value
        this.setState({ value })
        this.triggerChange({ value })
    }

    render() {
        return (
            <textarea
                ref="text"
                onChange={this.handleChange.bind(this)}
                className="ant-input"
                rows={6}
                value={this.state.value}
                placeholder={this.questionPlaceHolder}
            />
        )
    }
}
