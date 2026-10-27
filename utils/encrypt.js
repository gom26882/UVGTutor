'use strict'

import bcrypt from 'bcryptjs'

export const encrypt = async (password) => {
    try {
        const saltRounds = 12

        return await bcrypt.hash(password, saltRounds)

    } catch (err) {
        console.error('Password encryption failed:', err)
        throw err
    }
}

export const checkPassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash)

    } catch (err) {
        console.error('Password verification failed:', err)
        throw err
    }
}