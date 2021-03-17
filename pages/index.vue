<template>
  <div id="index">
    <div class="index-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <img
        v-if="status < endNum"
        class="decoration"
        src="/images/def.svg"
        alt=""
      />
      <div class="quiz-box">
        <div class="quiz-box-inner">
          <!-- 初期表示 -->
          <div v-if="status === null" class="init">
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
          <div v-else-if="status >= endNum" class="finished">
            <img src="/images/finish.svg" alt="" />
            <h2 class="question title">FINISH</h2>
            <p class="result">
              You got <span class="correct-answers">{{ correctAnswers }}</span
              >/10 correct answer
            </p>
            <button
              class="button is-medium is-fullwidth try-again"
              @click="backMenu"
            >
              メニューに戻る
            </button>
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

const DATA_MAX = 200 // APIのデータ上限
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
      status: null,
      correctAnswers: null,
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
    const initialQuestions = {
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
    this.initialQuestions = { ...initialQuestions }
  },
  methods: {
    // クイズをスタート状態にするためのメソッド
    startQuiz() {
      // 進行状態ステータスと正解数を0で初期化する
      this.status = 0
      this.correctAnswers = 0
    },
    // クイズを進行していくためのメソッド
    continueQuiz() {
      this.status++
    },

    // クイズをリセットしてメニューに戻るメソッド
    backMenu() {
      this.initialQuestions = { ...this.initialQuestions }
      this.status = null
      this.correctAnswers = null
      this.quiz = []
    },
    // ５大州クイズをスタートさせるメソッド
    regionQuizStart() {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then((res) => {
          this.makeQuiz(res.data)
          this.startQuiz()
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
          this.startQuiz()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // クイズを生成するメソッド
    makeQuiz(responseData) {
      for (let i = 1; i <= this.endNum; i++) {
        const randomNum = Math.floor(Math.random() * DATA_MAX)
        console.log(randomNum)
        const country = responseData[randomNum]

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
      if (userAnswer === this.displayQuiz.answer) this.correctAnswers++
      this.continueQuiz()
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
  margin: 0 auto;
  margin-bottom: 1.5rem;

  &:hover {
    color: #fff;
    background-color: #f9a826;
  }
  &:first-child {
  }
}
// finish画面
.finished {
  img {
    display: block;
    margin: 0 auto;
  }
  .result {
    font-size: 1.5rem;
    color: #2f527b;
  }
  .correct-answers {
    color: #6fcf97;
    font-weight: 700;
    font-size: 2.5rem;
  }
  .try-again {
    margin-top: 10vw;
  }
}
</style>
