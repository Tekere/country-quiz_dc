<template>
  <div>
    <div class="fullview">
      <div class="loading-spacer"></div>
      <vue-loading
        type="spin"
        color="#aaa"
        :size="{ width: '70px', height: '70px' }"
      >
      </vue-loading>
    </div>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'

export default {
  name: 'Loading',
  components: {
    VueLoading,
  },
}
</script>

<style>
.fullview {
  width: 100%;
  height: 100%;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-spacer {
  height: 30%;
}
</style>
