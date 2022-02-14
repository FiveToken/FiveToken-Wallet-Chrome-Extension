<template>
  <ky-layout @layoutMounted="layoutMounted">
    <div class="send-fil">
      <step-one
        v-if="step === 1"
        :formData="formData"
        @formDataChange="formDataChange"
        @next="next"
      >
      </step-one>
      <step-two
        v-else
        :priceCurrency="priceCurrency"
        :formData="formData"
        :mainBalance="mainBalance"
        @formDataChange="formDataChange"
        @previousStep="step = 1"
        @sendSubmit="sendSubmit"
      >
      </step-two>
      <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img" />
      </div>
      <el-dialog
        :visible.sync="passwordVisable"
        width="300px"
        :show-close="false"
        class="password-verification"
        :top="'34vh'"
      >
        <password-verification
          v-if="passwordVisable"
          @confirm="confirmPassword"
          @close="closePassword"
        >
        </password-verification>
      </el-dialog>
    </div>
  </ky-layout>
</template>
<script>
import stepOne from './step-1'
import stepTwo from './step-2'
import passwordVerification from '@/components/password-verification'
import {
  formatNumber,
  bigNumbers,
  getQueryString,
  isFilecoinChain
} from '@/utils'
import { GlobalApi } from '@/api/index.js'
import { mapGetters, mapMutations, mapState } from 'vuex'
import ABI from '@/utils/abi'
import { ethers } from 'ethers'
import ExtensionStore from '@/utils/local-store'
import { decryptMessage, encrypt } from '@/utils/aes-gcm'
export default {
  components: {
    stepOne,
    stepTwo,
    passwordVerification
  },
  data () {
    return {
      loading: require('@/assets/image/loading.png'),
      passwordVisable: false,
      isFetch: false,
      step: 1,
      priceCurrency: 0,
      nonce: 0,
      maxNonce: 0,
      pkk: '',
      contractSigner: null,
      localStore: null,
      mainBalance: 0,
      formData: {
        balance: 0,
        to: '',
        toName: '',
        fil: '',
        symbol: '',
        chainName: '',
        decimals: 0,
        isAll: 0,
        isMain: -1,
        contract: ''
      }
    }
  },
  computed: {
    ...mapState('send-fil', [
      'serviceGas',
      'tokenList'
    ]),
    ...mapState('app', [
      'rpc',
      'address',
      'privateKey',
      'networkType',
      'accountList',
      'activeNetwork',
      'decimals',
      'rpcName',
      'ids',
      'symbol',
      'rpcImage',
      'currency'
    ]),
    ...mapGetters('send-fil', [
      'handlingFee'])
  },
  methods: {
    ...mapMutations('send-fil', [
      'SET_ACCOUNTLIST',
      'SET_ADDRESSBOOK',
      'SET_ADDRESSRECORDLAST',
      'SET_TOKENLIST',
      'SET_ACCOUNTLIST',
      'SET_ADDRESS',
      'SET_SERVICEGAS'
    ]),
    async layoutMounted () {
      const localStore = new ExtensionStore()
      this.localStore = localStore
      this.isFetch = true
      await this.getBalanceNonceByAddress()
      await this.getTokenList()
      this.isFetch = false
      this.getFilPricePoints()
      const myRecordLast = await localStore.get('addressRecordLast')
      if (myRecordLast) {
        const _myRecordLast = myRecordLast.filter(n => n.rpc === this.rpc)
        this.SET_ADDRESSRECORDLAST(_myRecordLast)
      }
      const addressBook = await localStore.get('addressBook')
      if (addressBook) {
        const _addressBook = addressBook.filter(n => n.rpc === this.rpc)
        this.SET_ADDRESSBOOK(_addressBook)
      }
      this.SET_ADDRESS(this.address)
      this.SET_ACCOUNTLIST(this.accountList)
    },
    // get token list
    async getTokenList () {
      try {
        let list = []
        const _tokenList = await this.localStore.get('tokenList')
        if (_tokenList) {
          list = _tokenList.filter(n => {
            return (n.rpc === this.rpc) && (n.address === this.address)
          })
        }
        const customNetwork = this.activeNetwork.disabled
        const mainToken = {
          rpc: this.rpc,
          chainName: this.rpcName,
          decimals: this.decimals,
          symbol: this.symbol,
          contract: '',
          balance: this.mainBalance,
          isMain: 1,
          image: this.rpcImage,
          customNetwork
        }
        const tokenList = [{
          ...mainToken
        }]
        const tokenSymbol = getQueryString('tokenSymbol')
        if (tokenSymbol === this.symbol) {
          this.formDataChange({
            key: 'token',
            value: mainToken
          })
        }
        const provider = ethers.getDefaultProvider(this.rpc)
        list.forEach(async (n) => {
          const contract = new ethers.Contract(n.contract, ABI, provider)
          contract.balanceOf(this.address).then((res) => {
            const balance = res.toString()
            const num = bigNumbers(balance)
            const big = num
              .dividedBy(Math.pow(10, Number(n.decimals)))
              .toString()
            const _balance = formatNumber(big, 12)
            const tokenItem = {
              ...n,
              balance: _balance,
              isMain: 0,
              chainName: this.formData.chainName,
              image: '',
              contract: n.contract
            }
            tokenList.push(tokenItem)
            if (tokenSymbol === n.symbol) {
              this.formDataChange({
                key: 'token',
                value: tokenItem
              })
            }
          })
        })
        this.SET_TOKENLIST(tokenList)
      } catch (error) {
        this.isFetch = false
      }
    },
    formDataChange (obj) {
      const { key, value } = obj
      switch (key) {
        case 'to':
          if (value) {
            this.getBaseFeeAndGas(this.address, value, this.maxNonce)
          }
          // eslint-disable-next-line no-case-declarations
          const { accountName } = obj
          this.$set(this.formData, 'toName', accountName)
          break
        case 'isAll':
          if (value === 1) {
            const fil = this.formData.balance
            this.$set(this.formData, 'fil', fil)
          }
          break
        case 'token':
          // eslint-disable-next-line no-case-declarations
          const { balance, symbol, chainName, decimals, isMain, contract } =
            value
          this.formData = Object.assign({}, this.formData, {
            balance,
            fil: '',
            symbol,
            chainName,
            decimals,
            isAll: 0,
            isMain,
            contract
          })
          break
        case 'fil':
          this.$set(this.formData, 'isAll', 0)
          break
      }
      this.$set(this.formData, key, value)
    },
    async getNextNonce () {
      const time = parseInt(new Date().getTime() / 1000)
      const messageList = await this.localStore.get('messageList')
      if (messageList) {
        const myMessageList = messageList.filter(n => {
          return (n.rpc === this.rpc) && (n.from === this.address)
        })
        const creatTimeList = myMessageList.map((n) => {
          return n.createTime
        }) || []
        const nonceList = myMessageList.map((n) => {
          return n.nonce || 0
        }) || []
        const maxDbCreateTime = (creatTimeList.length && Math.max(...creatTimeList)) || 0
        const maxDbNonce = nonceList.length && Math.max(...nonceList)
        // nonce time > 300s res.nonce ,else store none
        const maxNonce =
        time - maxDbCreateTime > 300
          ? this.nonce
          : Math.max(this.nonce, maxDbNonce)
        this.maxNonce = maxNonce
      } else {
        this.maxNonce = this.nonce
      }
    },
    // get current account balance
    async getBalanceNonceByAddress () {
      const MyGlobalApi = new GlobalApi()
      MyGlobalApi.setRpc(this.rpc)
      MyGlobalApi.setNetworkType(this.networkType)
      const res = await MyGlobalApi.getBalance(this.address)
      const { balance, nonce } = res
      const num = bigNumbers(balance)
      const big = num.dividedBy(Math.pow(10, Number(this.decimals))).toString()
      const _balance = formatNumber(big, 12)
      this.mainBalance = Number(_balance)
      this.nonce = nonce
      this.getNextNonce()
    },
    // get send gas
    async getBaseFeeAndGas (from, to, nonce) {
      const MyGlobalApi = new GlobalApi()
      MyGlobalApi.setRpc(this.rpc)
      MyGlobalApi.setNetworkType(this.networkType)
      const chainID = this.activeNetwork.chainID
      let rpcType = ''
      if (isFilecoinChain(this.networkType)) {
        rpcType = 'filecoin'
      } else {
        if (chainID === '1') {
          rpcType = 'ethereumMain'
        } else {
          rpcType = 'ethereumOthers'
        }
      }
      const isEthereumMain = rpcType === 'ethereumMain'
      const res = await MyGlobalApi.getGasFee(from, to, nonce, isEthereumMain)
      this.SET_SERVICEGAS({
        ...res,
        rpcType
      })
      if (this.formData.isAll === 1) {
        const fil = this.formData.balance
        this.$set(this.formData, 'fil', fil)
      }
    },
    // get exchange rate
    async getFilPricePoints () {
      if (this.ids) {
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.rpc)
        MyGlobalApi.setNetworkType(this.networkType)
        const res = await MyGlobalApi.getPrice(this.ids)
        const { usd, cny } = res
        if (this.currency === 'cny') {
          this.priceCurrency = cny
        } else {
          this.priceCurrency = usd
        }
      }
    },
    // next step
    async next () {
      const balance = bigNumbers(this.formData.balance)
      const value = bigNumbers(this.formData.fil)
      const isNumber = bigNumbers(value).isPositive()
      const handlingFee = bigNumbers(this.handlingFee).dividedBy(Math.pow(10, this.formData.decimals))
      if (isNumber) {
        if (value.isGreaterThan(balance)) {
          this.$message.error(this.$t('sendFil.insufficientBalance'))
        } else {
          this.isFetch = true
          await this.getBaseFeeAndGas(
            this.address,
            this.formData.to,
            this.maxNonce
          )
          this.step = 2
          this.isFetch = false
          // Judge whether it is the main currency
          if (this.formData.isMain === 1) {
            // Determine whether to send all
            if (this.formData.isAll === 1) {
              // Judge the balance is Greater Than gas fee
              if (balance.isGreaterThan(handlingFee)) {
                const actualValue = balance.minus(handlingFee).toString()
                const value = formatNumber(actualValue, 12)
                this.$set(this.formData, 'fil', value)
              } else {
                this.$message.error(this.$t('sendFil.insufficientBalance'))
              }
            }
          } else {
            // If the sending is not in the primary currency, the consumed service charge is still in the primary currency
            if (this.formData.isAll === 1) {
              const mainBanance = bigNumbers(this.mainBalance)
              if (mainBanance.isGreaterThan(handlingFee)) {
                this.$set(this.formData, 'fil', balance.toNumber())
              } else {
                this.$message.error(this.$t('sendFil.insufficientBalance'))
              }
            }
          }

          if (this.formData.isMain !== 1) {
            // Sending token gaslimit needs to be multiplied by 2.5
            const increaseGasLimit = bigNumbers(this.serviceGas.gasLimit).multipliedBy(2.5)
            this.SET_SERVICEGAS({
              ...this.serviceGas,
              gasLimit: increaseGasLimit
            })
          }
        }
      } else {
        this.$message.error(this.$t('sendFil.vaildNumber'))
      }
    },
    async sendSubmit () {
      const balance = bigNumbers(this.formData.balance)
      const fil = bigNumbers(this.formData.fil)
      const mainBanance = bigNumbers(this.mainBalance)
      const handlingFee = bigNumbers(this.handlingFee).div(Math.pow(10, this.decimals))
      // Judgment gasfee
      if (this.formData.isMain === 1) {
        const filGas = fil.plus(handlingFee)
        if (filGas.isGreaterThan(balance)) {
          this.$message.error(this.$t('sendFil.insufficientBalance'))
          return
        }
      } else {
        if (handlingFee.isGreaterThan(mainBanance) || fil.isGreaterThan(balance)) {
          this.$message.error(this.$t('sendFil.insufficientBalance'))
          return
        }
      }
      this.passwordVisable = true
    },
    async sendMain (_privateKey) {
      this.isFetch = true
      try {
        const address = this.address
        const tx = {
          from: address,
          to: this.formData.to,
          value: this.formData.fil,
          privateKey: _privateKey,
          nonce: this.maxNonce,
          serviceGas: this.serviceGas
        }
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.rpc)
        MyGlobalApi.setNetworkType(this.networkType)

        const result = await MyGlobalApi.sendTransaction(tx)
        const handlingFee = this.handlingFee
        if (result && result.cid) {
          // Successfully sent and stored in the message
          const value = bigNumbers(this.formData.fil)
            .multipliedBy(Math.pow(10, Number(this.formData.decimals)))
            .toNumber()
          await this.storeMessage({ value, cid: result.cid, nonce: result.nonce, handlingFee })
          this.isFetch = false
          window.location.href = './wallet.html?fromPage=sendFil'
        } else {
          this.isFetch = false
        }
      } catch (err) {
        this.isFetch = false
      }
    },
    // Send token
    async sendToken (_privateKey) {
      try {
        this.isFetch = true
        const fil = this.formData.fil.toString()
        const numberOfTokens = ethers.utils.parseUnits(
          fil,
          this.formData.decimals
        )
        const handlingFee = this.handlingFee
        const provider = ethers.getDefaultProvider(this.rpc)
        const wallet = new ethers.Wallet(_privateKey, provider)
        const contractSigner = new ethers.Contract(
          this.formData.contract,
          ABI,
          wallet
        )
        contractSigner.transfer(this.formData.to, numberOfTokens, {
          gasPrice: bigNumbers(this.serviceGas.gasPrice).toNumber(),
          gasLimit: Math.ceil(this.serviceGas.gasLimit)
        }).then(async (res) => {
          const value = bigNumbers(this.formData.fil)
            .multipliedBy(Math.pow(10, Number(this.formData.decimals)))
            .toNumber()
          await this.storeMessage({ value, cid: res.hash, nonce: res.nonce, handlingFee })
          this.isFetch = false
          window.location.href = './wallet.html?fromPage=sendFil'
        })
          .catch((error) => {
            if (error.error && error.error.message) {
              if (error.error.message.indexOf('insufficient funds') > -1) {
                this.$message({
                  type: 'error',
                  message: 'insufficient funds for gas * price + value'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: error.error && error.error.message
                })
              }
            }
            setTimeout(() => {
              this.isFetch = false
            }, 2000)
          })
      } catch (error) {
        this.$message({
          type: 'error',
          message: error && error.message
        })
        this.isFetch = false
      }
    },
    async confirmPassword (password) {
      const _salt = await encrypt(password, this.address)
      const _privateKey = await decryptMessage(this.privateKey, _salt, this.address)
      if (_privateKey) {
        this.passwordVisable = false
        if (this.formData.isMain === 1) {
          this.sendMain(_privateKey)
        } else {
          this.sendToken(_privateKey)
        }
      }
    },
    closePassword () {
      this.passwordVisable = false
    },
    // Successfully sent and stored in the message
    async storeMessage (data) {
      const createTime = parseInt(new Date().getTime() / 1000)
      const messageList = await this.localStore.get('messageList') || []
      const message = {
        cid: data.cid,
        from: this.address,
        to: this.formData.to,
        createTime,
        blockTime: 0,
        nonce: data.nonce,
        allGasFee: data.handlingFee,
        decimals: this.formData.decimals,
        token: this.formData.symbol,
        type: 'pending',
        value: data.value,
        rpc: this.rpc
      }
      await this.localStore.set({
        messageList: [
          ...messageList,
          message
        ]
      })

      const addressRecordLast = await this.localStore.get('addressRecordLast') || []
      const restRecordList = addressRecordLast.filter(n => {
        return (n.address !== this.formData.to) && (n.rpc !== this.rpx)
      })
      const addressRecord = {
        address: this.formData.to,
        rpc: this.rpc
      }
      await this.localStore.set({
        addressRecordLast: [
          ...restRecordList,
          addressRecord
        ]
      })
    }
  }
}
</script>

<style  lang="less" scoped>
.send-fil {
  width: 100%;
  height: 100%;
  position: relative;

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
    .img {
      animation: turnX 3s linear infinite;
    }
    @keyframes turnX {
      0% {
        transform: rotateZ(0deg);
      }
      100% {
        transform: rotateZ(360deg);
      }
    }
  }
  /deep/.el-dialog {
    margin: 0 auto;
    &.password-verification {
      border-radius: 10px;
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
    &.is-fullscreen {
      border-radius: 0;
      .el-dialog__body {
        width: 100%;
        height: 100%;
      }
    }
  }
  /deep/.el-dialog__header {
    padding: 0;
  }
  /deep/.el-dialog__body {
    padding: 0;
  }
  /deep/.el-dialog__footer {
    padding: 30px;
    border-top: 1px solid #eee;
  }
}
</style>
