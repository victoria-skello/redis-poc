import * as dotenv from 'dotenv'

export const NODE_ENV = (process.env.NODE_ENV || 'development')
dotenv.config()

const getOrThrow = (name: string) => {
    const val = process.env[name]
    if (typeof val === 'undefined') throw new Error(`Missing mandatory environment variable ${name}`)
    return val
}

export const SERVER_PORT = getOrThrow('SERVER_PORT')
export const REDIS_URL = getOrThrow('REDIS_URL')
