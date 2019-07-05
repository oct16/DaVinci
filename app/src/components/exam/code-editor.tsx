import React, { Component, CSSProperties } from 'react'
import * as monaco from 'monaco-editor'
import styles from './code-editor.module.css'
export default class CodeEditorComponent extends Component<{code?: string}> {
    monacoContainer: React.RefObject<any>
    state: any
    monaco: monaco.editor.IStandaloneCodeEditor | undefined
    constructor(props) {
        super(props)
        this.monacoContainer = React.createRef()
    }

    componentDidMount() {
        const { code } = this.props
        this.monaco = monaco.editor.create(this.monacoContainer.current, {
            value: code || [''].join('\n'),
            // value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            // theme: 'vs-dark',
            language: 'typescript'
        })
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
