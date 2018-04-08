<template>
  <div class=" trancDetail-container">
    <m-header title="交易详情" :type="3" @back="back"></m-header>
    <div class="trancDetail" ref="trancDetail">
      <div class="detailsTitle">
        <span class="sx_icon icon-details"></span>
        <span class="tranTitle dib">交易详情</span>
        <span class="bill_month_btn fr" @click="showPicker">{{showYearAndMonth}}</span>
      </div>
      <scroll class="mui-scroll-wrapper" :data="detailsListInfo" :pullup="pullup" @scrollToEnd="trancscrollToEnd">
        <div class="transactionDetail">
          <ul class="tranc-list">
            <li class="tranc-item" v-for="(item,index) in detailsListInfo" :key="index">
              <div class="trancType gold" v-if="item.type === 2">
                <span class="fl">{{item.typeStr}}</span>
                <span class="fr">{{item.expenditure}}</span>
              </div>
              <div class="trancType gold" v-else-if="item.type === 5">
                <span class="fl">{{item.typeStr}}</span>
                <span class="fr">{{item.expenditure}}</span>
              </div>
              <div class="trancType blue" v-else>
                <span class="fl">{{item.typeStr}}</span>
                <span class="fr">{{item.income}}</span>
              </div>
              <div class="trancDate gray">
                <span class="fl">{{item.createTime}}</span>
                <span class="fr">{{item.transactionStatus}}</span>
              </div>
            </li>

            <div class="loading-wrapper">
              <loading title='' v-show="showDetail"></loading>
            </div>

            <div class="noMore" v-show="showNomoreText">别扯了，没有更多了~</div>
          </ul>
        </div>
      </scroll>

      <div class="noTransaction" v-show="detailsListInfo.length==0">
        <div class="img_noTransaction"><img src="./noTransaction.png"></div>
        <h3 class="tc">查无交易详情</h3>
      </div>
    </div>
    <!-- :selected-index="selectedIndex[1]" -->
    <picker @select="handleSelect(0,arguments)" :data="data[0]" :selected-index="selectedIndex[1]" ref="picker" title="交易日期">
    </picker>
  </div>

</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import { mapGetters } from 'vuex'
import { queryTradeDetailByPage } from 'api/userCenter'
import Picker from 'base/picker/picker'
import Loading from 'base/loading/loading'
import { initPage, setToastMsg,share } from 'common/js/mixin'

let myDate = new Date()
let year = myDate.getFullYear()
let month = parseInt(myDate.getMonth()) + 1

let data1 = [
  {
    text: year - 5,
    value: 1
  }, {
    text: year - 4,
    value: 2
  },
  {
    text: year - 3,
    value: 3
  },
  {
    text: year - 2,
    value: 4
  },
  {
    text: year - 1,
    value: 5
  },
  {
    text: year,
    value: 6
  },
  {
    text: year + 1,
    value: 7
  }, {
    text: year + 2,
    value: 8
  },
  {
    text: year + 3,
    value: 9
  },
  {
    text: year + 4,
    value: 10
  },
  {
    text: year + 5,
    value: 11
  }
]
let data2 = [
  {
    text: '01',
    value: '1'
  }, {
    text: '02',
    value: '2'
  },
  {
    text: '03',
    value: '3'
  },
  {
    text: '04',
    value: '4'
  },
  {
    text: '05',
    value: '5'
  },
  {
    text: '06',
    value: '6'
  },
  {
    text: '07',
    value: '7'
  }, {
    text: '08',
    value: '8'
  }, {
    text: '09',
    value: '9'
  }, {
    text: '10',
    value: '10'
  }, {
    text: '11',
    value: '11'
  }, {
    text: '12',
    value: '12'
  }
]


