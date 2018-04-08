<template>
  <div class="address-picker">
    <div class="address-wrapper" v-show="addressPicker">
      <div class="address-title" v-show="showFlag">
        <span class="error-icon" @click="close">×</span>
        <span class="heaer-title">请选择城市</span>
        <span class="confirm" @click="confirm">确定</span>
      </div>
      <mt-picker class="addressPicker" :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
    </div>
    <div class="street-wrapper" v-show="streetPicker">
      <div class="address-title" v-show="showFlag">
        <span class="error-icon" @click="close">×</span>
        <span class="heaer-title">请选择街道</span>
        <span class="confirm" @click="confirm">确定</span>
      </div>
      <mt-picker :value-key="'name'" class="streetPicker" :slots="streetSlots" ref="picker" @change="onStreetChange" :visible-item-count="5"></mt-picker>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
// import s from 'common/json/address4.json'
import Picker from 'mint-ui/lib/picker'
import 'mint-ui/lib/picker/style.css'
import { getAreaList } from 'api/getAreaList'

// export default {
//   props: {
//     addressPicker: {
//       type: Boolean,
//       default: false
//     },
//     streetPicker: {
//       type: Boolean,
//       default: false
//     },
//     showFlag: {
//       type: Boolean,
//       default: true
//     }
//   },
//   data() {
//     return {
//       addressData: [
//         {id: 1, areaNo: 123, name: '广东',level: 1,pid: 0},
//         {id: 2, areaNo: 123, name: '福建',level: 1,pid: 0},
//         {id: 3, areaNo: 123, name: '上海',level: 1,pid: 0},
//         {id: 4,areaNo: 1234,name: '深圳',level: 2,pid: 1},
//         {id: 5,areaNo: 1234,name: '厦门',level: 2,pid: 2},
//         {id: 6,areaNo: 1234,name: '市辖区',level: 2,pid: 3},
//         {id: 7,areaNo: 1235,name: '宝安区',level: 3,pid: 4},
//         {id: 8,areaNo: 1235,name: '思明区',level: 3,pid: 5},
//         {id: 9,areaNo: 1235,name: '黄埔区',level: 3,pid: 6}
//         ],
//       addressSlots: [
//         {
//           flex: 1,
//           defaultIndex: 1,
//           values:this.addressData,
//           className: 'slot1',
//           textAlign: 'center'
//         },
//         {
//           divider: true,
//           content: '-',
//           className: 'slot2'
//         },
//         {
//           flex: 1,
//           values: [],
//           className: 'slot3',
//           textAlign: 'center'
//         },
//         {
//           divider: true,
//           content: '-',
//           className: 'slot4'
//         },
//         {
//           flex: 1,
//           values: [],
//           className: 'slot5',
//           textAlign: 'center'
//         }
//       ],
//       streetSlots: [
//         {
//           flex: 1,
//           values: [],
//           className: 'slot1',
//           textAlign: 'center'
//         }
//       ],
//       addressProvince: '省',
//       addressCity: '市',
//       addressXian: '区',
//       addressStreet: '街道',
//     }
//   },
//   activated() {
//     this._getAreaList()
//   },
//   methods: {
//     show() {
//       this.addressPicker = true
//       this.streetPicker = true
//       this.$emit('show')
//     },
//     hide() {
//       this.addressPicker = false
//       this.streetPicker = false
//       this.$emit('hide')
//     },
//     close() {
//       this.hide()
//       this.$emit('close')
//     },
//     confirm() {
//       this.hide()
//       this.$emit('confirm')
//       this.$emit('selectAddressFinish', this.addressProvince, this.addressCity, this.addressXian)
//       this.$emit('selectStreetFinish', this.addressStreet)
//     },
//     onAddressChange(picker, values) {//选择省市区
//       // let sheng = Object.keys(s);
//       // console.log('sheng='+sheng);

