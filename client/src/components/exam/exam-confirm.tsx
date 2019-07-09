import React, { Component } from 'react'

import { Button, Modal } from 'antd'

export default class ExamConfirmComponent extends Component<any, any> {
    state = {
        loading: false,
        visible: false
    }

    showModal = () => {
        this.setState({
            visible: true
        })
    }

    handleOk = () => {
        this.setState({ loading: true })
        this.setState({ loading: false, visible: false })
        const { onClick } = this.props
        onClick()
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    render() {
        const { visible, loading } = this.state
        return (
            <div>
                <Modal
                    visible={visible}
                    title={'submit your answers'.toUpperCase()}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Submit
                        </Button>
                    ]}
                >
                    <p>
                        Are you sure to submit your answers? <br /> It can't be modify after your submit
                    </p>
                </Modal>
                <div className="mt-2 d-flex justify-content-end">
                    <Button onClick={this.showModal} type="primary">
                        Submit
                    </Button>
                </div>
            </div>
        )
    }
}
