const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const expressBasicAuth = require('express-basic-auth')

const auth = expressBasicAuth({
    users: { 'admin': 'password' },
    challenge: true,
    realm: 'example',
})

const app = express()
const port = 9090

const maxAge = 365 * 24 * 60 * 60 * 1000

app.use(morgan('dev'))

app.use('/public', express.static('public'))

const messages = [
    'Hello!',
    'Hi!',
    'Привет!',
]

let n = 0
app.get('/ping', (req, res) => {
    const delay = (++n % 3 === 0) ? 60 * 1000 : 0

    setTimeout(_ => res.send('pong'), delay)
})

app.get('/secret', auth, (req, res) => {
    res.send('ok')
})

app.get('/messages', (req, res) => {
    res.set({ 'Cache-Control': `max-age=${maxAge}` })
    res.json(messages)
})

app.post('/message', bodyParser.json(), (req, res) => {
    const { message } = req.body

    messages.push(message)
    res.send('ok')
})

app.get('/', (req, res) => res.send('<h1>Hello!</h1>'))
app.use('/upload', bodyParser.text(), (req, res) => {
    console.log(`Body: ${req.body}`)
    res.send('ok')
})

app.listen(port, _ => console.log(`Server listening at http://localhost:${port} 🚀`))