//       console.log('picker='+JSON.stringify(picker))
//       console.log('values='+values);
//       let shi = Object.keys(s[values[0]]);
//       console.log('shi='+shi)
//       let index = shi.indexOf(values[1])
//       let xian = s[values[0]][shi[index]];// 某个市下面的所有县的集合
//       this.xianObj = xian;
//       picker.setSlotValues(0, sheng)
//       picker.setSlotValues(1, shi);// 把市的集合赋给第二个
//       picker.setSlotValues(2, Object.keys(xian));// 把县的集合赋给第三个value
//       this.addressProvince = values[0];//拿到省
//       this.addressCity = values[1];
//       this.addressXian = values[2];
//       if (!this.showFlag) {
//         this.$emit('selectAddressFinish', this.addressProvince, this.addressCity, this.addressXian)
//       }
//     },
//     onStreetChange(picker, values) {//选择街道
//       this.addressStreet = values[0]
//       if (!this.showFlag) {
//         this.$emit('selectStreetFinish', this.addressStreet)
//       }
//     },
//     _getAreaList() {
//       getAreaList().then((res) => {
//         if (res.success) {
//           console.log(res)
//         }
//       })
//     },

//   },
//   watch: {
//     'addressXian': {
//       handler(val, oval) {
//         let street = this.xianObj[this.addressXian]
//         this.streetSlots[0].values = street
//       }
//     },
//   },
//   mounted() {
//     var _this = this
//     this.$nextTick(function () {
//       // 初始化address-picker
//       // setTimeout(()=>{
//       _this.addressSlots[0].defaultIndex = 0
//       // },1000)
//     })
//   },
//   components: {
//     'mt-picker': Picker
//   }
// }
let s = [{ id: 1, areaNo: 123, name: '广东', level: 1, pid: 0 }]

