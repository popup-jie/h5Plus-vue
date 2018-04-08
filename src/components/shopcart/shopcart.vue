<template>
  <div class="shopcart">
    <m-header title="购物车" :type="3" @back="back"></m-header>
    <div class="shopcart-wrapper" ref="shopcartWrapper">
      <div class="scroll-inner">
        <!--购物车商品信息-->
        <div class="goods">
          <div class="goods-list">
            <div class="goods-item" v-for="(item,Pindex) in shopCart">
              <div class="item-title">
                <span class="iconCheck" :class="{'active':item.checked}" @click="selectParent(Pindex)"></span>
                <span class="title">{{item.categoryName}}</span>
                <template v-if="!item.editFlag">
                  <span class="edit fr" @click="edit(Pindex)">编辑</span>
                </template>
                <template v-else>
                  <span class="edit fr" @click="finish(Pindex)">完成</span>
                </template>
              </div>
              <ul class="item-goods">
                <li class="product" v-for="(product,Cindex) in item.goods">
                  <span class="iconCheck" :class="{'active':product.checked}" @click.stop.prevent="select(Pindex,Cindex)"></span>
                  <div class="product-info">
                    <img class="pic" :src="toAvatar(product.picture)" />
                    <div class="detail" v-show="!item.editFlag">
                      <div class="left">
                        <p class="name">{{product.goodsName}}</p>
                        <p class="norms">{{product.specificationsName||''}}</p>
                        <p class="tip" v-show="!product.specificationsId">已选规格已下架</p>
                      </div>
                      <div class="right">
                        <p class="price">&yen;{{product.price}}</p>
                        <p class="oldprice" v-show="IsSuperVip && (product.price !== product.originalPrice)">&yen;{{product.originalPrice}}</p>
                        <p class="count">x{{product.num}}</p>
                        <p class="fightGroups" v-show="product.isGroupBuy" @click.stop.prevent="lookDetails(product.goodsId)">去拼团></p>
                      </div>
                    </div>
                    <div class="edit-area" v-show="item.editFlag">
                      <div class="operate">
                        <div class="num-operate">
                          <span class="minus" @click.stop.prevent="reduceCart(Pindex,Cindex)"></span>
                          <span class="goods-count">{{product.num}}</span>
                          <span class="plus" @click.stop.prevent="addCart(Pindex,Cindex)"></span>
                        </div>
                        <div class="norms-operate" @click.stop.prevent="selectNorms(Cindex,product)">
                          <span class="name">{{product.specificationsName||''}}</span>
                          <span class="iconEdit"></span>
                        </div>
                        <p class="tip" v-show="!product.specificationsId">规格已下架，请重选规格</p>
                      </div>
                      <div class="delete" @click.stop.prevent="deleteProduct(Pindex,Cindex)">删除</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--购物车为空-->
          <div class="no-goods" v-show="!shopCart.length">
            <div class="pic"></div>
            <p class="text">购物车还是空的</p>
            <p class="text">去挑几件中意的商品吧</p>
          </div>
        </div>
        <!--为你推荐商品信息-->
        <div class="recommonds">
          <div class="title">- 为你推荐 -</div>
          <home-list :data="recommonds" @lookDetails="lookDetails"></home-list>
        </div>
      </div>
    </div>
    <!--底部结算块-->
    <div class="fixed_settle">
      <div class="check-money">
        <div class="check-area" :class="{'active':selectAllFlag}" @click="selectAll">
          <span class="iconCheck"></span>
          <span class="txt">全选</span>
        </div>
        <template v-if="discountTotal>0">
          <!--有返现金额时布局-->
          <div class="cash-money">
            <p>合计:
              <span class="money">&yen;{{totalMoney.toFixed(2)}}</span>
            </p>
            <p class="cashBack">总金额：¥{{(totalMoney-discountTotal).toFixed(2)}} 返现：{{discountTotal.toFixed(2)}}</p>
          </div>
        </template>
        <template v-else>
          <!--无返现金额时布局-->
          <div class="total-money">
            <p>合计:
              <span class="money">&yen;{{totalMoney.toFixed(2)}}</span>
            </p>
          </div>
        </template>
      </div>
      <div class="btn-settle" @click="settle">
        结算
        <span class="count">({{totalCount}})</span>
      </div>
    </div>
    <!--结算前的一些信息提示-->
    <alert ref="alertWindow" :text="alertText"></alert>
    <!--選擇商品規格彈窗-->
    <mt-popup position="bottom" v-model="showPopup" class="editNorms">
      <div class="editNorms-wrapper">
        <div class="goods-info">
          <img :src="toAvatar(selectedGood.picture)" alt="" class="goods-pic">
          <div class="info">
            <p class="price" v-if="promotionType == 0">&yen;{{selectedGood.price}}(立减&yen;{{nowLessPrice}})</p>
            <p class="price" v-else-if="promotionType == 1">&yen;{{selectedGood.price}}(返现&yen;{{returnMoney}})</p>
            <p class="price" v-else>&yen;{{selectedGood.price}}</p>
            <p class="oldprice" v-show="IsSuperVip && (selectedGood.price !== selectedGood.originalPrice)">&yen;{{selectedGood.originalPrice}}</p>
            <p class="stocky">库存{{selectedGood.stock}}件</p>
            <p class="norms">已选
              <span class="txt">{{selectedGood.specificationsName||''}}</span>
            </p>
          </div>
          <div class="iconClose" @click="closePopup"></div>
        </div>
        <div class="norms-list">
          <p class="title">规格</p>
          <ul class="norms-ul">
            <li class="norms-item" :class="{'active':item.id===selectedNormId}" v-for="(item,index) in goodsSpecs" @click="changeNorms(item)">{{item.name}}</li>
          </ul>
        </div>
        <div class="btn-query" @click="confirmChange">确定</div>
      </div>
    </mt-popup>
    <!--删除商品---系统确认弹窗-->
    <confirm ref="deleteConfirm" title="提示" :text="deleteConfirmTxt" @confirm="confirmDelete" @cancel="cancelDelete"></confirm>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import HomeList from 'base/home-list/home-list'
