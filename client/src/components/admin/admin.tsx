import React, { Component } from 'react'
import styles from './admin.module.css'
import { Route, Switch } from 'react-router'
import AdminUsersComponent from './login/user/users'
import AdminQuestionComponent from './login/user/question'
import AdminSelectionComponent from './login/user/selection'
import AdminExamComponent from './login/user/exam'
import AdminTokenComponent from './login/user/token'
import AdminExamineeComponent from './login/user/examinee'
export default class AdminComponent extends Component<any> {
    render(): JSX.Element {
        return (
            <div className={styles.admin}>
                <div className="d-flex flex-row">
                    <div className="flex-fill p-3">
                        <Switch>
                            <Route exact={true} path="/admin/user" component={AdminUsersComponent} />
                            <Route exact={true} path="/admin/token" component={AdminTokenComponent} />
                            <Route exact={true} path="/admin/examinee" component={AdminExamineeComponent} />
                            <Route exact={true} path="/admin/exam" component={AdminExamComponent} />
                            <Route exact={true} path="/admin/question" component={AdminQuestionComponent} />
                            <Route exact={true} path="/admin/selection" component={AdminSelectionComponent} />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
