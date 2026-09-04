import mongoose from 'mongoose'

export const connect = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | connection error')
        })

        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | connecting...')
        })

        mongoose.connection.on('connected', () => {
            console.log('MongoDB | connected')
        })

        mongoose.connection.once('open', () => {
            console.log('MongoDB | database connection ready')
        })

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconnected')
        })

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | disconnected')
        })

        await mongoose.connect(process.env.URI_MONGO, {
            maxPoolSize: 50,
            serverSelectionTimeoutMS: 5000
        })

    } catch (err) {
        console.error('MongoDB | connection failed', err)
        throw err
    }
}