<template>
  <div id="index">
    <div class="index-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <img class="decoration" src="/images/ww.svg" alt="" />
      <div class="quiz-box">
        <div class="quiz-box-inner">
          <!-- 初期表示 -->
          <div v-if="status === 0" class="init">
            <h2 class="question title is-2">
              {{ initialQuestions.question }}
            </h2>
            <div class="answers">
              <button
                v-for="(option, index) in initialQuestions.options"
                :key="index"
                class="button is-medium is-fullwidth"
                @click="option.startMethod()"
              >
                {{ option.jaName }}
              </button>
            </div>
          </div>
          <!-- クイズ終了表示 -->
          <div v-else-if="status > endNum">
            <h2 class="question title is-2">FINISH</h2>
            <h2>{{ correctAnswers }}</h2>
          </div>
          <!-- 質問表示 -->
          <div v-else class="in-progress">
            <h2 class="question title is-2">
              {{ displayQuiz.question }}
            </h2>
            <div class="answers">
              <button
                v-for="(option, index) in displayQuiz.options"
                :key="index"
                class="button is-medium is-fullwidth"
                @click="answer(option.name)"
              >
                {{ option.jaName }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const regionOptions = [
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
]
export default {
  data() {
    return {
      quiz: [],
      endNum: 5,
      status: 0,
      correctAnswers: 0,
      initialQuestions: {},
    }
  },
  computed: {
    displayQuiz() {
      return this.quiz[this.status]
    },
  },
  created() {
    // 初期表示の設問と選択肢
    // startMethodで thisを使いたいのでここに書くしかない？
    this.initialQuestions = {
      question: 'どの知識についてクイズをしたいですか？',
      options: [
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
  },
  methods: {
    // クイズを進行していくためのメソッド
    continueQuiz() {
      this.status++
      if (this.status > this.endNum + 1) this.finishQuiz()
    },
    //  クイズを終了させるメソッド
    finishQuiz() {
      this.status = 0
      console.log('finish')
    },
    // ５大州クイズをスタートさせるメソッド
    regionQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then((res) => {
          this.makeQuiz(res.data)
          this.continueQuiz()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 国旗クイズをスタートさせるメソッド
    flagQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then((res) => {
          this.makeQuiz(res.data)
          this.continueQuiz()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // クイズを生成するメソッド
    makeQuiz(responseData) {
      for (let i = 1; i < this.endNum; i++) {
        const country = responseData[i]
        console.log(country)
        const quiz = {
          question: `${country.translations.ja}が属する州はどこですか？`,
          options: regionOptions,
          answer: country.region,
        }

        this.quiz.push(quiz)
      }
    },
    // ユーザーがクイズに回答したときのメソッド
    answer(userAnswer) {
      if (userAnswer === this.displayQuiz.answer) {
        console.log('picon')
        this.continueQuiz()
      } else {
        console.log('bubu')
      }
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
