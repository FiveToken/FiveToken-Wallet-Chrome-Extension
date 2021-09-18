
<template>
    <div class="add-component">
       <div class="title-add">{{ $t('account.titleAdd') }}</div>
       <div class="close" @click="closeAdd">
           <i class="el-icon-close"></i>
       </div>
       <div class="add-content">
           <div class="tips">{{ $t('account.addTips') }}</div>
           <div class="input-item">
               <div class="label">{{ $t('account.addLabel') }}</div>
               <kyInput :value="addName" @changeInput="changeInput" maxlength='15'/>
           </div>
           <div class="btn-wrap">
               <kyButton @btnClick="closeAdd">{{ $t('account.cancel') }}</kyButton>
               <kyButton @btnClick="confirmAdd" :type="'primary'" :active="active">
                   {{ $t('account.confirm') }}
                </kyButton>
           </div>
       </div>
    </div>
</template>

<script>
import kyInput from '@/components/input'
import kyButton from '@/components/button'
export default {
  data () {
    return { }
  },
  props: {
    addName: String
  },
  computed: {
    active () {
      return this.addName !== ''
    }
  },
  components: {
    kyInput,
    kyButton
  },
  methods: {
    changeInput (val) {
      this.$emit('update:addName', val)
    },
    confirmAdd () {
      this.$emit('confirmAdd')
    },
    closeAdd () {
      this.$emit('closeAdd')
    }
  }
}
</script>

<style  lang="less" scoped>
.add-component{
    position: relative;
    padding: 0 0 20px;
    .title-add{
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
    .add-content{
        padding: 0 20px;
        .tips{
            font-size: 12px;
            color: #888888;
            padding: 10px 0;
            line-height: 20px;
        }
        .input-item{
            margin-bottom: 30px;
            .label{
                font-size: 12px;
                color: #131313;
                margin-bottom: 5px;
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            /deep/.button-wrap{
                width: 105px;
            }
        }
    }
}
</style>
