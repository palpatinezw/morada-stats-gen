const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')

const app = express()
const apiPort = 2222

const router = express.Router()

const Nations = require('./nations')
const nationsRouter = express.Router()

nationsRouter.post('/new_nation', Nations.createNation)
nationsRouter.get('/nations', Nations.getNations)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public', {
	etag: true,
	lastModified: false,
	extensions: ['html', 'htm']
}))
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/nationsapi', nationsRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))