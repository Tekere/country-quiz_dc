<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  props: ['countTypeOfQuiz'],
  data() {
    return {
      chartdata: {
        labels: ['地域区分', '国旗'],
        datasets: [
          {
            label: ['Data One'],
            backgroundColor: ['#f87979', '#87cefa'],
            data: [
              this.countTypeOfQuiz.regionCount,
              this.countTypeOfQuiz.flagCount,
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  watch: {},
  mounted() {
    this.renderChart(this.chartdata, this.options)
  },
}
</script>
