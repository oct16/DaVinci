import React, { Component } from 'react'
import styles from './header.module.css'
import Icon from 'antd/lib/icon'
import { connect } from 'react-redux'
import { Dropdown, Menu } from 'antd'
import { userLogout } from '../../redux/actions/user'

class Header extends Component<{ user: any; userLogout: () => void }> {
    render() {
        const { user } = this.props

        const menu = (
            <Menu style={{ margin: 0 }}>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.props.userLogout}>
                        logout
                    </a>
                </Menu.Item>
            </Menu>
        )

    return (
            <header className={styles['app-header'] + ' d-flex justify-content-end align-items-center'}>
                {user ? (
                    <div className={styles['user-info']}>
                        <Dropdown overlay={menu}>
                            <div className="d-inline-block">
                                <Icon type="user" style={{ verticalAlign: 'baseline' }} />
                                <a className="ant-dropdown-link" href="#">
                                    {user && user.name} <Icon type="down" />
                                </a>
                            </div>
                        </Dropdown>
                    </div>
                ) : (
                    ''
                )}
            </header>
        )
    }
}

const mapStateToProps = state => {
    return { user: state.user.user }
}

export default connect(
    mapStateToProps,
    { userLogout }
)(Header)
