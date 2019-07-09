import './App.css'
import React from 'react'
import { Router } from 'react-router-dom'
import Main from './components/base/main'
import { Provider } from 'react-redux'
import store from './redux/store'
import { setupInterceptors } from './utils/rest'
import setInitialization from './utils/setInitialization'
import history from './utils/history'
setupInterceptors(store)
setInitialization(store)

const App: React.FunctionComponent = () => {
    return (
        <Provider store={store}>
            <Router history={history}>
                <div className="app">
                    <Main />
                </div>
            </Router>
        </Provider>
    )
}

export default App