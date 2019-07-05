import React, { Component } from "react";
import { Route } from "react-router-dom";
import ExamComponent from "../exam/exam";
import EntryComponent from "../exam/entry";
export default class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={EntryComponent} />
                <Route exact path="/exam" component={ExamComponent} />
            </div>
        );
    }
}
