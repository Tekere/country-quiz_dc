<template>
  <div id="index">
    <div class="index-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <img class="decoration" src="/images/ww.svg" alt="" />
      <div class="quiz-box">
        <div class="quiz-box-inner">
          <h2 class="question title is-2">{{ quiz.question }}</h2>
          <div class="answers">
            <button
              v-for="(choice, index) in quiz.choices"
              :key="index"
              class="button is-medium is-fullwidth"
              @click="choice.startMethod()"
            >
              {{ choice.jaName }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      quiz: {
        question: 'どの知識についてクイズしたいですか？',
        choices: [
          {
            name: 'region',
            jaName: '地域区分クイズ',
            startMethod: this.regionQuizStart,
          },
          {
            name: 'falg',
            jaName: '国旗クイズ',
            startMethod: this.flagQuizStart,
          },
        ],
      },
      status: 0,
    }
  },
  methods: {
    continue() {
      if (this.status > 4) this.finishQuiz()
      this.status++
    },
    finishQuiz() {
      this.status = 0
      console.log('finish')
    },
    regionQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(() => {
          console.log('success')
          this.continue()
        })
        .catch(() => {
          console.log('fail')
        })
      return true
    },
    flagQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(() => {
          console.log('success')
          this.continue()
        })
        .catch(() => {
          console.log('fail')
        })
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
#index {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .index-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: fit-content;
    height: fit-content;
  }
}

.title.is-1 {
  color: #fff;
  margin-bottom: 1em;
  font-size: 2.4rem;
  font-family: 'Poppins';
}
.quiz-box {
  background-color: #fff;
  height: 60vh;
  width: 60vh;
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img.decoration {
  position: absolute;
  top: 0;
  right: 0;
}
.question {
  font-size: 1.5rem;
  margin-bottom: 4rem;
  color: #2f527b;
}
.answers {
}
.button {
  font-family: 'Noto Sans JP';
  border-color: #6066d070;
  color: #6066d0;
  font-weight: 500;
  border-radius: 1rem;
  padding: 20px 20px;
  height: fit-content;
  transition: all 0.3s;
  &:hover {
    color: #fff;
    background-color: #f9a826;
  }
  &:first-child {
    margin-bottom: 2rem;
  }
}
</style>
