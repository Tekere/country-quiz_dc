import firebase from 'firebase'

const apiKey = process.env.FIREBASE_API_KEY

// 2重に初期化が行われるのを防ぐ
console.log(apiKey)
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey,
    authDomain: 'country-quiz-3eb1e.firebaseapp.com',
    projectId: 'country-quiz-3eb1e',
    storageBucket: 'country-quiz-3eb1e.appspot.com',
    messagingSenderId: '733358701177',
    appId: '1:733358701177:web:3bf806a23fa622140ef2a8',
    measurementId: 'G-F8ND3JD0DB',
  })
}

export default firebase