export default {
  mixins: [initPage, setToastMsg,share],
  data() {
    return {
      yearAndMonth: [],//传入接口的时间格式
      showYearAndMonth: '', //显示在页面的时间格式
      detailsListInfo: [], //交易明细list
      currPage: 1, //当前页
      pageSize: 10,//每页显示条数
      genre: 0,//资金账户枚举:-1:线上钱包和会员卡所有的，0：线上钱包  1:会员卡(不传默认是线上钱包)
      pullup: true, //上拉刷新
      showDetail: false,//loading是否展示
      showNomoreText: false,//没有更多字样显示
      detailTotalPageCount: '',//详情总页数
      // showTitle: false,
      data: [
        [data1, data2]
      ],
      selectedIndex: [
        [1, 0]
      ]
    }
  },
  computed: {
    ...mapGetters(['userToken'])
  },
  created() {
    document.title = '交易详情'
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.trancDetail)
    })
    // 获取当天时间
    myDate = new Date()
    year = myDate.getFullYear()
    month = parseInt(myDate.getMonth()) + 1
    if (parseInt(myDate.getMonth()) + 1 < 10) {
      this.yearAndMonth.push(myDate.getFullYear() + "-0" + (parseInt(myDate.getMonth()) + 1));
      this.showYearAndMonth = year + '年' + month + '月'
    } else {
      this.yearAndMonth.push((myDate.getFullYear()) + "-" + (parseInt(myDate.getMonth()) + 1));
      this.showYearAndMonth = year + '年' + month + '月'
    }
    this._queryTradeDetailByPage()
  },
  methods: {
    showPicker() {
      let picker = this.$refs.picker
      picker.show()
    },
    handleSelect(index, args) {
      // args[2]: 是text的值
      //         替换功能，第一个参数（起始位置），第二个参数（删除的项数），第三个参数（插入任意数量的项）
      // array.splice(index,num,insertValue)，返回值为删除内容，array为结果值。
      this.yearAndMonth.splice(index, 1, args[2].join('-'))
      let newYearAndMonth = this.yearAndMonth[0].split("-") //返回的为数组
      this.showYearAndMonth = newYearAndMonth[0] + '年' + newYearAndMonth[1] + '月'
      this._queryTradeDetailByPage()
    },
    back() {
      this.$router.goBack()
    },
    _queryTradeDetailByPage() {//交易明细分页
      this.currPage = 1
      queryTradeDetailByPage(this.userToken, this.yearAndMonth[0], this.currPage, this.pageSize, this.genre).then(res => {
        if (res.success) {
          this.detailsListInfo = res.transactionDetais
          this.detailTotalPageCount = res.totalPageCount
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    trancscrollToEnd() {//加载更多
      this.currPage++
      if (this.currPage <= this.detailTotalPageCount) {
        this.showDetail = true
        queryTradeDetailByPage(this.userToken, this.yearAndMonth[0], this.currPage, this.pageSize, this.genre).then(res => {
          if (res.success) {
            this.detailsListInfo = this.detailsListInfo.concat(res.transactionDetais)
          }
        })
      } else {
        this.showDetail = false
        this.showNomoreText = true
      }
    }
  },
  components: {
    MHeader,
    Scroll,
    Picker,
    Loading
  }
}
</script>  

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"


  .trancDetail-container
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .mui-scroll-wrapper
      margin-top: 44/$cale+rem
      position: fixed
      top: 44/$cale+rem
      bottom: 0
      width: 100%
      overflow: hidden
      .mui-table-view:before
        top: 0
    .trancDetail
      .detailsTitle
        position: fixed
        top: 56/$cale+rem
        left: 0
        padding: 0 15/$cale+rem 15/$cale+rem
        width: 100%
        .icon-details
          +size(24/$cale+rem)
          +bg-image('./details')
          background-size: 100% 100%
          position: absolute
          top: 4/$cale+rem
        .tranTitle
          font-size: 17/$cale+rem
          color: $gray-dark
          font-weight: 500!important
          padding-left: 30/$cale+rem
          position: absolute
          top: 8/$cale+rem
        .bill_month_btn
          +size(110/$cale+rem,34/$cale+rem)
          line-height: 34/$cale+rem
          font-size: 14/$cale+rem
          padding-left: 2.8%
          text-align: left
          border: 0
          border-radius: 4/$cale+rem
          position: relative
          right: 0
          background: url("arrow_down.png") no-repeat 90/$cale+rem center
          background-color: $gray-lighter
          background-size: 8/$cale+rem 8/$cale+rem
          vertical-align: middle
    .transactionDetail
      h5
        font-size: 14/$cale+rem
        line-height: 20/$cale+rem
        color: $gray-dark
        padding-bottom: 10/$cale+rem
        +b-solid(1/$cale+rem, $border-light, bottom)
        text-indent: 15/$cale+rem
      .tranc-list
        padding-left: 4%
      .tranc-item
        position: relative
        padding: 10/$cale+rem 4% 10/$cale+rem 0
        &:after
          content: ''
          +position(absolute, (right 0 bottom 0 left 0))
          +b-solid(1/$cale+rem, $border-light, bottom)
      .trancType
        font-size: 14/$cale+rem
        +line-height(20/$cale+rem)
      .trancDate
        font-size: 12/$cale+rem
        +line-height(17/$cale+rem)
    .noTransaction
      margin: 50% auto
      .img_noTransaction
        width: 110/$cale+rem
        margin: 0 auto 20/$cale+rem
      img
        width: 100%
      h3
        font-size: 14/$cale+rem
        line-height: 20/$cale+rem
        margin: 0
        color: $gray  
    .select
      margin: 0 10/$cale+rem 40/$cale+rem
      +line-height(40/$cale+rem)
      border: 1px solid #e5e5e5
      text-align: center
      background: $white
      z-index: 99999
    .noMore
      text-align: center
      font-size: 16/$cale+rem
      color: $gray-light
      margin-top: 10/$cale+rem
  .gold
    color: $new-main    
</style>  
