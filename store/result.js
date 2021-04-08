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
    state.results.push(result)
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
          const result = []
          snapshot.forEach((doc) => {
            result.push(doc.data())
          })
          result.sort((a, b) => {
            if (a.createdAt.seconds > b.createdAt.seconds) return -1
            if (a.createdAt.seconds < b.createdAt.seconds) return 1
            return 0
          })
          result.forEach((el) => {
            commit('addResult', el)
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
        // createdAt: targetDate,
        createdAt: {
          seconds: targetDate.getTime() / 1000,
        },
      }
      firebase.firestore().collection(`users/${uid}/results`).add(resultObj)
      commit('addResult', {
        typeOfQuiz,
        correctAnswerCount: correctAnswers,
        createdAt: {
          seconds: targetDate.getTime() / 1000,
        },
      })
    }
  },
}
