<template>
  <div>
    <div class="home-list-title" v-if="titleNum === 1">
      {{title}}
      <span class="icon_right fr" @click="more">更多</span>
    </div>
    <div class="home-list-title home-list-title_other" v-else-if="titleNum === 2">
      {{title}}
    </div>
    <div class="home-list-banner" v-show="bannerUrl" :style="Url" @click="bannerClick"></div>
  </div>
</template>

<script>
export default {
  props: {
    bannerUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '标题1'
    },
    titleNum: {
      type: Number,
      default: 1
    }
  },
  computed: {
    Url() {
      return { backgroundImage: `url(${this.bannerUrl})` }
    }
  },
  methods: {
    more() {
      this.$emit('moreClick')
    },
    bannerClick() {
      this.$emit('bannerClick')
    }
  }
}
</script>

<style lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
.home-list-title
  padding: 10 / $cale + rem
  position: relative
  font-size: 16 / $cale + rem
  color: #333
  font-weight: bold
  background: #fff
  .icon_right
    position: relative
    padding-right: 0.5rem
    font-size: 14 / $cale + rem
    &:after
      +bg-image('./right_icon')
      position: absolute
      right: 0.2rem
      background-size: 100% 100%
      width: 6 / $cale + rem
      height: 10.5 / $cale + rem
      content: ' '
      top: 0.05rem
  &.home-list-title_other
    text-align: center
  &.home-list-title_other::before
    position: absolute
    background: #000
    width: 0.4rem
    height: 1px
    top: 50%
    margin-top: -1px
    content: ' '
    margin-left: -0.5rem
  &.home-list-title_other::after
    position: absolute
    background: #000
    width: 0.4rem
    height: 1px
    top: 50%
    margin-top: -1px
    content: ' '
    margin-left: 0.1rem
.home-list-banner
  background-position: center
  background-size: cover
  height: 126 / $cale + rem
  width: 100%
  margin-bottom: 9 / $cale + rem
</style>
