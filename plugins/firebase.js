import firebase from 'firebase'

const config = {
  projectId: process.env.FIREBASE_PROJECT_ID,
}

// 2重に初期化が行われるのを防ぐ
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
