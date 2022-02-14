<template>
<div class="address-form">
    <div class="back-wrap">
        <ky-back
            @pageBack="back"
            :name="pageName"
        />
    </div>
    <div class="form-content">
        <div class="input-item">
            <div class="label">{{$t('settingAddress.name')}}</div>
            <ky-input :value="form.accountName" @changeInput="editFormChange(arguments,'accountName')"></ky-input>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingAddress.address')}}</div>
            <ky-input :value="form.address" @changeInput="editFormChange(arguments,'address')"></ky-input>
            <div class="error" v-if="editAddressError">{{$t('settingAddress.addressError')}}</div>
        </div>
        <div class="position">
            <div class="btn-box" :class="{two:detail}">
                <ky-button @btnClick="deleteAddress" v-if="detail">{{$t('settingAddress.delete')}}</ky-button>
                <ky-button :type="'primary'" :active="active" @btnClick="save">
                    {{$t('settingAddress.confirm')}}
                </ky-button>
            </div>
        </div>
    </div>
    <el-dialog
        :visible.sync="deleteAddressVisible"
        width="300px"
        :show-close="false"
        :top="'50vh'"
    >
        <deleteAdress
            @confirmDelete="confirmDelete"
            @closeDelete="closeDelete"
        />
    </el-dialog>
    <div class="mask" v-if="mask"></div>
</div>
</template>

<script>
import { isValidAddress } from '@/utils'
import ClipboardJS from 'clipboard'
import { mapState } from 'vuex'
import deleteAdress from './delete-address.vue'
import ExtensionStore from '@/utils/local-store'
export default {
  components: {
    deleteAdress
  },
  props: {
    pageType: String,
    detail: Object,
    to: String,
    addressBook: Array,
    editAddress: String
  },
  data () {
    return {
      deleteAddressVisible: false,
      mask: false,
      form: {
        accountName: '',
        address: ''
      },
      editAddressError: '',
      localStore: null
    }
  },
  computed: {
    ...mapState('app', ['rpc', 'networkType', 'accountList']),
    pageName () {
      let str = ''
      if (this.detail) {
        str = this.$t('settingAddress.editAddress')
      } else {
        str = this.$t('settingAddress.addAddress')
      }
      return str
    },
    active () {
      let vol = false
      const values = Object.values(this.form)
      vol = values.every(n => n !== '')
      return vol
    }
  },
  watch: {
    detail: {
      handler (newval, old) {
        if (newval) {
          this.form = Object.assign({}, this.form, { ...newval })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
  },
  methods: {
    async confirmDelete () {
      const that = this
      const _addressBook = this.addressBook
      if (_addressBook.length) {
        const restAddressBook = _addressBook.filter(n => n.address !== this.editAddress)
        await this.localStore.set({
          addressBook: restAddressBook
        })
        that.deleteAddressVisible = false
        that.$emit('deleteAddressCb')
        that.$message({
          type: 'success',
          message: that.$t('settingAddress.deleteSuccess'),
          duration: 1000
        })
      }
    },
    closeDelete () {
      this.deleteAddressVisible = false
    },
    deleteAddress () {
      this.deleteAddressVisible = true
    },
    editFormChange (arg, key) {
      if (arg) {
        const value = arg[0]
        this.$set(this.form, key, value)
        this.editAddressError = ''
      }
    },
    back () {
      this.$emit('update:pageType', 'list')
    },
    async check () {
      if (this.active) {
        const voild = await isValidAddress(this.form.address, this.networkType)
        if (voild) {
          return true
        } else {
          this.editAddressError = '1'
          return false
        }
      } else {
        return false
      }
    },
    async save () {
      const voild = await this.check()
      const allAddress = await this.localStore.get('addressBook') || []
      if (voild) {
        if (this.detail) {
          if (allAddress) {
            const restAddressBook = allAddress.filter(n => n.address !== this.editAddress)
            await this.localStore.set({
              addressBook: [
                ...restAddressBook,
                {
                  rpc: this.rpc,
                  address: this.form.address,
                  accountName: this.form.accountName
                }
              ]
            })
            this.form = Object.assign({}, this.form, { accountName: this.form.accountName, address: this.form.address })
            this.$message.success(this.$t('settingAddress.editSuccess'))
            this.$emit('addEditAddressCb')
          }
        } else {
          const isExist = this.addressBook.filter(n => {
            return n.address === this.form.address
          })
          if (isExist.length) {
            this.$message.error(this.$t('settingAddress.addressIsExist'))
          } else {
            this.localStore.set({
              addressBook: [
                ...allAddress,
                {
                  address: this.form.address,
                  accountName: this.form.accountName,
                  rpc: this.rpc
                }
              ]
            })

            this.$emit('addEditAddressCb')
          }
        }
      }
    },
    copyAddress () {
      this.mask = true
      const that = this
      const clipboard = new ClipboardJS('.copy-box')
      clipboard.on('success', function (e) {
        that.$message({
          type: 'success',
          message: that.$t('settingAddress.copySuccess'),
          duration: 1500,
          onClose: () => {
            that.mask = false
          }
        })
      })
      clipboard.on('error', function (e) {})
    },
    close () {
      this.$emit('update:pageType', 'list')
    }
  }
}
</script>

<style  lang="less" scoped>
/deep/.el-dialog{
    margin: 0 auto;
    border-radius: 10px;
    margin-top: 50vh;
    transform: translateY(-50%);
}
/deep/.el-dialog__header{
    padding:0;
}
/deep/.el-dialog__body{
    padding: 0;
}
/deep/.el-dialog__footer{
    padding: 30px;
    border-top:1px solid #eee;
}
.address-form{
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 999;
    }
    .back-wrap{
        padding:  15px 20px;
        border-bottom: 1px solid #F6F7FF;
    }
    .form-content{
        padding: 20px;
        position: relative;
        height: 500px;
        .input-item{
            margin-bottom: 20px;
            .label{
                margin-bottom: 10px;
                font-size: 14px;
                color: #101010;
            }
            .error{
                padding-top: 5px;
                font-size: 12px;
                color: #FD334C;
            }
        }
    }

    .position{
        position: absolute;
        bottom:20px;
        left: 20px;
        width: calc(100% - 40px);
        .btn-box{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            &.two{
                justify-content: space-between;
                /deep/.button-wrap{
                    width: 155px;
                }
            }
            /deep/.button-wrap{
                width: 100%;
            }
        }
    }
}
</style>
