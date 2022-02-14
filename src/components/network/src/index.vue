
<template>
  <div class="select-network-component">
    <div class="title-network">{{ $t("importPrivatkey.titleNetwork") }}</div>
    <div class="close" @click="closeNetwork">
      <i class="el-icon-close"></i>
    </div>
    <div class="network-list">
      <div
        class="netwotk-item"
        v-for="(item, index) in networks"
        :key="index"
        @click="changeNetwork(item)"
      >
        <div class="img-wrap" v-if="item.disabled">
          <img
            class="img"
            :src="require(`@/assets/svg/${item.image}`)"
            alt=""
          />
        </div>
        <div class="custom-img" v-else>{{ item.name.substring(0, 1) }}</div>
        <div class="name">{{ item.name }}</div>
        <i class="el-icon-check check" v-if="rpc === item.rpc"></i>
      </div>
      <div class="custom-item netwotk-item" @click="skipToNetwork">
        <div class="img-wrap">
          <i class="el-icon-s-operation"></i>
        </div>
        <div class="name">{{ $t("header.customRpc") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isFilecoinChain } from '@/utils'
import changeNetwork from '@/minix/change-network'
import changeAccount from '@/minix/change-account'
import ExtensionStore from '@/utils/local-store'
export default {
  name: 'kyNetwork',
  mixins: [changeNetwork, changeAccount],
  data () {
    return {}
  },
  computed: {
    ...mapState('app', [
      'networks',
      'rpc',
      'activeAccount',
      'address',
      'networkType'
    ])
  },
  filter: {
    imageFormat (val) {
      const src = require(`@/assets/image/${val}`)
      return src
    }
  },
  methods: {
    async changeNetwork (obj) {
      const currentIsFileCoin = isFilecoinChain(this.networkType)
      const nextIsFileCoin = isFilecoinChain(obj.networkType)
      const currentAddress = this.address
      const localStore = new ExtensionStore()
      const accountList = await localStore.get('accountList')
      if (accountList) {
        const _accountList = accountList.filter(n => n.rpc === obj.rpc)
        if (_accountList.length) {
          await this.minixChangeNetwork(obj)
          if (currentIsFileCoin === nextIsFileCoin) {
            let same = null
            if (currentIsFileCoin) {
              const addressFirstCharacter = currentAddress.substring(1, currentAddress.length)
              same = _accountList.find((n) => {
                return n.address.indexOf(addressFirstCharacter) > -1
              })
            } else {
              same = _accountList.find((n) => {
                return n.address === currentAddress
              })
            }
            if (same) {
              await this.changeAccount(same)
            } else {
              const first = _accountList[0]
              await this.changeAccount(first)
            }
          } else {
            const first = _accountList[0]
            await this.changeAccount(first)
          }
        } else {
          this.$message({
            type: 'error',
            message: this.$t('wallet.noAccountTips'),
            duration: 3000
          })
        }
      }
    },
    async changeAccount (item) {
      await this.minixChangeAccount(item)
      this.settingVisible = false
      this.$emit('networkChange')
    },
    closeNetwork () {
      this.$emit('closeNetwork')
    },
    skipToNetwork () {
      window.location.href = './setting-networks.html'
    }
  }
}
</script>

<style  lang="less" scoped>
.select-network-component {
  position: relative;
  z-index: 100;
  .title-network {
    height: 43px;
    line-height: 43px;
    font-size: 14px;
    color: #101010;
    border-bottom: 1px solid #f5f5f5;
    text-align: center;
  }
  .close {
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
    i {
      color: #201f1f;
    }
  }
  .network-list {
    max-height: 300px;
    overflow-y: auto;
    .netwotk-item {
      height: 50px;
      line-height: 50px;
      position: relative;
      cursor: pointer;
      color: #131313;
      font-size: 14px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &::before {
        width: calc(100% - 40px);
        height: 1px;
        content: "";
        position: absolute;
        bottom: 0;
        left: 20px;
        background: #e6f0f0;
      }
      .img-wrap {
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        .img {
          width: 26px;
          height: 26px;
        }
      }
      &:nth-child(even) {
        .custom-img {
          background: #9261e8;
        }
      }
      &:nth-child(odd) {
        .custom-img {
          background: #5bc1ca;
        }
      }
      .custom-img {
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #fff;
        border-radius: 13px;
      }
      .name {
        padding-left: 10px;
        flex-grow: 1;
      }
      &:hover {
        background: #f5f5f5;
      }
      .check {
        position: absolute;
        top: 50%;
        right: 20px;
        color: #4ec1c9;
        font-size: 18px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
