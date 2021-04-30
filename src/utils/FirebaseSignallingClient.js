import firebase from 'firebase/app';
import 'firebase/database';

export default class FirebaseSignallingClient {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDI6MdBASkgWXc7J16dkd-bMZGDo2HIVV8",
      authDomain: "webrtc-react-firebase-app.firebaseapp.com",
      databaseURL: "https://webrtc-react-firebase-app-default-rtdb.firebaseio.com",
      projectId: "webrtc-react-firebase-app",
      storageBucket: "webrtc-react-firebase-app.appspot.com",
      messagingSenderId: "894373219287",
      appId: "1:894373219287:web:e1220098c2185b6c6c9992"
    };
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
    this.database = firebase.database();
    this.localPeerName = '';
    this.removePeerName = '';
  }

  // ペア名を登録
  setPeerNames(localPeerName, remotePeerName) {
    this.localPeerName = localPeerName;
    this.remotePeerName = remotePeerName;
  }

  // targerRefを取得
  get targetRef() {
    return this.database.ref(this.remotePeerName);
  }

  // offer情報の登録
  async sendOffer(sessionDescription) {
    await this.targetRef.set({
      type: 'offer',
      sender: this.localPeerName,
      sessionDescription,
    });
  }

  // answer情報の登録
  async sendAnswer(sessionDescription) {
    await this.targetRef.set({
      type: 'answer',
      sender: this.localPeerName,
      sessionDescription,
    });
  }

  // candidate情報の登録
  async sendCandidate(candidate) {
    await this.targetRef.set({
      type: 'candidate',
      sender: this.localPeerName,
      candidate,
    })
  }

  // アプリが起動する度にDBの中身を初期化
  async remove(path) {
    await this.database.ref(path).remove();
  }
}
