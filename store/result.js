import firebase from '~/plugins/firebase'

export const state = () => ({
  results: [],
})

export const getters = {}

export const mutations = {
  addResult(correctAnswers) {
    // state.results.push(correctAnswers)
    console.log(correctAnswers)
  },
}

export const actions = {
  addResult({ commit }, { uid, correctAnswers }) {
    if (uid)
      firebase.firestore().collection(`users/${uid}/results`).add({
        correctAnswerCount: correctAnswers,
      })
    commit('addResult', correctAnswers)
  },
}
