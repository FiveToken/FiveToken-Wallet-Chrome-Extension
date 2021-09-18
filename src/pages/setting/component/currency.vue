
<template>
    <div class="select-currency-component">
       <div class="title-currency">{{ $t('setting.titleCurrency') }}</div>
       <div class="close" @click="close">
           <i class="el-icon-close"></i>
       </div>
       <div class="currency-list">
           <div class="currency-item" v-for="(item,index) in $t('setting.currencyList')" :key="index" @click="confirm(item)">
               {{ item.label }}
               <i class="el-icon-check check" v-if="currency === item.value"></i>
            </div>
       </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return { }
  },
  computed: {
    ...mapState('app', [
      'currency'
    ])
  },
  methods: {
    confirm (val) {
      this.$emit('confirm', val)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style  lang="less" scoped>
.select-currency-component{
    position: relative;
    .title-currency{
        height: 43px;
        line-height: 43px;
        font-size: 14px;
        color: #101010;
        border-bottom:1px solid #F5F5F5;
        text-align: center;
    }
    .close{
        width: 20px;
        height: 20px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        i{
            color: #201F1F;
        }
    }
    .currency-list{
        max-height: 300px;
        overflow-y: auto;
        .currency-item{
            height: 50px;
            line-height: 50px;
            position: relative;
            cursor: pointer;
            color: #131313;
            font-size: 14px;
            padding: 0 20px;
            font-weight: bold;
            &::before{
                width: calc(100% - 40px);
                height: 1px;
                content: '';
                position: absolute;
                bottom: 0;
                left: 10px;
                background: #E6F0F0;
            }
            &:hover{
                background: #f5f5f5;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }
            .check{
                position: absolute;
                top: 50%;
                right: 15px;
                color: #4EC1C9;
                font-size: 14px;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
