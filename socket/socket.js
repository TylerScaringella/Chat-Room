const socketConnections = new Map()

module.exports = (server) => {
    const io = require('socket.io')(server)

    io.on('connection', socket => {
        socket.on('join-room', (code, userId) => {
            socket.join(code)
            socket.broadcast.to('user-connected', {
                userId: userId
            })

            socketConnections.set(userId, socket)

            socket.on('disconnect', () => {
                socket.broadcast.to(code).emit('user-disconnected', userId)
            })
        })
    })
}