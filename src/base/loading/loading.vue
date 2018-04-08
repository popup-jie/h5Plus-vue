<template>
  <div class="loading">
    <img src="./loading.gif" alt="" width="24" height="24">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="sass" scoped>
.loading
  width: 100%
  text-align: center
  padding-bottom: 10px
  .desc
    line-height: 20px
    font-size: 12px
    color: black
</style>
