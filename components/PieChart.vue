<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  props: ['results'],
  data() {
    return {
      chartdata: {
        labels: ['地域区分', '国旗'],
        datasets: [
          {
            label: ['Data One'],
            backgroundColor: ['#f87979', '#e0e0e0'],
            data: [40, 30],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  mounted() {
    this.countTypeOfQuiz()
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
    countTypeOfQuiz() {
      console.log(this.results)
      const res = this.results.reduce(
        (acc, el) => {
          console.log('hesalwsasalo')
          if (el.typeOfQuiz === 'flag') acc.flagCount++
          if (el.typeOfQuiz === 'region') acc.regionCount++
          return acc
        },
        { regionCount: 0, flagCount: 0 }
      )
      this.chartdata.datasets.data[0] = res.regionCount
      this.chartdata.datasets.data[0] = res.flagCount
      console.log(res)
    },
  },
}
</script>
