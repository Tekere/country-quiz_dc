<template>
  <div id="index">
    <div class="index-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <img class="decoration" src="/images/ww.svg" alt="" />
      <div class="quiz-box">
        <div class="quiz-box-inner">
          <h2 class="question title is-2">{{ displayQuiz.question }}</h2>
          <div class="answers">
            <button
              v-for="(choice, index) in displayQuiz.choices"
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

// const JA_REAGION_ = {
//   Asia: 'アジア州',
//   Africa: 'アフリカ州',
//   Europe: 'ヨーロッパ州',
//   Americas: 'アメリカ州',
//   Oceania: 'オセアニア州'
// }
export default {
  data() {
    return {
      quiz: [],
      status: 0,
      endNum: 5,
    }
  },
  computed: {
    displayQuiz() {
      return this.quiz[this.status]
    },
  },
  created() {
    const initialQuiz = {
      question: 'どの知識についてクイズをしたいですか？',
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
    }
    this.quiz.push({ ...initialQuiz })
  },
  methods: {
    continue() {
      this.status++
      if (this.status > this.endNum) this.finishQuiz()
    },
    finishQuiz() {
      this.status = 0
      console.log('finish')
    },
    regionQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then((res) => {
          this.makeQuiz(res.data)
          this.continue()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    flagQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then((res) => {
          this.makeQuiz(res.data)
          this.continue()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    makeQuiz(responseData) {
      console.log(responseData)
      const country = []
      for (let i = 0; i < this.endNum; i++) {
        country.push(responseData[i])
      }
      console.log(country)
      const quiz = {
        question: `~~が属する州はどこですか？`,
        choices: [
          {
            name: 'Asia',
            jaName: 'アジア州',
          },
          {
            name: 'Africa',
            jaName: 'アフリカ州',
          },
          {
            name: 'Americas',
            jaName: 'アメリカ州',
          },
          {
            name: 'Oceania',
            jaName: 'オセアニア州',
          },
          {
            name: 'Europe',
            jaName: 'ヨーロッパ州',
          },
        ],
      }
      this.quiz.push(quiz)
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
    width: 60vh;
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
  height: 74vh;
  width: 100%;
  padding: 5rem 2rem 0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
img.decoration {
  position: absolute;
  top: 0;
  right: 0;
}
.question {
  display: block;
  width: 100%;
  font-size: 1.5rem;
  margin-bottom: 4rem;
  color: #2f527b;
  text-align: center;
}
.answers {
}
.button {
  width: 450px;
  font-family: 'Noto Sans JP';
  border-color: #6066d070;
  color: #6066d0;
  font-weight: 500;
  border-radius: 1rem;
  padding: 20px 20px;
  height: fit-content;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
  &:hover {
    color: #fff;
    background-color: #f9a826;
  }
  &:first-child {
  }
}
</style>
