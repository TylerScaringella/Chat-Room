const express = require('express')
const app = express()
const server = require('http').Server(app)

require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.static('public'))

require('./api/routes')(app)
require('./socket/socket')(server)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})