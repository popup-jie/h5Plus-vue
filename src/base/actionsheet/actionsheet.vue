<template>
  <transition name="fade">
    <div class="actionsheet-wrapper" v-show="showFlag" @click="hide">
      <div class="actionsheet" @click.stop>
        <ul class="sheet-list">
          <li class="sheet-item" v-for="(item,index) in actions" @click="sheetItem(index)">
            <span>{{item}}</span>
          </li>
        </ul>
        <ul class="sheet-list">
          <li class="sheet-item" @click="cancel">
            <span class="">取消</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    actions: {
      type: Array,
      default: []
    }
  },
  data(){
    return {
      showFlag: false
    }
  },
  methods: {
    show(){
      this.showFlag = true
    },
    hide(){
      this.showFlag = false
    },
    sheetItem(index) {
      this.$emit(`btn${index+1}Click`)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .actionsheet-wrapper
    position: fixed
    top: 0
    left: 0
    z-index: 20
    +size(100%)
    background-color: rgba(0,0,0,0.5)
    transform: translate3d(0,0,0)
    &.fade-enter-active,&.fade-leave-active
      transition: all 0.2s linear
      &.fade-enter,&.fade-leave-to
        transform: translate3d(0,100%,0)
    .actionsheet
      position: fixed
      bottom: 0
      width: 100%
      box-shadow: none
      .sheet-list
        position: relative
        margin: 8/$cale+rem 15/$cale+rem
        text-align: center
        border-radius: 10/$cale+rem
        background-color: #f7f7f7
        max-height: 300/$cale+rem
        overflow: auto
        .sheet-item
          overflow: hidden
          padding: 11/$cale+rem 15/$cale+rem
          +border-1px($gray-lighter)
          &:first-child
            border-top-left-radius: 12/$cale+rem
            border-top-right-radius: 12/$cale+rem
          &:last-child
            border-bottom-left-radius: 12/$cale+rem
            border-bottom-right-radius: 12/$cale+rem
            +border-none()
          span
            color: #7bb6dd
            line-height: 24/$cale+rem
            font-size: 17/$cale+rem
        &:last-child .sheet-item>span
          color: $text_color
</style>