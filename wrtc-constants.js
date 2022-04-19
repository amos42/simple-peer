/* eslint-disable strict */

const ICE_STUN_URL = 'stun:localhost:3478';
const ICE_TURN_URL = 'turn:localhost:3478';
const ICE_TURN2_URL = 'turn:localhost:493';
const ICE_USER_NAME = '';
const ICE_CREDENTIAL = '';

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' }

    // {
    //     url: `${ICE_STUN_URL}?transport=udp`,
    //     urls: `${ICE_STUN_URL}?transport=udp`,
    // },
    // {
    //     url: `${ICE_TURN_URL}?transport=udp`,
    //     username: ICE_USER_NAME,
    //     urls: `${ICE_TURN_URL}?transport=udp`,
    //     credential: ICE_CREDENTIAL,
    // },
    // {
    //     url: `${ICE_TURN_URL}?transport=tcp`,
    //     username: ICE_USER_NAME,
    //     urls: `${ICE_TURN_URL}?transport=tcp`,
    //     credential: ICE_CREDENTIAL,
    // },
    // {
    //     url: `${ICE_TURN2_URL}?transport=tcp`,
    //     username: ICE_USER_NAME,
    //     urls: `${ICE_TURN2_URL}?transport=tcp`,
    //     credential: ICE_CREDENTIAL,
    // }
];

const TWILIO_ACCOUNT = 'AC6cf7c3f97850bec93ca950e15d934ffa';
const TWILIO_AUTH_TOKEN = '58b41c3a467909dc7b4a3827de7ecba4';


module.exports = {
    ICE_SERVERS,
    TWILIO_ACCOUNT,
    TWILIO_AUTH_TOKEN
};