import BScroll from 'better-scroll'
import { initPage, setToastMsg, share } from 'common/js/mixin'
import {
  selectRecommendsGoods,
  getUserCartList,
  updateCartList,
  deleteCart,
  selectGoodsspecifications,
  getAllPromotionDiscount,
  getPromotionDiscount
} from 'api/goods'
import { avatar } from 'common/js/tools'
import { mapGetters, mapMutations } from 'vuex'
import Alert from 'base/alert/alert'
import Confirm from 'base/confirm/confirm'
import MtPopup from 'mint-ui/lib/popup'
import 'mint-ui/lib/popup/style.css'

export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      recommonds: [], //为你推荐商品信息
      shopCart: [], //接收接口获取的购物车商品信息
      selectAllFlag: false, //是否全选
      totalMoney: 0, //合计金额
      totalCount: 0, //合计商品总件数
      showPopup: false, //是否展示选择规格的弹窗
      selectedGood: {}, //当前编辑规格对应的商品信息
      selectedNormId: 0, //已选规格对应下标
      goodsSpecs: [], //商品对应的规格列表数组
      needSettledGoods: [], //购物车选中待结算的商品信息
      hasLowerGoods: false, //待结算商品中是否有规格已下架的商品
      alertText: '', //结算前的温馨提示信息
      deleteConfirmTxt: '确定从购物车中删除当前商品？', //删除商品的确认提示信息
      deleteProductPIndex: -1, //当前删除商品对应的分类Index
      deleteProductCIndex: -1, //当前删除商品对应的分类Index下的商品index
      discountTotal: 0, //总的返现金额(为0则不参与返现)
      returnMoney: 0,  //规格列表单个商品所对应的返现金额
      promotionType: '',  //促销类型 0：立减 1: 返现
      nowLessPrice: 0,   //立减金额
    }
  },
  computed: {
    ...mapGetters(['userToken', 'IsSuperVip'])
  },
  created() {
    document.title = '购物车'
    this._shareDetail()
    localStorage.removeItem('goodsJson') //页面初始化先清空goodsJson
    this._initscroll()
    this._initCartList()
    this.$nextTick(() => {
      this._initPage(this.$refs.shopcartWrapper)
    })
  },
  mounted() { },
  methods: {
    back() {
      this.$router.goBack()
    },
    lookDetails(item) {
      if (window.__wxjs_environment === 'miniprogram') {
        let formatBgimg = avatar(item.goodsPicture)
        let title = `${item.name}，售价${item.price}元，新锐礼助力新年好福气`
        var path = `/page/orderdetails/orderdetails?goodsid=${item.id}&formatBgimg=${formatBgimg}&title=${title}&sharegoodspingtuan=0`
        //通过JSSDK的api使小程序跳转到指定的小程序页面
        wx.miniProgram.navigateTo({ url: path })
      } else {
        //查看详情
        this.setgoodid(item.id) 
        this.$router.push(`/goodsdetails/${item.id}`)
      }
    },
    toAvatar(src) {
      return avatar(src)
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.shopcartWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _initCartList() {
      //初始化购物车商品列表信息
      getUserCartList(this.userToken).then(res => {
        this.normalizeCartList(res.data)
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      })
      this.addCheckProp()
      this._selectRecommendsGoods()
    },
    normalizeCartList(cartData) {
      if (!cartData || cartData.length < 1) {
        return
      }
      //规范化购物车商品列表数据---分组
      let newMap = {}
      let newArr = []
      for (let i = 0; i < cartData.length; i++) {
        let item = cartData[i]
        if (!newMap[item.categoryId]) {
          newArr.push({
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            goods: [item]
          })
          newMap[item.categoryId] = item
        } else {
          for (var j = 0; j < newArr.length; j++) {
            var dj = newArr[j]
            if (dj.categoryId == item.categoryId) {
              dj.goods.push(item)
              break
            }
          }
        }
      }
      this.shopCart = newArr
    },
    _selectRecommendsGoods() {
      //查询推荐商品列表信息
      let limit = 10
      selectRecommendsGoods(limit).then(res => {
        if (res.success) {
          this.recommonds = res.data
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    addCheckProp() {
      for (let i = 0; i < this.shopCart.length; i++) {
        if (!this.shopCart[i].editFlag) {
          this.shopCart[i].editFlag = false
        }
        if (!this.shopCart[i].checked) {
          this.shopCart[i].checked = false
        }
        for (let j = 0; j < this.shopCart[i].goods.length; j++) {
          if (!this.shopCart[i].goods[j].checked) {
            this.shopCart[i].goods[j].checked = false
          }
        }
      }
    },
    edit(Pindex) {
      //编辑商品
      this.$data.shopCart[Pindex].editFlag = true
      this.$set(this.$data.shopCart, Pindex, this.$data.shopCart[Pindex])
    },
    finish(Pindex) {
      //完成編輯商品方法
      //格式化商品信息为JSON字符串
      let cartInfoJson = this._formatGoodsJson(
        this.$data.shopCart[Pindex].goods
      )
      //修改购物车列表信息
      updateCartList(cartInfoJson).then(res => {
        if (res.success) {
          this.$data.shopCart[Pindex].editFlag = false
          this.$set(this.$data.shopCart, Pindex, this.$data.shopCart[Pindex])
        }
      })
    },
    _formatGoodsJson(goodsObj) {
      //格式化购物车商品信息为JSON字符串---需要带入到确认订单页面使用
      let tempCartData = goodsObj.map((item, index, arr) => {
        return {
          cartInfoIds: item.carInfoId,
          specificationsId: item.specificationsId,
          num: item.num
        }
      })
      let goodsJson = JSON.stringify(tempCartData)
      let goodsJsonClone = goodsJson.slice(0, goodsJson.length)
      return goodsJsonClone
    },
    _formatGoodsJson2(goodsObj) {
      //格式化商品信息为JSON字符串---获取返现金额时使用
      let tempCartData = goodsObj.map((item, index, arr) => {
        return {
          goodsId: item.goodsId,
          barCod: item.barCod || '',
          num: item.num
        }
      })
      let goodsJson = JSON.stringify(tempCartData)
      let goodsJsonClone = goodsJson.slice(0, goodsJson.length)
      return goodsJsonClone
    },
    selectParent(Pindex) {
      //单个种类选择
      this.$data.shopCart[Pindex].checked = !this.$data.shopCart[Pindex].checked
      //下面所有商品全部选中
      var _this = this
      _this.shopCart[Pindex].goods.forEach(function (item, index) {
        item.checked = _this.shopCart[Pindex].checked
      })
      _this.$set(_this.$data.shopCart, Pindex, _this.$data.shopCart[Pindex])
      //判断所有种类及商品能否自动全选
      let checkedNum2 = 0
      for (let i = 0; i < _this.shopCart.length; i++) {
        if (_this.shopCart[i].checked) {
          checkedNum2++
        }
      }
      if (checkedNum2 === _this.shopCart.length) {
        _this.selectAllFlag = true
      } else {
        _this.selectAllFlag = false
      }
    },
    select(Pindex, Cindex) {
      //单个商品选中
      this.$data.shopCart[Pindex].goods[Cindex].checked = !this.$data.shopCart[
        Pindex
      ].goods[Cindex].checked
      //判断当前种类能否自动全选
      let checkedNum = 0
      for (let i = 0; i < this.shopCart[Pindex].goods.length; i++) {
        if (this.shopCart[Pindex].goods[i].checked) {
          checkedNum++
        }
      }
      if (checkedNum === this.shopCart[Pindex].goods.length) {
        this.$data.shopCart[Pindex].checked = true
        //判断所有种类及商品能否自动全选
        let checkedNum2 = 0
        for (let i = 0; i < this.shopCart.length; i++) {
          if (this.shopCart[i].checked) {
            checkedNum2++
          }
        }
        if (checkedNum2 === this.shopCart.length) {
          this.selectAllFlag = true
        } else {
          this.selectAllFlag = false
        }
      } else {
        this.$data.shopCart[Pindex].checked = false
        this.selectAllFlag = false
      }
      this.$set(this.$data.shopCart, Pindex, this.$data.shopCart[Pindex])
    },
    selectAll() {
      //全选
      this.selectAllFlag = !this.selectAllFlag
      var _this = this
      _this.shopCart.forEach(function (Pitem, Pindex) {
        Pitem.checked = _this.selectAllFlag
        //下面所有商品全部选中
        Pitem.goods.forEach(function (Citem, Cindex) {
          Citem.checked = Pitem.checked
        })
        _this.$set(_this.$data.shopCart, Pindex, _this.shopCart[Pindex])
      })
    },
    deleteProduct(Pindex, Cindex) {
      this.deleteProductPIndex = Pindex
      this.deleteProductCIndex = Cindex
      //弹出是否确定删除信息框
      this.$refs.deleteConfirm.show()
    },
    confirmDelete() {
      //确定删除商品
      let Pindex = this.deleteProductPIndex
      let Cindex = this.deleteProductCIndex
      deleteCart(this.shopCart[Pindex].goods[Cindex].carInfoId).then(res => {
        if (res.success) {
          this.$refs.deleteConfirm.hide()
          this._initCartList()
        } else {
          this.$refs.deleteConfirm.hide()
          this.setToastMsg(res.msg)
        }
      })
    },
    cancelDelete() {
      //取消删除商品
      this.deleteProductPIndex = -1
      this.deleteProductCIndex = -1
      this.$refs.deleteConfirm.hide()
    },
    calcTotalPrice() {
      //计算合计总金额
      var _this = this
      _this.totalMoney = 0
      _this.totalCount = 0
      _this.needSettledGoods = [] //操作前先清空数组，避免重复数据添加
      _this.hasLowerGoods = false
      _this.shopCart.forEach(function (item, index) {
        if (item.checked) {
          item.goods.forEach(function (CItem, CIndex) {
            if (CItem.specificationsId) {
              //排除掉规格已下架的商品
              _this.needSettledGoods.push(CItem)
            } else {
              //标记当前选中的待结算商品中有规格已下架的商品
              _this.hasLowerGoods = true
            }
            let price = CItem.price ? CItem.price : 0
            _this.totalMoney += price * CItem.num
            _this.totalCount++
          })
        } else {
          item.goods.forEach(function (CItem, CIndex) {
            if (CItem.checked) {
              if (CItem.specificationsId) {
                //排除掉规格已下架的商品
                _this.needSettledGoods.push(CItem)
              } else {
                //标记当前选中的待结算商品中有规格已下架的商品
                _this.hasLowerGoods = true
              }
              let price = CItem.price ? CItem.price : 0
              _this.totalMoney += price * CItem.num
              _this.totalCount++
            }
          })
        }
      })
      this.getCashBachMoney() //实时获取返现金额
    },
    addCart(Pindex, Cindex) {
      //添加数量
      this.shopCart[Pindex].goods[Cindex].num++
      this.$set(this.$data.shopCart, Pindex, this.$data.shopCart[Pindex])
    },
    reduceCart(Pindex, Cindex) {
      //减少数量
      if (this.shopCart[Pindex].goods[Cindex].num > 1) {
        this.shopCart[Pindex].goods[Cindex].num--
        this.$set(this.$data.shopCart, Pindex, this.$data.shopCart[Pindex])
      }
    },
    selectNorms(Cindex, item) {
      //选择规格
      selectGoodsspecifications(item.goodsId, this.userToken).then(res => {
        if (res.success) {
          this.goodsSpecs = res.data
          this.selectedGood = item
          console.log(this.selectedGood)
          this.selectedNormId = this.selectedGood.specificationsId

          let goodsJson = this._formatGoodsJson2([this.selectedGood])
          getAllPromotionDiscount(goodsJson, this.userToken).then(res => {
            if (res.success) {
              this.returnMoney = res.discountPrice
              this.promotionType = res.promotionType
              this.nowLessPrice = res.nowLessPrice
            }
          })
          this.showPopup = true
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    closePopup() {
      //关闭选择规格弹窗
      this.showPopup = false
    },
    changeNorms(item) {
      //彈窗中規格切換事件
      this.selectedNormId = item.id
      this.selectedGood.specificationsId = item.id
      this.selectedGood.specificationsName = item.name
      this.selectedGood.price = item.discountPrice
      this.selectedGood.stock = item.stock
      this.selectedGood.originalPrice = item.price
      this.selectedGood.barCod = item.barCod

      let goodsJson = this._formatGoodsJson2([this.selectedGood])
      getAllPromotionDiscount(goodsJson, this.userToken).then(res => {
        if (res.success) {
          this.returnMoney = res.discountPrice
          this.promotionType = res.promotionType
          this.nowLessPrice = res.nowLessPrice
        }
      })
    },
    confirmChange() {
      //確定重新選擇的商品規格
      this.selectedGood.specificationsId = this.selectedNormId
      this.closePopup()
    },
    settle() {
      //结算
      if (this.totalCount === 0) {
        this.setToastMsg('您还没有选择宝贝喔！')
        return
      }
      if (this.hasLowerGoods) {
        this.alertText = '您选的部分商品规格已下架，请重新选中规格哟！'
        this.$refs.alertWindow.show()
        return
      }
      let goodsJson = this._formatGoodsJson(this.needSettledGoods)
      this.setGoodsJson(goodsJson) //写入state
      localStorage.setItem('goodsJson', goodsJson) //存入缓存
      this.$router.push('/confirmorder')
    },
    //获取待返现金额
    getCashBachMoney() {
      let goodsJson = this._formatGoodsJson2(this.needSettledGoods)
      if (this.needSettledGoods.length > 0) {
        getAllPromotionDiscount(goodsJson, this.userToken).then(res => {
          if (res.success) {
            this.discountTotal = res.discountPrice
          } else {
            this.discountTotal = 0
          }
        })
      }
    },
    ...mapMutations({
      setGoodsJson: 'SET_GOODSJSON',
      setgoodid: 'SET_GOODSID'
    })
  },
  watch: {
    shopCart(newVal) {
      if (newVal) {
        //重新计算总价
        this.calcTotalPrice()
        if (this.totalMoney === 0) {
          this.selectAllFlag = false
        }
      }
    }
  },
  components: {
    MHeader,
    HomeList,
    Alert,
    MtPopup,
    Confirm
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .shopcart
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    font-size: 14/$cale+rem
    color: $text_color
    background-color: $shopcart-bg
    .shopcart-wrapper
      position: fixed
      top: 44/$cale+rem
      bottom: 49/$cale+rem
      overflow: hidden
      width: 100%
    .scroll-inner
      padding-bottom: 30/$cale+rem
    .goods
      margin-bottom: 30/$cale+rem
      background-color: $shopcart-bg
      .goods-item
        margin-bottom: 10/$cale+rem
        background-color: $white
        &:last-child
          margin-bottom: 0
        .iconCheck
          display: inline-block
          +bg-image('./uncheck')
          background-size: 100% 100%
          +size(18/ $cale + rem)
          margin: 1/$cale+rem 9/$cale+rem 1/$cale+rem 15/$cale+rem
          +extend-click()
          &.active
            +bg-image('./checked')
        .item-title
          padding: 11/$cale+rem 0
          .title
            line-height: 20/$cale+rem
            vertical-align: top
          .edit
            padding: 0 15/$cale+rem
            line-height: 20/$cale+rem
            color: $text_lighter
        .product
          display: flex
          .iconCheck
            margin-top: 47/$cale+rem
            margin-bottom: 47/$cale+rem
        .product-info
          flex: 1
          display: flex
          border-top: 1px solid $mall-border-base
          padding: 12/$cale+rem 15/$cale+rem 12/$cale+rem 0
          .pic
            +size(88/$cale+rem)
          .detail
            flex: 1
            display: flex
            justify-content: space-between
            .left
              padding-left: 12/$cale+rem
              padding-right: 12/$cale+rem
              .name
                line-height: 20/$cale+rem
                color: $text_light
                margin-bottom: 3/$cale+rem
              .norms
                font-size: 12/$cale+rem
                color: $text_lighter
              .tip
                font-size: 12/$cale+rem
                padding-top: 10/$cale+rem
                color: red
            .right
              text-align: right
              width: 70/$cale+rem
              .price
                line-height: 20/$cale+rem
                font-size: 14/$cale+rem
                font-weight: 600
                color: $mall-main
              .oldprice
                color: #dedede
                font-size: 14/$cale+rem
                text-decoration: line-through
              .count
                line-height: 18/$cale+rem
                font-size: 13/$cale+rem
                color: $text_lighter
              .fightGroups
                line-height: 20/$cale+rem
                font-size: 14/$cale+rem
                color: $pink
                padding-top: 10/$cale+rem
                +extend-click()
          .edit-area
            flex: 1
            display: flex
            .operate
              flex: 1
              padding: 0 (10/$cale+rem)
              .num-operate
                padding-bottom: 18/$cale+rem
                font-size: 0
                .minus,.plus
                  display: inline-block
                  +bg-image('./minus')
                  background-size: 100% 100%
                  +size(22/$cale + rem)
                  vertical-align: top
                  +extend-click()
                .plus
                  +bg-image('./plus')
                .goods-count
                  display: inline-block
                  line-height: 22/$cale + rem
                  width: 94/$cale + rem
                  text-align: center
                  font-size: 14/$cale + rem
                  color: $text_light
              .norms-operate
                padding: (3/$cale + rem) (2/$cale + rem)
                border: 1px solid $mall-border-base
                display: flex
                justify-content: space-between
                .name
                  line-height: 14/$cale + rem
                  font-size: 12/$cale + rem
                  color: $text_lighter
                .iconEdit
                  display: inline-block
                  +bg-image('./edit')
                  background-size: 100% 100%
                  +size(12/$cale + rem)
                  margin: 1px 0
                  +extend-click()
              .tip
                font-size: 10/$cale+rem
                padding-top: 6/$cale+rem
                color: red
            .delete
              flex: 0 0 87/$cale+rem
              +size(87/$cale+rem,112/$cale+rem)
              background-color: $mall-main
              color: $white
              text-align: center
              line-height: 112/$cale+rem
              margin: (-12/$cale+rem) (-15/$cale+rem) (-12/$cale+rem) 0
      .no-goods
        padding: 42/$cale+rem 0
        text-align: center
        background-color: $white
        .pic
          +bg-image('./empty')
          background-size: 100% 100%
          +size(148/ $cale + rem)
          margin: 0 auto 10/$cale+rem
        .text
          color: $text_lighter
          line-height: 20/$cale+rem
    .recommonds
      padding-top: 10/$cale+rem
      background-color: $white
      .title
        line-height: 22/$cale+rem
        font-size: 16/$cale+rem
        color: $text_color
        font-weight: 600
        text-align: center
    .fixed_settle
      position: fixed
      bottom: 0
      left: 0
      z-index: 110
      +size(100%,49/$cale+rem)
      display: flex
      background-color: $white
      .check-money
        flex: 1
        display: flex
        justify-content: space-between
        .check-area
          font-size: 0
          padding: 14/$cale+rem 0 15/$cale+rem 10/$cale+rem
          .iconCheck
            display: inline-block
            +bg-image('./uncheck')
            background-size: 100% 100%
            +size(18/ $cale + rem)
            margin: 1/$cale+rem 6/$cale+rem 1/$cale+rem 0
            +extend-click()
          .txt
            line-height: 20/$cale+rem
            vertical-align: top
            font-size: 14/$cale+rem
          &.active
            .iconCheck
              +bg-image('./checked')
        .cash-money
          flex: 1
          line-height: 22/$cale+rem
          color: $mall-main
          padding: 5/$cale+rem 6/$cale+rem 5/$cale+rem 0
          font-size: 12/$cale+rem
          text-align: right
          .money
            font-size: 16/$cale+rem
            margin-left: 5/$cale+rem
          .cashBack
            color: $text_light
            font-size: 11/$cale+rem
        .total-money
          flex: 1
          line-height: 22/$cale+rem
          color: $mall-main
          padding: 15/$cale+rem 10/$cale+rem
          font-size: 12/$cale+rem
          text-align: right
          .money
            font-size: 16/$cale+rem
            margin-left: 5/$cale+rem
      .btn-settle
        flex: 0 0 105/$cale+rem
        +size(105/$cale+rem,49/$cale+rem)
        background-color: $mall-main
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
        color: $white
        padding: 14/$cale+rem 0 15/$cale+rem
        text-align: center
        .count
          margin-left: 8/$cale+rem
  .editNorms
    +size(100%,447/$cale+rem)
    .editNorms-wrapper
      +size(100%)
      position: relative
      .goods-info
        padding: (15/$cale+rem) 0
        margin: 0 (10/$cale+rem)
        display: flex
        position: relative
        +border-1px($mall-border-base)
        .goods-pic
          +size(118/$cale+rem)
          margin-right: 20/$cale+rem
          margin-top: -38/$cale+rem
          border-radius: 4/$cale+rem
        .info
          flex: 1
          padding-top: 10/$cale+rem
          .price
            line-height: 21/$cale+rem
            font-size: 15/$cale+rem
            color: $mall-main
            padding-bottom: 2/$cale+rem
          .oldprice
            color: #dedede
            font-size: 0.37333rem
            text-decoration: line-through
          .stocky
            line-height: 20/$cale+rem
            padding-bottom: 2/$cale+rem
          .norms
            line-height: 20/$cale+rem
            .txt
              padding-left: 8/$cale+rem
        .iconClose
          margin-right: 3/$cale+rem
          +bg-image('./close')
          background-size: 100% 100%
          +size(12/ $cale + rem)
          +extend-click()
      .norms-list
        margin: 0 (10/$cale+rem)
        border-bottom: 1px solid $mall-border-base
        .title
          padding: 8/$cale+rem 0 11/$cale+rem
          line-height: 22/$cale+rem
          font-size: 16/$cale+rem
        .norms-ul
          overflow: hidden
        .norms-item
          float: left
          padding: 4/$cale+rem 13/$cale+rem
          margin-right: 15/$cale+rem
          margin-bottom: 10/$cale+rem
          background-color: #f5f5f5
          color: $text_light
          line-height: 17/$cale+rem
          font-size: 12/$cale+rem
          border-radius: 4/$cale+rem

          &.active
            background-color: $mall-main
            color: $white
      .btn-query
        +position(absolute,(bottom 0 left 0))
        width: 100%
        line-height: 48/$cale+rem
        text-align: center
        color: $white
        background-color: $mall-main
</style>