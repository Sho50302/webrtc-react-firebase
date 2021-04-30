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

  // offerの処理
  async offer() {
    const sessionDescription = await this.createOffer();
    await this.setLocalDescription(sessionDescription);
    await this.sendOffer();
  }

  // offerの作成
  async createOffer() {
    try {
      return await this.rtcPeerConnection.createOffer();
    } catch (e) {
      console.error(e);
    }
  }

  // localDescriptionの設定
  async setLocalDescription(sessionDescription) {
    try {
      await this.rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (e) {
      console.error(e);
    }
  }

  // firebaseにofferの送信
  async sendOffer() {
    this.firebaseSignallingClient.setPeerNames(
      this.localPeerName,
      this.remotePeerName
    );

    await this.firebaseSignallingClient.sendOffer(this.localDescription);
  }

  // リモート側の映像trackの設定
  setOntrack() {
    this.rtcPeerConnection.ontrack = (rtcTrackEvent) => {
      if (rtcTrackEvent.track.kind !== 'video') return;
      const remoteMediaStream = rtcTrackEvent.streams[0];
      this.remoteVideoRef.current.srcObject = remoteMediaStream;
      this.setRtcClient();
    }

    this.setRtcClient();
  }

  // answerの処理
  async answer(sender, sessionDescription) {
    try {
      this.remotePeerName = sender;
      this.setOnicecandidateCallback();
      this.setOntrack();
      await this.setRemoteDescription(sessionDescription);
      const answer = await this.rtcPeerConnection.createAnswer();
      await this.rtcPeerConnection.setLocalDescription(answer);
      await this.sendAnswer();
    } catch (e) {
      console.error(e);
    }
  }

  // リモート側との通信を行う
  async connect(remotePeerName) {
    this.remotePeerName = remotePeerName;
    this.setOnicecandidateCallback();
    this.setOntrack();
    await this.offer();
    this.setRtcClient();
  }

  // remoteDescriptionの設定
  async setRemoteDescription(sessionDescription) {
    await this.rtcPeerConnection.setRemoteDescription(sessionDescription);
  }

  // firebaseにanswerの送信
  async sendAnswer() {
    this.firebaseSignallingClient.setPeerNames(
      this.localPeerName,
      this.remotePeerName
    );
    await this.firebaseSignallingClient.sendAnswer(this.localDescription);
  }

  // 受信したsessionDescriptionを保存
  async saveReceivedSessionDescription(sessionDescription) {
    try {
      await this.setRemoteDescription(sessionDescription);
    } catch (e) {
      console.error(e);
    }
  }

  // sessionDescriptionをJSON形式で取得
  get localDescription() {
    return this.rtcPeerConnection.localDescription.toJSON();
  }

  // candidateを追加する
  async addIceCandidate(candidate) {
    try {
      const iceCandidate = new RTCIceCandidate(candidate);
      await this.rtcPeerConnection.addIceCandidate(iceCandidate);
    } catch (e) {
      console.error(e);
    }
  }

  // 通信経路情報をfirebase側に送信する
  setOnicecandidateCallback() {
    this.rtcPeerConnection.onicecandidate = async ({ candidate }) => {
      if (candidate) {
        console.log({ candidate });
        await this.firebaseSignallingClient.sendCandidate(candidate.toJSON());
      }
    }
  }

  // 通信開始
  async startListning(localPeerName) {
    this.localPeerName = localPeerName;
    this.setRtcClient();
    await this.firebaseSignallingClient.remove(localPeerName);
    this.firebaseSignallingClient.database
    .ref(localPeerName)
    .on('value', async (snapshot) => {
      const data = snapshot.val();
      if (data === null) return;
      console.log({ data });

      const { candidate, sender, sessionDescription, type } = data;
      switch (type) {
        case 'offer':
          await this.answer(sender, sessionDescription);
          break;
        case 'answer':
          await this.saveReceivedSessionDescription(sessionDescription);
          break;
        case 'candidate':
          await this.addIceCandidate(candidate);
          break;
        default:
          this.setRtcClient();
          break;
      }
    });
  }
}
