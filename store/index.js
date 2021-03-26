import firebase from '~/plugins/firebase'

// stateだけは関数
export const state = () => ({
  loginUser: null,
  results: [],
})

export const mutations = {
  setLoginUser(state, user) {
    state.loginUser = user
  },
}

export const actions = {
  setLoginUser({ commit }, user) {
    commit('setLoginUser', user)
  },
  login() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(googleAuthProvider)
  },
}
