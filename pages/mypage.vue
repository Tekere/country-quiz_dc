<template>
  <div id="mypage">
    <a class="logout" @click.prevent="logout">ログアウト</a>
    <div class="mypage-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <div class="mypage-box">
        <div class="user-info">
          <div v-if="loginUser">
            <img :src="loginUser.photoURL" alt="" />
            <p>{{ loginUser.displayName }}</p>
          </div>
        </div>
        <div class="results">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>日付</th>
                <th>挑戦したクイズ</th>
                <th>結果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in results" :key="result.nanoseconds">
                <td>{{ result.createdAt.seconds | convertCreatedAt }}</td>
                <td>{{ result.typeOfQuiz | convertTypeOfQuiz }}</td>
                <td>{{ result.correctAnswerCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('result', ['results']),
  },
  created() {
    if (this.loginUser) {
      this.fetchResult(this.loginUser.uid)
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions(['logout']),
    ...mapActions('result', ['fetchResult', 'addResult']),
  },
  filters: {
    convertCreatedAt(val) {
      let dateTime = new Date(val * 1000)
      dateTime = moment(dateTime).format('YYYY-MM-DD')
      return dateTime
    },
    convertTypeOfQuiz(val) {
      if (val === 'region') return '地域区分クイズ'
      else if (val === 'flag') return '国旗クイズ'
      else return 'error'
    },
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
  .logout {
    color: #fff;
    font-size: 1.3rem;
    position: absolute;
    top: 5px;
    right: 10px;
  }
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
  .results {
    width: 100%;
    overflow-y: auto;

    table {
      width: 100%;
      th,
      td {
        padding-left: 0.5rem;
        font-weight: normal;
      }
    }
  }
}
</style>
