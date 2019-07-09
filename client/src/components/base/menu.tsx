import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import styles from './menu.module.css'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class MenuComponent extends Component<any, any> {
    state = {
        collapsed: false
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    activeStyle = {
        color: 'white'
    }

    render() {
        const { user, location } = this.props
        return (
            <div className={styles.menu}>
                <div className={styles.collapsed}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggleCollapsed} />
                </div>
                <Menu
                    style={this.state.collapsed ? { width: 'auto' } : { width: '200px' }}
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['/admin/exam']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    {user && user.role === 'SUPER_ADMIN' ? (
                        <Menu.Item key="/admin/user">
                            <Link to="/admin/user">
                                <Icon className="align-middle" type="user" />
                                <span>Users</span>
                            </Link>
                        </Menu.Item>
                    ) : (
                        ''
                    )}
                    <Menu.Item key="/admin/token">
                        <Link to="/admin/token">
                            <Icon className="align-middle" type="rocket" />
                            <span>Tokens</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/examinee">
                        <Link to="/admin/examinee">
                            <Icon className="align-middle" type="book" />
                            <span>Examinees</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/exam">
                        <Link to="/admin/exam">
                            <Icon className="align-middle" type="robot" />
                            <span>Exams</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/question">
                        <Link to="/admin/question">
                            <Icon className="align-middle" type="thunderbolt" />
                            <span>Questions</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/selection">
                        <Link to="/admin/selection">
                            <Icon className="align-middle" type="select" />
                            <span>Selections</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { user: state.user.user }
}

export default connect(
    mapStateToProps,
    null
)(withRouter(MenuComponent))
