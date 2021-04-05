import firebase from '~/plugins/firebase'

export const state = () => ({
  results: [],
})

export const getters = {
  results: (state) => state.results,
  countTypeOfQuiz: (state) => {
    const res = state.results.reduce(
      (acc, el) => {
        if (el.typeOfQuiz === 'flag') acc.flagCount++
        if (el.typeOfQuiz === 'region') acc.regionCount++
        return acc
      },
      { regionCount: 0, flagCount: 0 }
    )
    return res
  },
  averageOfCorrectAnswers: (state) => {
    const res = state.results.reduce((acc, el) => {
      acc += el.correctAnswerCount
      return acc
    }, 0)
    return res / state.results.length
  },
}

export const mutations = {
  addResult(state, resultObj) {
    state.results.push(resultObj)
  },
}

export const actions = {
  fetchResult({ commit }, uid) {
    return new Promise(function (resolve) {
      firebase
        .firestore()
        .collection(`users/${uid}/results`)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            commit('addResult', doc.data())
          })
        })
        .then(() => {
          resolve()
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
