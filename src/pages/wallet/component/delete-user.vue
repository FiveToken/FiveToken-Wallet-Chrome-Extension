
<template>
    <div class="delete-component">
       <div class="delete-title">{{ $t('wallet.deleteTitle') }}</div>
       <div class="close" @click="closeDelete">
           <i class="el-icon-close"></i>
       </div>
       <div class="delete-content">
           {{$t('wallet.deleteTips')}}
       </div>
       <div class="btn-wrap">
           <kyButton @btnClick="closeDelete">{{ $t('wallet.cancel') }}</kyButton>
           <kyButton :type="'primary'" :active="true" @btnClick="confirmDelete">
               {{ $t('wallet.confirm') }}
            </kyButton>
       </div>
    </div>
</template>

<script>
import kyButton from '@/components/button'
export default {
  data () {
    return { }
  },
  components: {
    kyButton
  },
  methods: {
    confirmDelete (val) {
      this.$emit('confirmDelete')
    },
    closeDelete () {
      this.$emit('closeDelete')
    }
  }
}
</script>

<style  lang="less" scoped>
.delete-component{
    position: relative;
    padding: 0 0 20px;
    .delete-title{
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
    .delete-content{
        padding: 20px;
        overflow-y: auto;
        .netwotk-item{
            height: 50px;
            line-height: 50px;
            position: relative;
            cursor: pointer;
            color: #131313;
            font-size: 14px;
            padding: 0 10px;
        }
    }
    .btn-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        /deep/.button-wrap{
            width: 105px;
        }
    }
}
</style>
