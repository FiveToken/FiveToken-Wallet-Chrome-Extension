
<template>
    <div class="delete-component">
       <div class="delete-title">{{ $t('wallet.deleteTitle') }}</div>
       <div class="close" @click="closeDelete">
           <i class="el-icon-close"></i>
       </div>
       <div class="delete-content">
         <div class="tips"> {{$t('wallet.deleteTips')}} </div>
          <div class="input-item">
            <div class="label">{{$t('wallet.deleteLabel')}}</div>
            <ky-input
              :value="password"
              :type="passwordType"
              :suffix="suffix"
              @changeInput="passwordChange"
              @changeEye="passwordEye"
            >
            </ky-input>
        </div>
       </div>

       <div class="btn-wrap">
           <ky-button @btnClick="closeDelete">{{ $t('wallet.cancel') }}</ky-button>
           <ky-button :type="'primary'" :active="active" @btnClick="confirmDelete(active)">
               {{ $t('wallet.confirmDelete') }}
            </ky-button>
       </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { decryptByPrivateKey } from '@/utils/encrypt'
export default {
  data () {
    return {
      passwordType: 'password',
      suffix: true,
      password: ''
    }
  },
  computed: {
    ...mapState('app', ['privateKey', 'address']),
    active () {
      return this.password !== ''
    }
  },
  methods: {
    passwordChange (val) {
      this.password = val
    },
    passwordEye (eye) {
      this.passwordType = eye ? 'text' : 'password'
    },
    async confirmDelete (val) {
      if (val) {
        const voild = await decryptByPrivateKey(this.privateKey, this.password, this.address)
        if (voild) {
          this.$emit('confirmDelete')
        }
      }
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
        .tips{
          margin-bottom: 10px;
        }
        .label{
          margin-bottom: 5px;
        }
    }
    .btn-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        /deep/.button-wrap{
            width: 48%;
        }
    }
}
</style>
