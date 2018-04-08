<template>
  <transition name="slide">
    <div class="redRule-container"> 
      <m-header title="红包规则" :type="3" @back="back"></m-header>
      <scroll class="scroll-content">
        <div class="redRule">
          <div>
            <div class="redRule_bg"><img src="./redRule_bg.png"></div>
            <div class="howGetRed">
              <img src="./howGetRed.png">
              <ul class="getWay">
                <li><span>1</span>注册APP</li>
                <li><span>2</span>首次发出礼约</li>
                <li><span>3</span>首次接收礼约</li>
                <li><span>4</span>接收礼约后分享</li>
                <li><span>5</span>推荐APP给好友</li>
                <li><span>6</span>好友用我的推荐码注册</li>
                <li><span>7</span>倾停活动赠送</li>
              </ul>
            </div>
            <div class="howGetRed">
              <img src="./redCanDo.png">
              <ul class="getWay">
                <li class="redCanDo">可以用于倾停驿站在线消费时，抵扣订单实际支付金额</li>
              </ul>
            </div>
            <div class="howGetRed">
              <img src="./redUseRule.png">
              <ul class="getWay">
                <li><span>1</span>红包仅限在倾停驿站购买商品使用，一些特价商品除外</li>
                <li><span>2</span>每个红包有所适用的倾停驿站，可在红包上查看</li>
                <li><span>3</span>红包不可拆分使用，只能一次性使用，多个红包不可叠加使用</li>
                <li><span>4</span>红包不得提现，不得转赠他人，不得为他人付款</li>
                <li><span>5</span>红包需在有效期内使用，逾期作废</li>
                <li><span>6</span>使用红包购买倾停驿站的商品后，发生退款情况，红包失效，不予返还</li>
                <li><span>7</span>红包需在满足使用条件时使用，才可抵扣相应的金额</li>
                <li><span>8</span>使用红包抵扣的消费金额，不计入买满赠等活动计算的总金额中</li>
              </ul>
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </transition>  
</template>


<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Scroll from 'base/scroll/scroll'

  export default{
    data(){
      return {
       
      }
    },
    created () {
      document.title='红包规则'
    },
    methods: {
      back(){
        this.$router.goBack()
      },
    },
    components: {
      MHeader,
      Scroll
    }
  }

</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .redRule-container
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    padding-bottom: 10px 
    .scroll-content
      position: fixed
      width: 100%
      top: 50px
      bottom: 0
      overflow: hidden 
    .redRule
      background-color: #fff8e8
      color: #4c1006
      .redRule_bg
        margin-bottom: 27px
      img
        width: 100%
      .howGetRed
        padding: 0 4% 16px
        .redCanDo
          padding-left: 0
      .getWay
        +position(relative,(top -24px left 0))
        padding: 40px 6.67% 30px 4%
        background-color: rgba(255, 54, 22, 0.15)
        border-radius: 10px
        &>li
          padding-bottom: 10px
          font-size: 14px
          line-height: 20px
          position: relative
          padding-left: 25px
          span
            +position(absolute,(top 3px left 0))
            display: inline-block
            +size(15px)
            border-radius: 50%
            color: $white
            text-align: center
            font-size: 10px
            line-height: 15px
            background-color: $red-dark
  
</style>    