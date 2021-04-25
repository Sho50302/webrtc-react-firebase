export default class RtcClient {
  constructor(setRtcClient) {
    const config = {
      iceServer: [{ urls: 'stun:stun.stunprotocol.org' }],
    }
    this.rtcPeerConnection = new RTCPeerConnection(config);
    this.localPeerName = '';
    this.remotePeerName = '';
    this._setRtcClient = setRtcClient;
    this.mediaStream = null;
  }

  setRtcClient() {
    this._setRtcClient(this);
  }

  async getUserMedia() {
    try {
      const constraints = { audio: true, video: true };
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch(error) {
      console.log(error);
    }
  }

  startListning(localPeerName) {
    this.localPeerName = localPeerName;
    this.setRtcClient();
  }
}
