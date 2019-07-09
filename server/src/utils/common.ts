export const commonMessage = (errorInfo: { message: any; status: number; url: string }) => {
    // log something...
    return {
        ...errorInfo,
        time: new Date()
    }
}

export function ValidateParams() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // console.log(target)
        // console.log(propertyKey)
        // console.log(descriptor)
    }
}

export const dateFormat = 'YYYY-MM-DD'
