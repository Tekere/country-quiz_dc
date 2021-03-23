import firebase from '~/plugins/firebase'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const resultsRef = db.collection('results')

export const state = () => ({
  results: [],
})

export const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    // stateのresultsにresultRefの参照先データがバインドされる
    bindFirestoreRef('results', resultsRef)
  }),
  add: firestoreAction((context, result) => {
    // 渡ってきたresultが数値であれば resultRefの参照先にデータを追加する
    if (!isNaN(result)) {
      resultsRef.add({
        result: result,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
    }
  }),
}
