import React, { Component } from 'react'

export default class SelectEditorComponent extends Component<{
    question: string
    selects: string[]
    multiple?: boolean
    onChange?: (obj: any) => void
}> {
    state = {
        value: []
    }

    constructor(props) {
        super(props)

        const value = props.value || ['']
        this.state.value = value
    }
    triggerChange(changedValue) {
        const { onChange } = this.props
        if (onChange) {
            onChange(changedValue)
        }
    }

    handleChange(e) {
        const value = e.target.value
        const changedValue = newVal => {
            const { multiple } = this.props
            if (!multiple) {
                return [newVal]
            }
            const stateVal = this.state.value.slice()
            const index = stateVal.indexOf(newVal)
            const isExist = ~index
            if (isExist) {
                stateVal.splice(index, 1)
                return stateVal
            } else {
                return [...stateVal, newVal]
            }
        }

        const val = changedValue(value)
        this.setState({ value: val })
        this.triggerChange(val)
    }

    render() {
        const { selects, question, multiple } = this.props
        const key = Math.random()
            .toString(36)
            .substr(7)

        return (
            <div>
                <fieldset ref="select">
                    {selects.map((select, index) => {
                        const i = (index + 1).toString()

                        const id = key + '__' + i

                        return (
                            <div key={i}>
                                <input
                                    onChange={this.handleChange.bind(this)}
                                    type={multiple ? 'checkbox' : 'radio'}
                                    id={id}
                                    checked={this.state.value.find(i => i === select) ? true : false}
                                    name={question}
                                    defaultValue={select}
                                />
                                <label htmlFor={id}>
                                    <span>&nbsp;</span>
                                    {i + '. ' + select}
                                </label>
                            </div>
                        )
                    })}
                </fieldset>
            </div>
        )
    }
}
