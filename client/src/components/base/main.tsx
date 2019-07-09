import React, { Component } from 'react'
import ExamComponent from '../exam/exam'
import EntryComponent from '../exam/entry'
import AdminComponent from '../admin/admin'
import AdminLoginComponent from '../admin/login/login'
import DefaultLayout from './default-layout'
import { Route, Switch, Redirect } from 'react-router'
import AdminExamPreviewComponent from '../exam/exam-preview'
import AdminExamAnswerComponent from '../exam/exam-answer'
export default class Main extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={EntryComponent} />
                <Route exact path="/exam/:examId(\d+)" component={ExamComponent} />

                <Route exact path="/admin/login" component={AdminLoginComponent} />
                <DefaultLayout exact path="/admin/:type(user|examinee|token|question|selection|exam|answer)" component={AdminComponent} />
                <Route exact path="/admin/exam/preview/:examId(\d+)" component={AdminExamPreviewComponent} />
                <Route exact path="/admin/exam/answer/:examineeId(\d+)" component={AdminExamAnswerComponent} />
                <Route exact path="/admin/">
                    <Redirect to="/admin/token" />
                </Route>

                <Route exact component={NoMatch} />
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
