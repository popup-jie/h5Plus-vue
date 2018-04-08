<template>
  <transition name="fade">
    <div class="toastBG" v-show="toastshow">
      <div class="toast-wrapper" ref="toast">
        {{title || toastMsg}}
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    toastshow() {
      return this.toastMsg ? true : false
    },
    ...mapGetters(['toastMsg'])
  },
  watch: {
    toastMsg(newVal) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setToastMsg('')
      }, 1500)
    }
  },
  methods: {
    ...mapMutations({
      setToastMsg: 'SET_TOAST_MSG'
    })
  }
}
</script>

<style type="text/sass" lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
.toastBG
  @include position(fixed, (top 0 left 0 right 0 bottom 0))
  @include size(100%)
  z-index: 9999
  &.fade-enter-active, &.fade-leave-active
    transition: 0.4s all
  &.fade-enter, &.fade-leave-to
    opacity: 0

.toast-wrapper
  //@include center(null, null)
  //width: 100px
  position: absolute
  left: 50%
  top: 50%
  transform: translate(-50%,-50%)
  line-height: 20px
  padding: 10px
  background: rgba(0, 0, 0, 0.7)
  border-radius: 20px
  color: $white
  font-size: 14px
  text-align: center
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
</style>


