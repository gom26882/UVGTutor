import { initServer } from './configs/app.js'
import { config } from 'dotenv'
import { connect } from './configs/mongo.js'

config()
await connect()
await initServer()