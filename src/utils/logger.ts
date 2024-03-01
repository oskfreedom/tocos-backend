export const info = (...params: any[]) => {
    console.log(...params)
}

export const error = (...params: any[]) => {
    console.error(...params)
}

const Logger = {
    info, error
}

export default Logger;