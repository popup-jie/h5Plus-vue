<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" ref="inputBox" :placeholder="placeholder" v-model="query">
    <i class="icon-delete" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/tools'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '请输入搜索内容'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear(){
        this.query = ''
      },
      setQuery(query){
        this.query = query
      },
      blur(){
        this.$refs.inputBox.blur()
      }
    },
    created(){
      this.$watch('query',debounce((newQuery)=>{
        this.$emit('search',newQuery)
      },200))
    }
  }
</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .search-box
    position: relative
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-background
    border-radius: 6px
    font-size: 0
    .icon-search,.icon-delete
      display: inline-block
      +size(18px)
    .icon-search
      position: absolute
      left: 8px
      top: 11px
      background: url("icon_search.png") no-repeat
      background-size: 100% 100%
    .box
      flex: 1
      margin: 0 30px
      line-height: 18px
      background: $color-background
      color: #7a797b
      font-size: 14px
      &::placeholder
        color: #7a797b
    .icon-delete
      position: absolute
      right: 8px
      top: 11px
      background: url("icon_delete.png") no-repeat
      background-size: 100% 100%
</style>
