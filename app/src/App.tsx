import './App.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/base/header'
import Footer from './components/base/footer'
import Main from './components/base/main'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <Main />
                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App
