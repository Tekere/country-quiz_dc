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
                v-for="option in initialQuestions.options"
                :key="option.name"
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
              >/5 correct answer
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
            <div ref="answers" class="answers">
              <button
                v-for="(option, index) in displayQuiz.options"
                :key="index"
                class="button is-medium is-fullwidth"
                :class="{
                  correct: isExamining && displayQuiz.answer == option.name,
                }"
                @click="answer(option.name, $event)"
              >
                {{ option.jaName }}
              </button>
              <button v-if="isExamining" @click="continueQuiz">next</button>
            </div>
            <!-- 回答後はNEXT以外触れなくします -->
            <div v-if="isExamining" class="touch-prevention"></div>
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

function genRandomArray(array, max) {
  while (true) {
    const randomNum = Math.floor(Math.random() * max)
    if (!array.includes(randomNum)) {
      array.push(randomNum)
      break
    }
  }
}

export default {
  data() {
    return {
      quizzes: [],
      endNum: 5,
      status: null,
      correctAnswers: null,
      initialQuestions: {},
      isExamining: false,
    }
  },
  computed: {
    displayQuiz() {
      return this.quizzes[this.status]
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
          startMethod: this.fetchQuiz,
        },
        {
          name: 'falg',
          jaName: '国旗クイズ',
          startMethod: this.fetchQuiz,
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
      // 選択した回答のハイライト用classをはずす
      const all = this.$refs.answers.querySelectorAll('button')
      console.log(all)
      all.forEach((el) => {
        el.classList.remove('user-answered')
      })

      // クイズを進める
      this.isExamining = false
      this.status++
    },
    // 回答後に正誤表示を行うメソッド
    examiningAnswer() {
      this.isExamining = true
    },

    // クイズをリセットしてメニューに戻るメソッド
    backMenu() {
      this.initialQuestions = { ...this.initialQuestions }
      this.status = null
      this.correctAnswers = null
      this.quizzes = []
    },
    // 通信を飛ばして、クイズ作成へ続けるメソッド
    fetchQuiz() {
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

    // 6州クイズを生成するメソッド
    makeQuiz(responseData) {
      const randomNumArray = []
      for (let i = 0; i < this.endNum; i++) {
        genRandomArray(randomNumArray, DATA_MAX) // 重複なし乱数の配列を作成
        const country = responseData[randomNumArray[i]]
        const quiz = {
          question: `${country.translations.ja}が属する州はどこですか？`,
          options: regionOptions,
          answer: country.region,
        }
        this.quizzes.push(quiz)
      }
    },
    // ユーザーがクイズに回答したときのメソッド
    answer(userAnswer, e) {
      // 選択した答えをハイライトさせる処理
      e.target.classList.add('user-answered')
      // 正解したらカウントして正誤表示を行う
      if (userAnswer === this.displayQuiz.answer) this.correctAnswers++
      this.examiningAnswer()
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
  height: 80vh;
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
.in-progress {
  position: relative;
  .touch-prevention {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 58vh;
    z-index: 100;
    background-color: transparent;
  }
}
.answers {
  .button {
    &.correct {
      background-color: #60bf88;
      color: #fff;
    }
    &.user-answered {
      background-color: #f9a826;
      color: #fff;
    }
  }
}
.button {
  width: 450px;
  font-family: 'Noto Sans JP';
  border-color: #6066d070;
  color: #6066d0;
  font-weight: 500;
  border-radius: 1rem;
  padding: 1.8vh 20px;
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
    text-align: center;
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
