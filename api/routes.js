const { generateCode } = require('../util/utils')

/*
We want to allow users to create rooms. When they goto the main page, they will receive a unique code for their own room

They can give that link / code to other people that can join that same room
*/

module.exports = (app) => {
    app.get('/', (req, res) => {
        const generatedCode = generateCode()

        req.url = `/${generatedCode}`
        app.handle(req, res)
    })

    app.get('/:code', (req, res) => {
        const { code } = req.params
        res.render('room', {code: code})
    })
}