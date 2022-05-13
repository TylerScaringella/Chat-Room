const socket = io('/')
const videos = document.getElementById('videos')

const peer = new Peer({
    host: 'localhost',
    port: 9000,
    key: 'peerjs',
    path: '/peer'
})

const myVideo = document.createElement('video')
myVideo.muted = true
let myStream

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream)

        const video = document.createElement('video')
        video.setAttribute('id', userId)

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', data => {
        connectToNewUser(data.userId, stream)

    })
})

socket.on('user-disconnected', userId => {
    const user = peers[userId]
    if(!user) return
    user.close()
    const vid = document.getElementById(user)
    if(vid) vid.remove()
})

peer.on('open', id => {
    socket.emit('join-room', code, id)
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })

    videos.append(video)
}

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    video.setAttribute('id', userId)

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}