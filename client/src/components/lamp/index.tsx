import React, { Component } from 'react'
import s from './lamp.module.css'
export default class LampComponent extends Component {
    render() {
        return (
            <div>
                <section className={s.lampContainer}>
                    <div className="lampWrap">
                        <div className="lampBase" />
                        <div className="lampStand">
                            <div className="bar bar1">
                                <div className="bar bar2">
                                    <div className="rotator">
                                        <div className="bar bar3">
                                            <div className="cord1" />
                                            <div className="bar bar4">
                                                <div className="cord2" />
                                                <div className="lampHead">
                                                    <div className="lightBeam" />
                                                    <div className="bulb" />
                                                    <div className="lampshade" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footerMask">
                        <div className="deskTop" />
                    </div>
                </section>
            </div>
        )
    }
}
