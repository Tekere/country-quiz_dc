import firebase from '~/plugins/firebase'

export const state = () => ({
  loginUser: null,
  isLoading: false,
})

export const getters = {
  loginUser: (state) => state.loginUser,
  isLoading: (state) => state.isLoading,
}

export const mutations = {
  setLoginUser(state, user) {
    const { uid, email, displayName, photoURL } = user
    state.loginUser = { uid, email, displayName, photoURL }
  },
  deleteLoginUser(state) {
    state.loginUser = null
  },
  stopLoading(state) {
    state.isLoading = true
  },
}

export const actions = {
  setLoginUser({ commit }, user) {
    commit('setLoginUser', user)
    commit('stopLoading')
  },
  deleteLoginUser({ commit }) {
    commit('deleteLoginUser')
    commit('stopLoading')
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
