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
    if (res) return (res / state.results.length).toFixed(2)
    else return 0
  },
}

export const mutations = {
  addResult(state, result) {
    // ascで古い順にcommitされていく & 一時的にstateに入れるものは最新なのでunshiftを使う
    state.results.unshift(result)
  },
}

export const actions = {
  fetchResult({ commit }, uid) {
    return new Promise(function (resolve) {
      firebase
        .firestore()
        .collection(`users/${uid}/results`)
        .orderBy('createdAt', 'asc')
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
      const targetDate = new Date()
      const resultObj = {
        typeOfQuiz,
        correctAnswerCount: correctAnswers,
        createdAt: targetDate,
      }
      firebase.firestore().collection(`users/${uid}/results`).add(resultObj)
      commit('addResult', resultObj)
    }
  },
}
