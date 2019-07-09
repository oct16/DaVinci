import { Route } from 'react-router-dom'
import Header from './header'
import Footer from './footer'
import React from 'react'
import styles from './default-layout.module.css'
import MenuComponent from './menu'

const DefaultLayout = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={matchProps => (
                <div className={styles.defaultLayout}>
                    <MenuComponent />
                    <div className={styles.mainLayout}>
                        <Header />
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
