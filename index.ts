const wrtcConstants = require('./wrtc-constants');

const path = require('path');
const express = require('express');
const webrtc = require('wrtc');
const bodyParser = require('body-parser');
const browserify = require('browserify-middleware');

const app = express();
let peer;
let icecandidate;

/**
 * This function is called once a data channel is ready.
 *
 * @param {{ type: 'datachannel', channel: RTCDataChannel }} event
 */
 function handleChannel({ channel })
 {
     channel.addEventListener("message", ({data}) =>
     {
         // Do something with data received from client. 
         console.log(data);
         channel.send(`server recived message : '${data}'`);
     });
     
     // Can use the channel to send data to client.
     channel.send("Hi from server");
 }

app.use(express.static(path.resolve(__dirname, "public")))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.redirect('/index.html'));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use('/client.js', browserify(path.join(__dirname, 'client.js')));

app.post('/connect', async ({ body }, res) =>
{
    console.log('start server');

    const client = require('twilio')(wrtcConstants.TWILIO_ACCOUNT, wrtcConstants.TWILIO_AUTH_TOKEN);
    const response = await client.tokens.create();    
    let iceServers = [
        { urls: 'stun:stun.l.google.com:19302' }
    ];
    // iceServers = response.iceServers;
    // iceServers = [];
    console.log('iceServers:');
    console.log(JSON.stringify(iceServers));

    peer = new webrtc.RTCPeerConnection({
        iceServers: iceServers
    });
    peer.onicecandidate  = function(event) {
        console.log(event);
        if (event.candidate) {
            // event.candidate가 존재하면 원격 유저에게 candidate를 전달합니다.
        } else {
            // 모든 ICE candidate가 원격 유저에게 전달된 조건에서 실행됩니다.
            // candidate = null
        }        
    }.bind(this);
    console.log('Connecting to client...');
    peer.ondatachannel = handleChannel;

    console.log(JSON.stringify(body));
    await peer.setRemoteDescription(new webrtc.RTCSessionDescription(body.sdp));
    await peer.setLocalDescription(await peer.createAnswer());
    if (body.icecandidate) {
        peer.addIceCandidate(body.icecandidate);
    }
    if (icecandidate) {
        peer.addIceCandidate(icecandidate);
    }

    return res.json({ sdp: peer.localDescription });
});

app.post('/icecandidate', async ({ body }, res) =>
{
    console.log('ice candicate');
    console.log(JSON.stringify(body));
    console.log(peer);
    if (peer) {
        await peer.addIceCandidate(body.icecandidate)
    }
    icecandidate = body.icecandidate;
    return res.json(body);
});

app.listen(3000);
