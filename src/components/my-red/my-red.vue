<template>
  <div class="myRed">
    <m-header title="我的红包" text="红包规则" :type="3" @back="back"></m-header>
    <div class="myRed-content">
      <!-- 顶部导航栏 -->
      <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem">
      </switches>

      <!-- 可用红包 -->

      <div id="availableRed" class="mui-active" v-show="currentIndex==0">
        <div class='redInfo' v-show="InUseRed || (availableList.length != 0)">当前有{{availableLength}}个可用红包</div>
        <div class="availableRedScroll">
          <div class='mui-scroll'>
            <scroll ref="scroll" :pullup="pullup" :data="availableList" class="scroll-content" @scrollToEnd="redscrollToEnd">
              <div>
                <ul v-if="InUseRed">
                  <li class="red-list inUse" :dataId="InUseRed.id" :dataMoney="InUseRed.money" @click="backPrevious(InUseRed.id,InUseRed.money)">
                    <div class="money fl">
                      <span class="yen">&yen;</span>
                      <label class="moneyInt">{{InUseRed.money}}</label>
                    </div>
                    <div class="redDetail fl">
                      <h2 class="redType">{{InUseRed.name}}</h2>
                      <ul class="infoList">
                        <li>
                          <template v-if="InUseRed.conditionMoney">满{{InUseRed.conditionMoney}}元可用</template>
                          <template v-else>购买金额不限</template>
                        </li>
                        <li>
                          <template v-if="InUseRed.applyType === 2">适用于部分倾停空间</template>
                          <template v-else>适用于所有倾停空间</template>
                        </li>
                        <li v-if="InUseRed.istejia">特价商品除外</li>
                        <li v-if="InUseRed.limitnum && InUseRed.limitnum !== -1">每天限定使用{{InUseRed.limitnum}}个</li>
                        <li>{{InUseRed.beginDate}} 至 {{InUseRed.endDate}}</li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li class="red-list available" v-for="(item,index) in availableList" :key="index" :dataId="item.id" :dataMoney="item.money" @click="backPrevious(item.id,item.money)">
                    <div class="money fl">
                      <span class="yen">&yen;</span>
                      <label class="moneyInt">{{item.money}}</label>
                    </div>
                    <div class="redDetail fl">
                      <h2 class="redType">{{item.name}}</h2>
                      <ul class="infoList">
                        <li>
                          <template v-if="item.conditionMoney">满{{item.conditionMoney}}元可用</template>
                          <template v-else>购买金额不限</template>
                        </li>
                        <li>
                          <template v-if="item.applyType === 2">适用于部分倾停空间</template>
                          <template v-else>适用于所有倾停空间</template>
                        </li>
                        <li v-if="item.istejia">特价商品除外</li>
                        <li v-if="item.limitnum && item.limitnum !== -1">每天限定使用{{item.limitnum}}个</li>
                        <li>{{item.beginDate}} 至 {{item.endDate}}</li>
                      </ul>
                    </div>
                  </li>

                  <div class="loading-wrapper" v-show="availableMore">
                    <loading v-show="availableMore" title=''></loading>
                  </div>

                  <div class="noMore" v-show="availableNoMore && (availableList.length != 0)">别扯了，没有更多了~</div>

                </ul>
              </div>

            </scroll>
          </div>
          <!--暂无可用红包-->
          <div class='noRed' v-show="!InUseRed && (availableList.length == 0)">
            <img class="img-wrap" src="./noRed.png" alt="无可用红包">
            <h3>当前没有可用的红包哦~</h3>
            <span class="getRedRule" @click.stop="_getRedRule">如何获取红包</span>
          </div>

        </div>
      </div>

      <!-- 历史红包 -->
      <div id="historicalRed" class="" v-show="currentIndex==1">
        <div class="mui-scroll-wrapper">
          <div :class="['mui-scroll', {'none': historicalList.length <= 0 }]">
            <scroll ref="scroll" :data="historicalList" class="scroll-content" :pullup="pullup" @scrollToEnd="redscrollToEnd">
              <ul>
                <li :class="['red-list',{'used':item.status===2,'expired':item.status===3}]" v-for="(item,index) in historicalList" :key="index">
                  <div class="money fl">
                    <span class="yen">&yen;</span>
                    <label class="moneyInt">{{item.money}}</label>
                  </div>
                  <div class="redDetail fl">
                    <h2 class="redType">{{item.name}}</h2>
                    <ul class="infoList">
                      <li>
                        <template v-if="item.conditionMoney">满{{item.conditionMoney}}元可用</template>
                        <template v-else>购买金额不限</template>
                      </li>
                      <li>
                        <template v-if="item.applyType === 2">适用于部分倾停空间</template>
                        <template v-else>适用于所有倾停空间</template>
                      </li>
                      <li v-if="item.istejia">特价商品除外</li>
                      <li v-if="item.limitnum && item.limitnum !== -1">每天限定使用{{item.limitnum}}个</li>
                      <li>{{item.beginDate}} 至 {{item.endDate}}</li>
                    </ul>
                  </div>
                </li>

                <div class="loading-wrapper">
                  <loading v-show="historyMore" title=''></loading>
                </div>

                <div class="noMore" v-show="historyNoMore && (historicalList.length != 0)">别扯了，没有更多了~</div>
              </ul>
            </scroll>
          </div>

          <!--暂无历史红包-->

          <div class='noRed' v-show="historicalList.length==0">
            <img class="img-wrap" src="./noRed.png" alt="无历史红包">
            <h3>这里空空如也~，去可用红包找找</h3>
            <span class="getRedRule" @click.stop="_getRedRule">如何获取红包</span>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import Switches from 'base/switches/switches'
