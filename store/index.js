import firebase from '~/plugins/firebase'

// stateだけは関数
export const state = () => {}
export const mutations = {}
export const actions = {
  login() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(googleAuthProvider)
  },
}
