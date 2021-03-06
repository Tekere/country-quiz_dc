<template>
  <div id="index">
    <div v-cloak class="auth-box">
      <div v-if="loginUser">
        <a href="" @click.prevent="$router.push({ name: 'mypage' })"
          ><img :src="loginUser.photoURL" alt=""
        /></a>
      </div>
      <a v-else class="login" @click.prevent="login">ログイン</a>
    </div>
    <div class="index-inner">
      <h1 class="title is-1">COUNTRY QUIZ</h1>
      <img
        v-if="status <= endNum"
        class="decoration"
        src="/images/def.svg"
        alt=""
      />
      <div class="quiz-box">
        <div class="quiz-box-inner">
          <transition mode="out-in">
            <!-- 初期表示 -->
            <div v-if="status === 0" key="init" class="init">
              <h2 class="question title is-2">
                {{ displayQuiz.question }}
              </h2>
              <div class="answers">
                <button
                  v-for="option in displayQuiz.options"
                  :key="option.name"
                  class="button is-medium is-fullwidth"
                  @click="startQuiz(option.name)"
                >
                  {{ option.jaName }}
                </button>
              </div>
            </div>
            <!-- クイズ終了表示 -->
            <div v-else-if="status > endNum" key="finish" class="finished">
              <img src="/images/finish.svg" alt="" />
              <h2 class="question title">FINISH</h2>
              <p class="result">
                あなたは5問中
                <span class="correct-answers">{{ correctAnswers }}</span>
                問正解しました
              </p>
              <button
                class="button is-medium is-fullwidth try-again"
                @click="backMenu"
              >
                メニューに戻る
              </button>
            </div>
            <!-- 質問表示 -->
            <div v-else key="quiz" class="in-progress">
              <div class="progress-wrapper">
                <div ref="meter" class="progress-bar"></div>
              </div>
              <!-- 国旗クイズの場合のみ表示される -->
              <img
                v-if="displayQuiz.flagImageUrl"
                :src="displayQuiz.flagImageUrl"
                class="flag-img"
                alt=""
              />
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
                <button
                  v-if="isExamining"
                  class="next-btn button"
                  @click="continueQuiz"
                >
                  {{ nextBtnText }}
                </button>
                <!-- 回答後はNEXT以外触れなくします -->
                <div v-if="isExamining" class="touch-prevention"></div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

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

function genRandomArray(array, max, withoutNum) {
  while (true) {
    const randomNum = Math.floor(Math.random() * max)
    if (!array.includes(randomNum) && randomNum !== withoutNum) {
      array.push(randomNum)
      break
    }
  }
  return array
}

