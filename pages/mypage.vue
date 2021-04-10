<template>
  <div id="mypage">
    <div class="nav">
      <router-link to="/">TOP</router-link>
      <a class="logout" @click.prevent="logout">ログアウト</a>
    </div>
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
                <td>{{ result.correctAnswerCount }}/5</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="graf-box">
          <div class="pie">
            <pie-chart :count-type-of-quiz="countTypeOfQuiz"></pie-chart>
          </div>
          <div class="average">
            <h4>平均</h4>
            <p>{{ averageOfCorrectAnswers }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import PieChart from '@/components/PieChart'
export default {
  components: {
    PieChart,
  },
  data() {
    return {
      typeOfQuizObj: null,
    }
  },
  computed: {
    ...mapGetters(['loginUser']),
    ...mapGetters('result', [
      'results',
      'countTypeOfQuiz',
      'averageOfCorrectAnswers',
    ]),
  },
  created() {
    if (!this.loginUser) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions(['logout']),
    ...mapActions('result', ['fetchResult', 'addResult']),
  },
  filters: {
    convertCreatedAt(val) {
      const dateTime = moment.unix(val).format('YYYY/M/D')
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
  .nav {
    color: #fff;
    font-size: 1.3rem;
    display: flex;
    position: absolute;
    top: 5px;
    right: 10px;
    @media (max-width: 630px) {
      font-size: 12px;
      right: 0px;
    }
    a {
      color: #fff;
      margin-right: 20px;
    }
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
    @media (max-width: 630px) {
      font-size: 24px;
    }
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
    @media (max-width: 630px) {
      padding: 2rem 2rem 0;
    }
  }
  .user-info {
    height: 145px;
    text-align: center;
    mask-position: 2rem;
    img {
      width: 90px;
      border-radius: 50%;
      border: 1px solid #e0e0e0;
      @media (max-width: 630px) {
        width: 70px;
      }
    }
    p {
      padding-top: 0.5rem;
      font-size: 1.5rem;
    }
  }
  .results {
    width: 100%;
    overflow-y: auto;
    height: 30vh;

    table {
      width: 100%;
      @media (max-width: 630px) {
        font-size: 13px;
      }
      th,
      td {
        padding-left: 0.5rem;
        font-weight: normal;
      }
    }
  }
  .graf-box {
    display: flex;
    width: 100%;
    @media (max-width: 630px) {
      height: 250px;
    }
    & > div {
      width: 50%;
    }
    .average {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      h4 {
        position: absolute;
        top: 20%;
        font-size: 1.5rem;
      }
      p {
        color: #6fcf97;
        font-weight: 700;
        font-size: 2.5rem;
      }
    }
  }
  #pie-chart {
    @media (max-width: 630px) {
      height: 290px !important;
      width: auto !important;
    }
  }
}
</style>
