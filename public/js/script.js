const socket = io('/')
const videos = document.getElementById('videos')

const peer = new Peer({
    host: 'cs-peer-server.herokuapp.com',
    port: 443,
    secure: true,
    key: 'peerjs'
})

const myVideo = document.createElement('video')
myVideo.setAttribute('id', 'self')
myVideo.muted = true
myVideo.autoplay = true
myVideo.controls = true
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
        video.setAttribute('id', call.peer)
        video.controls = true
        video.autoplay = true

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', data => {
        setTimeout(connectToNewUser,1000,data.userId,stream)
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
    video.autoplay = true
    video.controls = true

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}