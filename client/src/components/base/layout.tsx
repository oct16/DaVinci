import { Route } from 'react-router-dom'
import Header from './header'
import Footer from './footer'
import React from 'react'
import styles from './admin-layout.module.css'

const DefaultLayout = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={matchProps => (
                <div className={styles.defaultLayout}>
                    <div className={styles.mainLayout}>
                        <div className={styles.content}>
                            <Component {...matchProps} />
                        </div>
                        <Footer />
                    </div>
                </div>
            )}
        />
    )
}

export default DefaultLayout
