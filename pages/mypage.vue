<template>
  <div id="mypage">
    <div class="mypage-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <div class="mypage-box">
        <div class="user-info">
          <div v-if="loginUser">
            <img :src="loginUser.photoURL" alt="" />
            <p>{{ loginUser.displayName }}</p>
          </div>
        </div>
        <div class="recently-results"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['loginUser']),
    // ...mapGetters('result', ['results']),
  },
  mounted() {
    this.fetchResult(this.loginUser.uid)
  },
  methods: {
    ...mapActions('result', ['fetchResult', 'addResult']),
  },
}
</script>
<style lang="scss">
#mypage {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .mypage-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 60vh;
    max-width: 95vw;
    height: fit-content;
  }
  .title.is-1 {
    color: #fff;
    margin-bottom: 1em;
    font-size: 2.4rem;
    font-family: 'Poppins';
  }
  .mypage-box {
    background-color: #fff;
    height: 85vh;
    width: 100%;
    padding: 4rem 2rem 0;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user-info {
    height: 145px;
    text-align: center;
    mask-position: 2rem;
    img {
      width: 90px;
      border-radius: 50%;
      border: 1px solid #e0e0e0;
    }
    p {
      padding-top: 0.5rem;
      font-size: 1.5rem;
    }
  }
  .recently-results {
    overflow-y: auto;
  }
}
</style>
