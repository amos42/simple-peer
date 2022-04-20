'use strict';

const wrtcConstants = require('./wrtc-constants');
const fetch = require('node-fetch');

let imageChannel;
let icecandidate;

(async () => {
    let iceServers = [
        { urls: "stun:stun.l.google.com:19302" }
    ];
    iceServers = [];

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${wrtcConstants.TWILIO_ACCOUNT}/Tokens.json`;
    const response0 = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + btoa(`${wrtcConstants.TWILIO_ACCOUNT}:${wrtcConstants.TWILIO_AUTH_TOKEN}`)
    }
    });
    const twilioData = await response0.json();
    iceServers = twilioData.ice_servers;

    console.log(iceServers);

    this.peer = new RTCPeerConnection({ iceServers: iceServers });
    this.peer.onnegotiationneeded = initChannel.bind(this);
    this.peer.onicecandidate  = async function(event) {
        console.log('ice candidate');
        if (event.candidate) {
            // event.candidate가 존재하면 원격 유저에게 candidate를 전달합니다.
            const res = await fetch("/icecandidate", { 
                headers: {
                    "Content-Type": "application/json",
                },
                method: "post",
                body: JSON.stringify({icecandidate: event.candidate}),
            }).then(res => res.json());
            icecandidate = JSON.stringify(event.candidate);
            console.log('>>> sdp:');
            console.log(res);
            // this.peer.setRemoteDescription(new RTCSessionDescription(res.sdp));
        } else {
            // 모든 ICE candidate가 원격 유저에게 전달된 조건에서 실행됩니다.
            // candidate = null
        }        
    }.bind(this);


    imageChannel = this.peer.createDataChannel("imageChannel");

    imageChannel.onmessage = ({ data }) => 
    {
        // Do something with received data.
        console.log(data);
        const textTag = document.getElementById('data');
        textTag.appendChild(document.createElement('br'));
        textTag.appendChild(document.createTextNode(data));        
    };

    const imageData = "connected";

    imageChannel.onopen = () => imageChannel.send(imageData);// Data channel opened, start sending data.


    const btn = document.getElementById('button');
    btn.addEventListener('click', click.bind(this));

})();


async function initChannel()
{
    console.log('start negotiate...');

    console.log('create offer.');
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);

    console.log('send peer description.');
    // Send offer and fetch answer from the server
    const { sdp } = await fetch("/connect", { 
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({ sdp: this.peer.localDescription, icecandidate: icecandidate }),
    }).then(res => res.json());

    console.log('set remote description.');
    this.peer.setRemoteDescription(new RTCSessionDescription(sdp));
}

function click(event)
{
    console.log('send text');
    imageChannel.send('test data');
}