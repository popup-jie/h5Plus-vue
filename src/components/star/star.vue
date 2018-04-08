<template>
  <div class="star" :class="starType">
    <span class="star-item"
          v-for="(itemClass,index) in itemClasses"
          :class="itemClass"
          @click="select(index)"
          track-by="$index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number,
        default: 0
      }
    },
    computed: {
      starType(){
        return 'star-'+this.size
      },
      itemClasses() {
        let result = []
        if(this.score > 0){ //已评分--即查看评价页面进来
          let score = Math.floor(this.score*2)/2
          let hasDecimal = score%1 !== 0
          let integer = Math.floor(score)
          for(let i=0;i<integer;i++){
            result.push(CLS_ON)
          }
          if(hasDecimal){
            result.push(CLS_HALF)
          }
          while(result.length<LENGTH){
            result.push(CLS_OFF)
          }
        }else{ //未评分--即评价晒单页面进来
          for(let i=0;i < this.selectIndex;i++){
            result.push(CLS_ON)
          }
          while(result.length<LENGTH){
            result.push(CLS_OFF)
          }
        }
        return result
      }
    },
    data() {
      return {
        selectIndex: 0, //当前点击的星星所对应的索引(0为未选择任何星星)
      }
    },
    methods:{
      select(index){
        index++
        this.selectIndex = index
        //点击星星评分
        if(this.score > 0){ //已评分--即查看评价页面进来
          return
        }
        //未评分--即评价晒单页面进来
        this.$emit('changeScore',this.selectIndex)
      }
    }
  }
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .star
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-20
      .star-item
        +size(20/$cale+rem)
        margin-right: 6/$cale+rem
        background-size: 100% 100%
        vertical-align: top
        &:last-child
          margin-right: 0
        &.on
          +bg-image('star20_on')
        &.off
          +bg-image('star20_off')
        &.half
          +bg-image('star20_half')
</style>