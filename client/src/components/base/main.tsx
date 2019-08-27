import React, { Component } from 'react'
import Loadable from 'react-loadable'
import AdminLayout from './admin-layout'
import Layout from './layout'
import { Route, Switch, Redirect } from 'react-router'
import NoMatchComponent from './no-match'
import loading from './loading'

export default class Main extends Component {
    render() {
        return (
            <Switch>
                <Layout
                    exact={true}
                    path="/"
                    component={Loadable({
                        loader: () => import('@/components/exam/entry'),
                        loading
                    })}
                />
                <Layout
                    exact={true}
                    path="/exam/:examId(\d+)"
                    component={Loadable({
                        loader: () => import('@/components/exam/exam'),
                        loading
                    })}
                />
                <Layout
                    exact={true}
                    path="/exam/intro/:examId(\d+)"
                    component={Loadable({
                        loader: () => import('@/components/exam/intro'),
                        loading
                    })}
                />

                <Layout
                    exact={true}
                    path="/admin/login"
                    component={Loadable({
                        loader: () => import('@/components/admin/login/login'),
                        loading
                    })}
                />
                <AdminLayout
                    exact={true}
                    path="/admin/:type(user|examinee|token|question|selection|exam|answer)"
                    component={Loadable({
                        loader: () => import('@/components/admin/admin'),
                        loading
                    })}
                />
                <Layout
                    exact={true}
                    path="/admin/exam/preview/:examId(\d+)"
                    component={Loadable({
                        loader: () => import('@/components/exam/exam-preview'),
                        loading
                    })}
                />
                <Layout
                    exact={true}
                    path="/admin/exam/answer/:examineeId(\d+)"
                    component={Loadable({
                        loader: () => import('@/components/exam/exam-answer'),
                        loading
                    })}
                />
                <Route exact={true} path="/admin/">
                    <Redirect to="/admin/token" />
                </Route>

                <Layout exact={true} component={NoMatchComponent} />
            </Switch>
        )
    }
}