import { queryWallet, queryWalletById } from 'api/userCenter'
import { mapGetters, mapMutations } from 'vuex'
import Loading from 'base/loading/loading'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  computed: {
    ...mapGetters([
      'userToken',
      'redPacketMoney',
      'userWalletId'
    ])
  },
  data() {
    return {
      currentIndex: 0, //对应的标题ind
      switches: [{ name: '可用红包' }, { name: '历史红包' }],
      InUseRed: null, //使用中的红包
      availableList: [], //可用红包
      historicalList: [], //历史红包
      availableLength: 0, //可用红包的个数
      pageSize: 5,//显示条数
      currPage: 1,//当前页
      cloud8InfoId: '',//云八id
      conditionMoney: '',//使用条件金额(元)
      redPkgId: '',//需要查询排除的红包数据
      availableMore: false,//可用红包加载更多图标
      historyMore: false, //历史红包加载更多图标
      pullup: true, //上拉刷新
      availableTotalPage: '', //可用红包总页数
      historyTotalPage: '',//历史红包总页数
      availableNoMore: false,//可用红包没有更多
      historyNoMore: false,//历史红包没有更多
    }
  },
  created() {
    this._queryWallet()
    this._shareDetail()
    // this._queryWalletById()
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    switchItem(ind) {
      this.currentIndex = ind
      this._queryWallet()
    },
    _queryWallet() { //查询我的红包
      this.currPage = 1
      this.availableNoMore = false
      this.historyNoMore = false
      queryWallet(
        this.userToken,
        this.currentIndex + 1,
        this.pageSize,
        this.currPage,
        this.cloud8InfoId,
        this.conditionMoney,
        this.redPkgId).then(res => {
          if (res.success) {
            if (this.currentIndex + 1 == 1) { //可用红包
              this.availableLength = res.count //红包个数
              this.availableList = res.dataList
              this.availableTotalPage = res.totalPageCount //总页数
              if (this.userWalletId != "undefined" && this.userWalletId != null && this.userWalletId != '' && this.userWalletId != 0) { //从其他页面带入红包ID
                this._queryWalletById()
              }
            } else {//历史红包
              this.historicalList = res.dataList
              this.historyTotalPage = res.totalPageCount //总页数
            }
          }
        })
    },
    concatQueryWallet() { //加载更多
      queryWallet(
        this.userToken,
        this.currentIndex + 1,
        this.pageSize,
        this.currPage,
        this.cloud8InfoId,
        this.conditionMoney,
        this.redPkgId).then(res => {
          if (res.success) {
            if (this.currentIndex + 1 == 1) { //可用红包
              this.availableLength = res.count
              this.availableList = this.availableList.concat(res.dataList)
              this._checkMove(res, this.currPage, 'available')
              if (this.userWalletId != "undefined" && this.userWalletId != null && this.userWalletId != '' && this.userWalletId != 0) { //从其他页面带入红包ID
                this._queryWalletById()
              }
            } else {//历史红包
              this.historicalList = this.historicalList.concat(res.dataList)
              this._checkMove(res, this.currPage, 'history')
            }
          }
        })
    },
    _queryWalletById() { //有红包ID传入时查询单个红包（是否使用中）
      console.log('进入了单个红包' + this.userWalletId)
      queryWalletById(this.userWalletId).then(res => {
        if (res.success) {
          if (res.info) {
            this.availableLength = this.availableLength + 1
            this.InUseRed = res.info
          }
        }
      })
    },
    redscrollToEnd() { //加载更多
      this.currPage++
      if (this.currentIndex + 1 == 1) { //可用红包
        if (this.currPage <= this.availableTotalPage) { //页数小于可用红包总页数
          this.availableMore = true
          this.concatQueryWallet()
        } else { //超出总页数
          this.availableNoMore = true //显示没有更多字样
        }
      } else {//历史红包
        if (this.currPage <= this.historyTotalPage) { //页数小于历史红包总页数
          this.historyMore = true
          this.concatQueryWallet()
        } else {
          this.historyNoMore = true
        }
      }
    },
    _checkMove(res, currage, type) { //判断loading图标是否显示
      let data = res
      if (!res.dataList.length || this.currPage >= data.totalPageCount) {
        if (type == 'available') {
          this.availableMore = false
        } else {
          this.historyMore = false
        }
      }
    },
    _getRedRule() {
      this.$router.push(`/redrule`)
    },
    backPrevious(redId, redMoney) {//点击红包返回上一级
      this.$router.push(`/terminal`)
      this.setUserWalletId(redId)
      this.setredPacketMoney(redMoney)
      console.log('返回上一级'+redId)
    },
    ...mapMutations({
      setredPacketMoney: 'SET_RED_PACKET_MONEY',
      setUserWalletId: 'SET_USER_WALLET_ID'
    }),
  },

  components: {
    MHeader,
    Switches,
    Scroll,
    Loading
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .myRed
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .scroll-content
      position: fixed
      width: 100%
      top: 125/$cale+rem
      bottom: 0
      overflow: hidden
    .mui-pull-top-tips
      background-color: $white
    .mui-slider .mui-segmented-control
      .mui-control-item
        padding: 10/$cale+rem 0 16/$cale+rem
        &.mui-active span:before
          bottom: -5/$cale+rem
      &~.mui-slider-group
        top: 50/$cale+rem
    .redInfo
      padding: 10/$cale+rem 0 10/$cale+rem 17/$cale+rem
      color: $gray
      font-size: 12/$cale+rem
      line-height: 17/$cale+rem
    .mui-scroll
      padding: 0 4% 0
      .red-list
        width: 92%
        height: 113/$cale+rem
        background: url('red-avaliable.png') no-repeat
        background-size: 100% 100%
        margin-bottom: 10/$cale+rem
      .inUse
        width: 92%
        height: 113/$cale+rem
        background: url('red-inUse.png') no-repeat
        background-size: 100% 100%
        margin-bottom: 10/$cale+rem
      .money
        font-weight: bold
        padding-top: 30/$cale+rem
        padding-left: 6.67%
        line-height: 50/$cale+rem
        color: $red
        font-weight: bold
        width: 33%
      .yen
        font-size: 24/$cale+rem
      .moneyInt
        font-size: 36/$cale+rem
        font-weight: bold
      .redDetail
        padding-top: 18/$cale+rem
        color: $gray-base
        position: absolute
        left: 33%
        width: 70%
      .redType
        font-size: 18/$cale+rem
        line-height: 25/$cale+rem
      h2
        font-size: 18/$cale+rem
        font-weight: bold
        line-height: 25/$cale+rem
        @extend .ellipsis
      .infoList
        margin-left: 2%
        &>li
          line-height: 13/$cale+rem
          font-size: 11/$cale+rem
          position: relative
          margin-left: 1.4%
          margin-bottom: 5/$cale+rem
          &:before
            content: '.'
            position: absolute
            top: -4/$cale+rem
            left: -7/$cale+rem
      .used
        background: url('red-used.png') no-repeat
        background-size: 100% 100%
        .redDetail,.money
          color: $gray!important
      .expired
        background: url('red-expired.png') no-repeat
        background-size: 100% 100%
        .redDetail,.money
          color: $gray!important
    #availableRed>.mui-scroll-wrapper
      top: 1.85/$cale+rem
    #historicalRed>.mui-scroll-wrapper
      top: 1/$cale+rem

    //无可用红包
    .noRed
      text-align: center
      padding-top: 55/$cale+rem
      .img-wrap
        height: 129/$cale+rem !important
      h3
        font-size: 14/$cale+rem
        line-height: 20/$cale+rem
        color: $gray-base
        padding: 20/$cale+rem 0
      .getRedRule
        display: inline-block
        padding: 6/$cale+rem 4%
        color: $white
        background-color: $new-main
        line-height: 20/$cale+rem
        border-radius: $border-radius-base
        font-size: 14/$cale+rem
    .none
      display: none
    .noMore
      text-align: center
      font-size: 16/$cale+rem
      color: $gray-light
</style>