import firebase from '~/plugins/firebase'

export const state = () => ({
  loginUser: null,
})

export const getters = {
  loginUser: (state) => state.loginUser,
}

export const mutations = {
  setLoginUser(state, user) {
    const { uid, email, displayName, photoURL } = user
    state.loginUser = { uid, email, displayName, photoURL }
  },
  deleteLoginUser(state) {
    state.loginUser = null
  },
}

export const actions = {
  setLoginUser({ commit }, user) {
    commit('setLoginUser', user)
  },
  deleteLoginUser({ commit }) {
    commit('deleteLoginUser')
  },
  login() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(googleAuthProvider)
  },
  logout({ commit }) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        commit('deleteLoginUser')
        this.$router.push('/')
      })
  },
}
