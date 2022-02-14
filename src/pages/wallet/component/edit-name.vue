
<template>
    <div class="add-component">
       <div class="title-add">{{ $t('wallet.titleEdit') }}</div>
       <div class="close" @click="closeEdit">
           <i class="el-icon-close"></i>
       </div>
       <div class="add-content">
           <div class="input-item">
               <div class="label">{{ $t('wallet.editLabel') }}</div>
               <ky-input :value="addressName" @changeInput="changeInput" maxlength='15'/>
           </div>
           <div class="tips">{{ $t('wallet.editTips') }}</div>
           <div class="btn-wrap">
               <ky-button @btnClick="closeEdit">{{ $t('wallet.cancel') }}</ky-button>
               <ky-button @btnClick="confirmEdit" :type="'primary'" :active="active">
                   {{ $t('wallet.confirm') }}
                </ky-button>
           </div>
       </div>
    </div>
</template>

<script>
export default {
  props: {
    addressName: String
  },
  data () {
    return { }
  },
  computed: {
    active () {
      return this.addressName !== ''
    }
  },
  methods: {
    changeInput (val) {
      this.$emit('update:addressName', val)
    },
    confirmEdit () {
      this.$emit('confirmEdit')
    },
    closeEdit () {
      this.$emit('closeEdit')
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
        .input-item{
            padding-top: 20px;
            .label{
                font-size: 12px;
                color: #131313;
                margin-bottom: 5px;
            }
        }
        .tips{
            font-size: 12px;
            color: #888888;
            padding: 10px 0;
            line-height: 20px;
        }
        .btn-wrap{
            padding-top: 20px;
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
