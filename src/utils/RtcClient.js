import FirebaseSignallingClient from './FirebaseSignallingClient';

// RtcClientクラス
export default class RtcClient {
  constructor(remoteVideoRef, setRtcClient) {
    const config = {
      iceServer: [{ urls: 'stun:stun.stunprotocol.org' }],
    }
    this.rtcPeerConnection = new RTCPeerConnection(config);
    this.firebaseSignallingClient = new FirebaseSignallingClient();
    this.localPeerName = '';
    this.remotePeerName = '';
    this.remoteVideoRef = remoteVideoRef;
    this._setRtcClient = setRtcClient;
    this.mediaStream = null;
  }

  // RtcClientの値を更新
  setRtcClient() {
    this._setRtcClient(this);
  }

  // mediaStreamを非同期で取得
  async getUserMedia() {
    try {
      const constraints = { audio: true, video: true };
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch(error) {
      console.log(error);
    }
  }

  // mediaStreamの初期設定
  async setMediaStream() {
    await this.getUserMedia();
    this.addTracks();
    this.setRtcClient();
  }

  // 各Trackの取得
  addTracks() {
    this.addAudioTrack();
    this.addVideoTrack();
  }

  // mediaStreamに音声Trackの追加
  addAudioTrack() {
    this.rtcPeerConnection.addTrack(this.audioTrack, this.mediaStream);
  }

  // mediaStreamに映像Trackの追加
  addVideoTrack() {
    this.rtcPeerConnection.addTrack(this.videoTrack, this.mediaStream);
  }

  // 音声の取得
  get audioTrack() {
    return this.mediaStream.getAudioTracks()[0];
  }

  // 映像の取得
  get videoTrack() {
    return this.mediaStream.getVideoTracks()[0];
  }

  // Listen時の初期設定
  startListning(localPeerName) {
    this.localPeerName = localPeerName;
    this.setRtcClient();
    this.firebaseSignallingClient.database
    .ref(localPeerName)
    .on('value', (snapshot) => {
      const data = snapshot.val();
    });
  }
}
