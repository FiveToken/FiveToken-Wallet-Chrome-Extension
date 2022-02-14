<template>
  <ky-layout @layoutMounted="layoutMounted">
    <div class="add-token-page">
      <div class="back-wrap">
        <ky-back @pageBack="back" :name="$t('addToken.addToken')" />
      </div>
      <div class="add-content">
        <div class="input-item">
          <div class="label">{{ $t("addToken.contractAddress") }}</div>
          <ky-input
            :value="contract"
            @changeInput="changeInput"
            @blur="contractInput"
          />
          <div class="error" v-if="isExists">{{ $t("addToken.error") }}</div>
          <div class="error" v-if="error">{{ $t("addToken.addressError") }}</div>
        </div>
        <div class="info" v-if="contractEffective">
          <div class="logo">
            <ky-canvas :contract="contract"/>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.contractAddress") }}:</div>
            <div class="value">
              <div class="text">{{contract}}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.token") }}:</div>
            <div class="value">
              <div class="text">{{name}}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.tokenSymbol") }}:</div>
            <div class="value">
              <div class="text">{{symbol}}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.decimalPoint") }}</div>
            <div class="value">
              <div class="text">{{decimals}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <ky-button
          :type="'primary'"
          @btnClick="addContract"
          :active="active"
        >
          {{ $t("addToken.addToken") }}
        </ky-button>
      </div>
      <!-- <kyCanvas /> -->
      <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img"/>
      </div>
    </div>
  </ky-layout>
</template>
<script>
import { ethers } from 'ethers'
import ABI from '@/utils/abi'
import { mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
import { trimStr } from '@/utils'
export default {
  data () {
    return {
      contract: '',
      loading: require('@/assets/image/loading.png'),
      isFetch: false,
      provider: null,
      contractEffective: false,
      decimals: '',
      symbol: '',
      name: '',
      tokenList: [],
      isExists: false,
      logoArr: [],
      localStore: null,
      error: ''
    }
  },
  computed: {
    ...mapState('app', ['rpc', 'address']),
    active () {
      let v = false
      v = this.contract !== '' && this.contractEffective && !this.isExists
      return v
    }
  },
  methods: {
    async layoutMounted () {
      const localStore = new ExtensionStore()
      this.localStore = localStore
      const _tokenList = await localStore.get('tokenList')
      if (_tokenList) {
        const tokenList = _tokenList.filter(n => {
          return (n.rpc === this.rpc) && (n.address === this.address)
        })
        this.tokenList = tokenList
      }
    },
    changeInput (val) {
      this.contract = val
      this.error = ''
      this.contractEffective = false
    },
    contractInput (val) {
      if (this.contract) {
        this.isFetch = true
        const _contract = trimStr(this.contract)
        const that = this
        const isExists = this.tokenList.find(item => { return item.contract === _contract }) !== undefined
        this.isExists = isExists
        const provider = ethers.getDefaultProvider(this.rpc)
        const contract = new ethers.Contract(_contract, ABI, provider)
        const decimalsPromise = contract.decimals()
        const namePromise = contract.name()
        const symbolPromise = contract.symbol()
        Promise.all([decimalsPromise, namePromise, symbolPromise]).then((values) => {
          this.isFetch = false
          if (values.length === 3) {
            that.contractEffective = true
            that.decimals = values[0].toString()
            that.name = values[1]
            that.symbol = values[2]
          }
        }).catch(err => {
          this.isFetch = false
          that.contractEffective = false
          that.decimals = ''
          that.name = ''
          that.symbol = ''
          if (err && err.reason && err.reason.indexOf('resolver or addr is not configured for ENS name') > -1) {
            this.error = this.$t('addToken.addressError')
          } else {
            this.error = ''
          }
        })
      }
    },
    back () {
      this.$router.go(-1)
    },
    async addContract () {
      const _contract = trimStr(this.contract)
      if (this.contractEffective && !this.isExists) {
        const allTokenList = await this.localStore.get('tokenList') || []
        await this.localStore.set({
          tokenList: [
            ...allTokenList,
            {
              chainName: this.name,
              decimals: this.decimals,
              rpc: this.rpc,
              symbol: this.symbol,
              contract: _contract,
              address: this.address
            }
          ]
        }).then(res => {
          window.location.href = './wallet.html'
        })
      }
    }
  }
}
</script>

<style  lang="less" scoped>
.add-token-page {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  .back-wrap {
    padding: 15px 20px;
    border-bottom: 1px solid #f6f7ff;
  }
  .add-content {
    padding: 20px;
    .input-item {
        margin-bottom: 30px;
        .label {
            color: #101010;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 8px;
        }
        .error{
            font-size: 12px;
            color: #EA0F0F;
            padding-top: 10px;
        }
    }
    .info {
      border: 1px solid #e6f0f0;
      border-radius: 5px;
      .logo{
        margin: 20px auto;
      }
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e6f0f0;
        padding: 10px;
        &:last-child {
          border-bottom: none;
        }
        .label {
          font-size: 14px;
          color: #737171;
          line-height: 20px;
          flex-shrink: 0;
        }
        .value {
          padding-left: 20px;
          flex-grow: 1;
          display: flex;
          justify-content: flex-end;
          .text {
            font-size: 14px;
            color: #101010;
            line-height: 20px;
            word-break: break-all;
            text-align: left;
          }
        }
      }
    }
  }

  .btn-wrap {
    padding: 0 20px;
    position: absolute;
    width: 100%;
    bottom: 20px;
    left: 0;
    box-sizing: border-box;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    .img{
            animation:turnX 3s linear infinite;
        }
        @keyframes turnX{
            0%{
                transform:rotateZ(0deg);
            }
            100%{
                transform:rotateZ(360deg);
            }
        }
  }
}
</style>
