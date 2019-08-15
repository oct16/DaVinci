import React, { Component } from 'react'
import ExamComponent from '../exam/exam'
import EntryComponent from '../exam/entry'
import AdminComponent from '../admin/admin'
import AdminLoginComponent from '../admin/login/login'
import AdminLayout from './admin-layout'
import Layout from './layout'
import { Route, Switch, Redirect } from 'react-router'
import AdminExamPreviewComponent from '../exam/exam-preview'
import AdminExamAnswerComponent from '../exam/exam-answer'
import ExamIntroComponent from '../exam/intro'
export default class Main extends Component {
    render() {
        return (
            <Switch>
                <Layout exact={true} path="/" component={EntryComponent} />
                <Layout exact={true} path="/exam/:examId(\d+)" component={ExamComponent} />
                <Layout exact={true} path="/exam/intro/:examId(\d+)" component={ExamIntroComponent} />

                <Layout exact={true} path="/admin/login" component={AdminLoginComponent} />
                <AdminLayout
                    exact={true}
                    path="/admin/:type(user|examinee|token|question|selection|exam|answer)"
                    component={AdminComponent}
                />
                <Layout exact={true} path="/admin/exam/preview/:examId(\d+)" component={AdminExamPreviewComponent} />
                <Layout exact={true} path="/admin/exam/answer/:examineeId(\d+)" component={AdminExamAnswerComponent} />
                <Route exact={true} path="/admin/">
                    <Redirect to="/admin/token" />
                </Route>

                <Layout exact={true} component={NoMatch} />
            </Switch>
        )
    }
}

const NoMatch = () => (
    <div>
        <h3
            style={{
                textAlign: 'center',
                width: '200px',
                height: '2.4rem',
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: 'auto'
            }}
        >
            404 No Found
        </h3>
    </div>
)
