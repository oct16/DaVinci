import React, { Component } from 'react'
import loadingImg from '@/asset/images/loading.svg'
export default class LoadingComponent extends Component<any> {
    render() {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <img style={{ width: '80px' }} src={loadingImg} alt="loading" />
            </div>
        )
    }
}
