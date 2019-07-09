import React, { Component, CSSProperties } from 'react'
import * as monaco from 'monaco-editor'
import styles from './code-editor.module.css'
export default class CodeEditorComponent extends Component<{
    question: string
    onChange?: (obj: any) => void
}> {
    monacoContainer: React.RefObject<any>
    monaco: monaco.editor.IStandaloneCodeEditor

    state = {
        value: ''
    }

    constructor(props) {
        super(props)
        this.monacoContainer = React.createRef()

        const value = props.value || ''
        this.state.value = value
    }

    componentDidMount(): void {
        this.monaco = monaco.editor.create(this.monacoContainer.current, {
            value: this.state.value || [''].join('\n'),
            // value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            // theme: 'vs-dark',
            language: 'typescript'
        })

        this.monaco.onDidChangeModelContent(e => {
            this.handleChange(e)
        })
    }

    triggerChange(changedValue) {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props
        if (onChange) {
            onChange(changedValue.value)
        }
    }

    handleChange(e) {
        const value = this.monaco.getValue()

        if (!('value' in this.props)) {
            this.setState({ value })
        }
        this.triggerChange({ value })
    }

    render() {
        const monacoContainerStyle: CSSProperties = {
            height: '100%'
        }
        return (
            <div className={styles.monaco}>
                <div style={monacoContainerStyle} ref={this.monacoContainer} />
            </div>
        )
    }
}
