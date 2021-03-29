import firebase from '~/plugins/firebase'

export const state = () => ({
  results: [],
})

export const getters = {
  results: (state) => state.results,
}

export const mutations = {
  addResult(state, resultObj) {
    state.results.push(resultObj)
  },
}

export const actions = {
  fetchResult({ commit }, uid) {
    firebase
      .firestore()
      .collection(`users/${uid}/results`)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          commit('addResult', doc.data())
        })
      })
  },

  addResult({ commit }, { uid, typeOfQuiz, correctAnswers }) {
    if (uid) {
      const resultObj = {
        typeOfQuiz,
        correctAnswerCount: correctAnswers,
        createdAt: new Date(),
      }
      firebase.firestore().collection(`users/${uid}/results`).add(
        // 記録時間をサーバー側に任せるパターン
        // {
        //   typeOfQuiz,
        //   correctAnswerCount: correctAnswers,
        //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // }
        resultObj
      )
      // fetchResultsのときにも同じmutationが呼ばれるため配列にして渡す
      commit('addResult', resultObj)
    }
  },
}
