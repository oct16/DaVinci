import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import styles from './login.module.css'
import service from '../../../api/service'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { userLogin } from '../../../redux/actions/user'
import history from '../../../utils/history'

class AdminLoginForm extends Component<any, any> {
    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.props.history.push('/admin')
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: { userName: string; password: string }) => {
            if (!err) {
                service.userService.login(values.userName, values.password).subscribe(res => {
                    this.props.userLogin(res)
                    history.push('/admin/token')
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className={'d-flex align-items-center justify-content-center ' + styles.container}>
                <div className="col-6">
                    <Form style={{ maxWidth: '300px', margin: 'auto' }} onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            <h3>Admin Login</h3>
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please input your username!' }]
                            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />
                            )}
                        </Form.Item>
                        <div className="d-flex justify-content-end">
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const AdminLoginComponent = Form.create({ name: 'adminLoginForm' })(withRouter(AdminLoginForm))
const mapStateToProps = state => {
    return { user: state.user.user }
}
export default connect(
    mapStateToProps,
    { userLogin }
)(AdminLoginComponent)
