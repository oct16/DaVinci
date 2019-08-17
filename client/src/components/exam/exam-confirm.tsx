import React, { Component } from 'react'

import { Button, Modal } from 'antd'

export default class ExamConfirmComponent extends Component<{ onClick: Function }> {
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
                    title={'提交答案'}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" loading={loading} onClick={this.handleOk}>
                            提交
                        </Button>
                    ]}
                >
                    <p>
                        是否要提交你的答案？ <br />
                        一旦提交将无法进行修改
                    </p>
                </Modal>
                <div className="mt-2 d-flex justify-content-end">
                    <Button onClick={this.showModal}>提交</Button>
                </div>
            </div>
        )
    }
}