export default {
  data() {
    return {
      quizzes: [],
      endNum: 5,
      status: 0,
      selectedTypeOfQuiz: null,
      correctAnswers: 0,
      isExamining: false,
    }
  },
  computed: {
    ...mapGetters(['loginUser']),
    displayQuiz() {
      return this.quizzes[this.status]
    },
    nextBtnText() {
      if (this.status === this.endNum) return '結果を見る'
      else return '次へ'
    },
  },
  watch: {
    // クイズが終わったときにログイン済みなら記録をpostする
    status(newValue) {
      if (newValue > this.endNum && this.loginUser) {
        this.addResult({
          uid: this.loginUser.uid,
          typeOfQuiz: this.selectedTypeOfQuiz,
          correctAnswers: this.correctAnswers,
        })
      }
    },
  },
  created() {
    // 初期表示の設問と選択肢
    this.initQuizzes()
  },
  methods: {
    ...mapActions(['login', 'logout']),
    ...mapActions('result', ['addResult']),
    // クイズを進行していくためのメソッド
    continueQuiz() {
      // 選択した回答のハイライト用classをはずす
      const all = this.$refs.answers.querySelectorAll('button')
      all.forEach((el) => {
        el.classList.remove('user-answered')
      })

      // クイズを進める
      this.status++
      this.isExamining = false
    },
    // 回答後に正誤表示を行うメソッド
    examiningAnswer() {
      this.isExamining = true
    },

    // クイズをリセットしてメニューに戻るメソッド
    backMenu() {
      this.status = 0
      this.correctAnswers = 0
      this.initQuizzes()
    },
    // 通信を飛ばして、クイズ作成へ続けるメソッド
    startQuiz(type) {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then((res) => {
          res.data = res.data.filter((el) => {
            return el.translations.ja !== null
          })
          if (type === 'region') {
            this.makeRegionQuiz(res.data)
            this.selectedTypeOfQuiz = 'region'
          } else if (type === 'flag') {
            this.makeFlagQuiz(res.data)
            this.selectedTypeOfQuiz = 'flag'
          }
          this.status = 1
          this.correctAnswers = 0
        })
        .catch((error) => {
          throw new Error(error)
        })
    },

    // 6州クイズを生成するメソッド
    makeRegionQuiz(responseData) {
      let randomNumArray = []
      for (let n = 0; n < 5; n++) {
        randomNumArray = genRandomArray(randomNumArray, DATA_MAX)
      }
      for (let i = 0; i < this.endNum; i++) {
        const country = responseData[randomNumArray[i]]
        const quiz = {
          question: `${country.translations.ja}が属する州はどこですか？`,
          options: regionOptions,
          answer: country.region,
        }
        this.quizzes.push(quiz)
      }
    },
    // 国旗クイズを生成するメソッド
    makeFlagQuiz(responseData) {
      let randomNumArray = []
      for (let n = 0; n < 5; n++) {
        randomNumArray = genRandomArray(randomNumArray, DATA_MAX)
      }

      for (let i = 0; i < this.endNum; i++) {
        // 正解を作成
        const country = responseData[randomNumArray[i]]
        const flagOptions = []
        const flagOption = {
          name: country.name,
          jaName: country.translations.ja,
        }
        // 正解セット
        flagOptions.push(flagOption)

        // 不正解問題作成
        let randomNumArray2 = []
        for (let j = 0; j < 4; j++) {
          randomNumArray2 = genRandomArray(
            randomNumArray2,
            DATA_MAX,
            randomNumArray[i]
          )
          // 不正解問題をセット
          flagOptions.push({
            name: responseData[randomNumArray2[j]].name,
            jaName: responseData[randomNumArray2[j]].translations.ja,
          })
        }
        // 正解が先頭でセットされてしまっているのでsortをかけて分からなくする
        flagOptions.sort((a, b) => {
          if (a.name > b.name) return -1
          else if (a.name < b.name) return 1
          else return 0
        })
        const quiz = {
          flagImageUrl: country.flag,
          question: `この国旗はどこの国のものですか？`,
          options: flagOptions,
          answer: country.name,
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
      this.advanceMeter()
    },
    // クイズの進捗メーターを進めるメソッド
    advanceMeter() {
      const meter = this.$refs.meter
      let percent = 0
      percent += (this.status / this.endNum) * 100
      meter.style.width = percent + '%'
    },
    // quizzesの初期化
    initQuizzes() {
      this.quizzes = []
      const initialQuestions = {
        question: 'どの知識についてクイズをしたいですか？',
        options: [
          {
            name: 'region',
            jaName: '地域区分クイズ',
          },
          {
            name: 'flag',
            jaName: '国旗クイズ',
          },
        ],
      }
      this.quizzes.push(initialQuestions)
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
  position: relative;
  .auth-box {
    display: block;
    position: absolute;
    top: 5px;
    right: 10px;
    padding: 5px 15px;
    @media (max-width: 630px) {
      top: 10px;
      z-index: 10;
    }
    a {
      display: block;
      color: #fff;
      font-size: 1.3rem;
      z-index: 10;
    }
    img {
      display: block;
      width: 65px;
      border-radius: 50%;
      border: 1px solid #e0e0e0;
      @media (max-width: 630px) {
        width: 50px;
      }
    }
  }
  .index-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 60vh;
    max-width: 95vw;
    height: fit-content;
  }
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
.quiz-box {
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
.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
img.decoration {
  position: absolute;
  top: 0;
  right: 0;
  @media (max-width: 630px) {
    display: none;
  }
}
img.flag-img {
  height: 120px;
  display: block;
  margin: 0 auto;
  border: 5px solid lightgray;
  @media (max-width: 630px) {
    height: 80px;
  }
}
.question {
  display: block;
  width: 100%;
  font-size: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 2.5rem;
  color: #2f527b;
  text-align: center;
  @media (max-width: 630px) {
    font-size: 18px;
    margin-bottom: 1.5rem;
  }
}

.answers {
  position: relative;
  .touch-prevention {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: transparent;
  }
  .button {
    &.correct {
      background-color: #60bf88;
      color: #fff;
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 10px;
        background-image: url(/images/true.svg);
        height: 40px;
        width: 40px;
        fill: #fff;
      }
    }
    &.user-answered {
      background-color: #ea8282;
      color: #fff;
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 10px;
        background-image: url(/images/false.svg);
        height: 40px;
        width: 40px;
        fill: #fff;
      }
    }
  }
}
.button {
  width: 450px;
  max-width: 80vw;
  font-family: 'Noto Sans JP';
  border-color: #6066d070;
  color: #6066d0;
  font-weight: 500;
  border-radius: 1rem;
  padding: 1.5vh 20px;
  height: fit-content;
  transition: all 0.3s;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  @media (max-width: 630px) {
    font-size: 14px;
    margin-bottom: 1.2rem;
  }

  &:hover {
    color: #fff;
    background-color: #f9a826;
  }

  &.next-btn {
    width: 45%;
    float: right;
    margin-right: 20px;
  }
}
.progress-wrapper {
  position: relative;
  background-color: #eee;
  height: 0.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  .progress-bar {
    position: absolute;
    width: 0%;
    height: 0.5rem;
    background-color: #00946390;
    transition: all 0.3s linear;
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
    letter-spacing: 0.02em;
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
