export default class RtcClient {
  constructor() {
    const config = {
      iceServer: [{ urls: 'stun:stun.stunprotocol.org' }],
    }
    this.rtcPeerConnection = new RTCPeerConnection(config);
    this.localPeerName = '';
    this.remotePeerName = '';
  }
}
