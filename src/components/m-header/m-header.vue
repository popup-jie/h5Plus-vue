<template>
  <div class="m-header" v-show="!hiddenHTab">
    <!-- <div v-if="type === 1">
      <div class="icon" @click="saoCode"></div>
      <h1 class="text">{{title}}</h1>
    </div>
    <div v-else-if="type === 2">
      <div class="icon" @click="saoCode"></div>
      <h1 class="text">{{title}}</h1>
      <div v-show="text" class="headerText" @click="headerText">
        {{text === 'default' ? '' : text}}
      </div>
    </div> -->
    <div v-if="type === 1">
      <!-- <div class="icon" @click="saoCode"></div> -->
      <h1 class="text">{{title}}</h1>
      <div v-show="text" class="headerText" @click="headerText">
        {{text === 'default' ? '' : text}}
      </div>
    </div>
    <div v-else>
      <div class="lefticon" @click="back"></div>
      <h1 class="text">{{title}}</h1>
      <div v-show="text" class="headerText" @click="headerText">
        {{text === 'default' ? '' : text}}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['hiddenHTab'])
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '菁亭生活馆'
    },
    type: {
      type: Number,
      default: 1
    }
  },
  methods: {
    headerText() {
      this.$emit('headerText')
    },
    saoCode() {
      this.$emit('saoCode')
    },
    back() {
      // this.$router.goBack()
      this.$emit('back')
    }
  }
}
</script>

<style lang="sass" type="text/sass">
  @import "~common/sass/variable"
  @import "~common/sass/mixin"

  .m-header
    background: $white
    height: 44 / $cale + rem
    text-align: center
    color: $text_color
    font-size: 0
    z-index: 10
    box-shadow: 0px 2px 5px #ccc
    position: relative
    width: 100%
    .icon
      @include position(absolute, (top 12/ $cale + rem left 12/ $cale + rem))
      background: url(./saoyisao.png)
      @include size(20/ $cale + rem)
      background-size: 100% 100%
      @include extend-click()
      position: absolute
    .lefticon
      @include extend-click()
      position: absolute
      top: 12/ $cale + rem
      left:  12/ $cale + rem
      +bg-image('./right_icon')
      @include size(10/ $cale + rem,18/ $cale + rem)
      background-size: 100% 100%
      transform: rotate(180deg)
    .text
      display: inline-block
      vertical-align: top
      line-height:  44 / $cale + rem
      font-size: 16/ $cale + rem
    .mine
      position: absolute
      top: 0
      right: 0
    .headerText
      position: absolute
      right: 10/ $cale + rem
      font-size: 14/ $cale + rem
      color: $text_light
      top: 0px
      height:  44 / $cale + rem
      line-height:  44 / $cale + rem
</style>