export default {
  props: {
    addressPicker: {
      type: Boolean,
      default: false
    },
    streetPicker: {
      type: Boolean,
      default: false
    },
    showFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      addressData: [
        { id: 1, areaNo: 123, name: '广东', level: 1, pid: 0 },
        { id: 2, areaNo: 123, name: '福建', level: 1, pid: 0 },
        { id: 3, areaNo: 123, name: '上海', level: 1, pid: 0 },
        { id: 4, areaNo: 1234, name: '深圳', level: 2, pid: 1 },
        { id: 11, areaNo: 1234, name: '东莞', level: 2, pid: 1 },
        { id: 5, areaNo: 1234, name: '厦门', level: 2, pid: 2 },
        { id: 6, areaNo: 1234, name: '市辖区', level: 2, pid: 3 },

        { id: 7, areaNo: 1235, name: '宝安区', level: 3, pid: 4 },
        { id: 8, areaNo: 1235, name: '思明区', level: 3, pid: 5 },
        { id: 9, areaNo: 1235, name: '黄埔区', level: 3, pid: 6 },
        { id: 10, areaNo: 1235, name: '龙岗区', level: 3, pid: 4 }
      ],
      sheng: [],
      addressSlots: [
        {
          flex: 1,
          values: s,
          className: 'slot1',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot4'
        },
        {
          flex: 1,
          values: [],
          className: 'slot5',
          textAlign: 'center'
        }
      ],
      streetSlots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      addressProvince: '省',
      addressCity: '市',
      addressXian: '区',
      addressStreet: '街道'
    }
  },
  activated() {
    // this._getAreaList()
  },
  created() {
    this._calcaulateList()
  },
  methods: {
    show() {
      this.addressPicker = true
      this.streetPicker = true
      this.$emit('show')
    },
    hide() {
      this.addressPicker = false
      this.streetPicker = false
      this.$emit('hide')
    },
    close() {
      this.hide()
      this.$emit('close')
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
      this.$emit(
        'selectAddressFinish',
        this.addressProvince,
        this.addressCity,
        this.addressXian
      )
      this.$emit('selectStreetFinish', this.addressStreet)
    },
    onAddressChange(picker, values) {
      // this.$nextTick(() => {
      // console.log(this.sheng[values[0].name])
      picker.setSlotValues(2, this.sheng[values[0].name])
      console.log(this.sheng[values[0].name])
      // picker.setValues(
      //   this.sheng[values[0].name],
      //   this.sheng[values[0].name].children,
      //   this.sheng[values[0].name].children
      // )
      // })
      // picker.setSlotValues(0, s[0])
      // picker.setValues([values[0], values[0], values[0]])
      //选择省市区
      // let sheng = Object.keys(s)
      // console.log('sheng=' + sheng)

      // console.log('picker=' + picker)
      // console.log('values=' + values)
      // let shi = Object.keys(s[values[0]])
      // console.log('shi=' + shi)
      // let index = shi.indexOf(values[1])
      // let xian = s[values[0]][shi[index]] // 某个市下面的所有县的集合
      // this.xianObj = xian
      // console.log(this.sheng)
      // picker.setSlotValues(0, this.sheng)
      // picker.setSlotValues(1, s[1]) // 把市的集合赋给第二个
      // picker.setSlotValues(2, Object.keys(xian)) // 把县的集合赋给第三个value
      // this.addressProvince = values[0] //拿到省
      // this.addressCity = values[1]
      // this.addressXian = values[2]
      if (!this.showFlag) {
        this.$emit(
          'selectAddressFinish',
          this.addressProvince,
          this.addressCity,
          this.addressXian
        )
      }
    },
    onStreetChange(picker, values) {
      //选择街道
      this.addressStreet = values[0]
      if (!this.showFlag) {
        this.$emit('selectStreetFinish', this.addressStreet)
      }
    },
    _getAreaList() {
      getAreaList().then(res => {
        if (res.success) {
          console.log(res)
        }
      })
    },
    _calcaulateList() {
      let _arr = this.addressData.slice()

      const dict = _arr.reduce((all, item) => {
        all[item.id] = item
        return all
      }, {})

      var root = {
        id: 0
      }

      dict[0] = root

      _arr.forEach(item => {
        const parent = dict[item.pid]

        parent.children = parent.children || []
        parent.children.push(item)
      })
      this.addressData = root.children
      let _newArr = root.children
      // for (let j = 0; j < _newArr.length; j++) {
      //   this.sheng.push(_newArr[j])
      // }
      // s = this.sheng
      root.children.forEach((element, index) => {
        this.sheng[element.name] = element
      })
      // console.log(this.sheng)
      // console.log(Object.values(shengfen))
    }
  },
  watch: {
    addressXian: {
      handler(val, oval) {
        let street = this.xianObj[this.addressXian]
        this.streetSlots[0].values = street
      }
    }
  },
  mounted() {
    var _this = this
    this.$nextTick(function() {
      // 初始化address-picker
      // setTimeout(()=>{
      _this.addressSlots[0].defaultIndex = 0
      // },1000)
    })
  },
  components: {
    'mt-picker': Picker
  }
}
</script>

<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"
.address-wrapper,.street-wrapper
  width: 100%
  position: fixed
  top: 66%
  bottom: 0
  z-index: 1000
.address-title
  font-size: 12/$cale+rem 
  display: flex
  justify-content: space-between
  height: 35/$cale+rem
  padding: 0  15/$cale+rem  10/$cale+rem
  background: $gray-lighter
  line-height: 35/$cale+rem
  .error-icon
    font-size: 25/$cale+rem
    color: $gray 
  .confirm
    color: $mall-main
    font-size: 14/$cale+rem   
.addressPicker,.streetPicker
  background: $white
  height: 195/$cale+rem
.picker-items
  top: 8/$cale+rem 
  .picker-item
    color: $gray-light
  .picker-item.picker-selected
    color: #000   
.picker-slot
  font-size: 16/$cale+rem
</style>  