<template>
  <div id="container">
    <Nuxt v-if="isLoading" />
    <loading v-else>loading</loading>
  </div>
</template>
<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
import Loading from '@/components/Loading'
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters(['isLoading']),
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const that = this
        new Promise(function (resolve) {
          that.setLoginUser(user)
          resolve()
        })
          .then(function () {
            return new Promise(function (resolve) {
              that.fetchResult(that.loginUser.uid).then(() => {
                resolve()
              })
            })
          })
          .then(function () {
            that.stopLoading()
          })
      } else {
        this.deleteLoginUser()
      }
    })
  },
  methods: {
    ...mapActions(['setLoginUser', 'deleteLoginUser', 'stopLoading']),
    ...mapActions('result', ['fetchResult']),
  },
}
</script>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
#container {
  height: 100vh;
  background: url('/images/background.png');
  background-size: cover;
  font-family: 'Noto Sans JP';
}
</style>
