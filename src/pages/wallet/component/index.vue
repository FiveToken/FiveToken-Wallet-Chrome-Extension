<template>
    <ky-layout @layoutMounted="layoutMounted">
        <div class="wallet-page">
            <ky-header
                @openNetwork="openNetwork"
            />
            <div class="content">
                <kyTop
                    v-if="rpc"
                    :balance="balance"
                    :mask.sync="mask"
                    :editNameVisable.sync="editNameVisable"
                    :deleteAccountVisible.sync="deleteAccountVisible"
                    :receiveVisible.sync="receiveVisible"
                />
                <kyList
                    v-if="address && rpc"
                    :priceCurrency="priceCurrency"
                    :balance="balance"
                    @tokenShow="tokenShow"
                    ref="kyList"
                />
            </div>

            <el-dialog
                :visible.sync="networkVisible"
                width="100%"
                :show-close="false"
                class="network-dialog"
                :modal="false"
                :top="'0'"
            >
                <ky-network
                    @closeNetwork="closeNetwork"
                    @networkChange="networkChange"
                />
            </el-dialog>

            <el-dialog
                :visible.sync="editNameVisable"
                width="300px"
                :show-close="false"
                :top="'24vh'"
            >
                <editName
                    :addressName.sync="addressName"
                    @confirmEdit="confirmEdit"
                    @closeEdit="closeEdit"
                />
            </el-dialog>

            <el-dialog
                :visible.sync="deleteAccountVisible"
                width="300px"
                :top="'31vh'"
                :show-close="false"
            >
                <deleteUser
                    @confirmDelete="confirmDelete"
                    @closeDelete="closeDelete"
                />
            </el-dialog>

            <el-dialog
                :visible.sync="receiveVisible"
                width="100%"
                :fullscreen='true'
                :top="'0'"
                :show-close="false"
            >
                <receive
                    :QRUrl="QRUrl"
                    :accountName.sync="accountName"
                    :address="address"
                    @closeReceive="closeReceive"
                />
            </el-dialog>

            <el-dialog
                :visible.sync="tokenVisible"
                width="100%"
                :fullscreen='true'
                :top="'0'"
                :show-close="false"
            >
                <kyToken
                    :tokenIsMain="tokenIsMain"
                    :tokenDecimals="tokenDecimals"
                    :tokenBalance="tokenBalance"
                    :tokenName="tokenName"
                    :priceCurrency="priceCurrency"
                    :receiveVisible.sync="receiveVisible"
                    :symbol="symbol"
                    :tokenList="tokenList"
                    @closeToken="tokenVisible = false"
                />
            </el-dialog>
            <div class="loading" v-if="isLoading">
                <img :src="loading" alt="" class="img">
            </div>
            <div class="mask" v-if="mask" @click="maskClick"></div>
        </div>
    </ky-layout>
</template>
<script>
import editName from './edit-name.vue'
import deleteUser from './delete-user.vue'
import receive from './receive.vue'
import kyTop from './top.vue'
import kyList from './transaction-list.vue'
import kyToken from './token.vue'
import { GlobalApi } from '@/api/index.js'
import QRCode from 'qrcode'
import { mapMutations, mapState } from 'vuex'
import { isFilecoinChain } from '@/utils'
import changeNetwork from '@/minix/change-network'
import changeAccount from '@/minix/change-account'
import ABI from '@/utils/abi'
import { ethers } from 'ethers'
import ExtensionStore from '@/utils/local-store'
export default {
  components: {
    editName,
    deleteUser,
    receive,
    kyTop,
    kyList,
    kyToken
  },
  mixins: [changeNetwork, changeAccount],
  data () {
    return {
      mask: false,
      loading: require('@/assets/image/loading.png'),
      isLoading: false,
      addressName: '',
      editNameVisable: false,
      deleteAccountVisible: false,
      receiveVisible: false,
      tokenVisible: false,
      balance: 0,
      priceCurrency: 0,
      QRUrl: '',
      tokenName: '',
      tokenDecimals: 0,
      tokenList: [],
      tokenBalance: 0,
      tokenIsMain: 0,
      networkVisible: false,
      localStore: null
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'symbol',
      'accountName',
      'address',
      'privateKey',
      'ids',
      'networkType',
      'currency',
      'activeAccount',
      'accountList',
      'onLine',
      'networks'
    ])
  },
  async mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
  },
  methods: {
    ...mapMutations('wallet', [
      'SET_MESSAGELIST',
      'SET_TOKENLIST'
    ]),
    async layoutMounted () {
      this.addressName = this.accountName
      this.isLoading = true
      try {
        this.getQRCode()
        await this.getBalanceNonce()
        await this.getPrice()
        await this.updateMessageList()
        await this.getTokenList()
        await this.getMessageList()
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    networkChange () {
      this.layoutMounted()
      this.closeNetwork()
    },
    openNetwork () {
      this.mask = true
      this.networkVisible = true
    },
    closeNetwork () {
      this.mask = false
      this.networkVisible = false
    },
    maskClick () {
      this.mask = false
      this.networkVisible = false
    },
    // edit current address
    async confirmEdit () {
      const addressName = this.addressName
      if (addressName) {
        const address = this.address
        const rpc = this.rpc
        this.SET_ACCOUNTNAME(addressName)
        const localStore = new ExtensionStore()
        const accountList = await localStore.get('accountList')
        const restAccountList = accountList.filter(n => {
          return !((n.rpc === rpc) && (n.address === address))
        })
        await this.localStore.set({
          accountList: [
            ...restAccountList,
            {
              ...this.activeAccount,
              accountName: addressName
            }
          ]
        })

        await this.localStore.set({
          activeAccount: {
            ...this.activeAccount,
            accountName: addressName
          }
        })

        this.editNameVisable = false
      }
    },
    closeEdit () {
      this.addressName = this.accountName
      this.editNameVisable = false
    },
    async getDataNetwork () {
      const networks = this.networks
      let dataNetwork = null
      for (let i = 0; i < networks.length; i++) {
        const AllAccountList = await this.localStore.get('accountList')
        if (AllAccountList) {
          const _rpc = networks[i].rpc
          const _accountList = AllAccountList.filter(n => n.rpc === _rpc)
          if (_accountList.length > 0) {
            dataNetwork = networks[i]
            break
          }
        }
      }
      return dataNetwork
    },
    /**
     * After deleting an account, if the current network still has an account,
     * switch to the first account of the current network.
     * If the current network has no account, switch to the next network with an account.
     * If all networks have no account, jump to the welcome page
     */
    async confirmDelete () {
      const allAccountList = await this.localStore.get('accountList')
      const isFilecoin = isFilecoinChain(this.networkType)
      if (isFilecoin) {
        const _address = this.address.substring(1, this.address.length)
        const restAccountList = allAccountList.filter(n => {
          return (n.address.indexOf(_address) === -1)
        })
        await this.localStore.set({
          accountList: [
            ...restAccountList
          ]
        })
      } else {
        const restAccountList = allAccountList.filter(n => {
          return n.address !== this.address
        })

        await this.localStore.set({
          accountList: [
            ...restAccountList
          ]
        })
      }
      // Get deleted list
      const currentRpc = this.rpc
      const allList = await this.localStore.get('accountList')
      if (allList) {
        const currentAccountList = allList.filter(n => n.rpc === currentRpc)
        if (currentAccountList.length) {
          const first = currentAccountList.find((n, index) => {
            return index === 0
          })
          await this.minixChangeAccount(first, currentRpc)
          window.location.href = './wallet.html'
        } else {
          const dataNetwork = await this.getDataNetwork()
          if (dataNetwork) {
            await this.minixChangeNetwork(dataNetwork, currentRpc)
            const allAccountList = await this.localStore.get('accountList')
            if (allAccountList) {
              const _accountList = allAccountList.filter(n => n.rpc === dataNetwork.rpc)
              if (_accountList.length) {
                await this.minixChangeAccount(_accountList[0], currentRpc)
                window.location.href = './wallet.html'
              }
            }
          } else {
            localStorage.clear()
            this.localStore.clear()
            window.location.href = './welcome.html'
          }
        }
      }
    },
    closeDelete () {
      this.deleteAccountVisible = false
    },
    // get exchange rate
    async getPrice () {
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
    sendFil () {
      window.location.href = './send-fil.html'
    },
    // get current account balance
    async getBalanceNonce () {
      const address = this.address
      const rpc = this.rpc
      const networkType = this.networkType
      let balance = 0
      const MyGlobalApi = new GlobalApi()
      MyGlobalApi.setRpc(rpc)
      MyGlobalApi.setNetworkType(networkType)
      const res = await MyGlobalApi.getBalance(address)
      balance = res && res.balance
      this.balance = balance
      await this.localStore.set({
        activeAccount: {
          ...this.activeAccount,
          fil: balance
        }
      })
      const allAccountList = await this.localStore.get('accountList')
      const restAccountList = allAccountList.filter(n => {
        return !((n.rpc === rpc) && (n.address === address))
      })

      await this.localStore.set({
        accountList: [
          ...restAccountList,
          {
            ...this.activeAccount,
            fil: balance
          }
        ]
      })
    },
    openReceive () {
      this.receiveVisible = true
    },
    closeReceive () {
      this.receiveVisible = false
    },
    // Get address QR code
    getQRCode () {
      QRCode.toDataURL(this.address).then(QRUrl => {
        this.QRUrl = QRUrl
      })
    },
    // asset details
    async tokenShow (obj) {
      const { symbol, decimals, balance, isMain } = obj
      this.tokenName = symbol
      this.tokenDecimals = Number(decimals)
      this.tokenBalance = balance
      this.tokenIsMain = isMain
      const messageList = await this.localStore.get('messageList')
      if (messageList) {
        const tokenList = messageList.filter(n => {
          return ((n.from === this.address) && (n.token === symbol)) || ((n.to === this.address) && (n.token === symbol))
        })

        const pendingList = tokenList.filter(n => n.type === 'pending')
        const sortPending = pendingList.sort(function (a, b) {
          return b.createTime - a.createTime
        })
        const othersList = tokenList.filter(n => n.type !== 'pending')
        const sortOthers = othersList.sort(function (a, b) {
          return b.createTime - a.createTime
        })
        this.tokenList = [
          ...sortPending,
          ...sortOthers
        ]
      }
      this.tokenVisible = true
    },

    async getMessageList () {
      const storeMessageList = await this.localStore.get('messageList')
      if (storeMessageList) {
        const currentAddress = this.address
        const currentRpc = this.rpc
        const myMessageList = storeMessageList.filter((n) => {
          return ((n.rpc === currentRpc) && (n.from === currentAddress)) || ((n.rpc === currentRpc) && (n.to === currentAddress))
        })

        this.SET_MESSAGELIST(myMessageList)
      } else {
        this.SET_MESSAGELIST([])
      }
    },
    // get token list
    async getTokenList () {
      if (!isFilecoinChain(this.networkType)) {
        const allTokenList = await this.localStore.get('tokenList')
        if (allTokenList) {
          const myTokenList = allTokenList.filter(n => {
            return (n.rpc === this.rpc) && (n.address === this.address)
          })
          const tokenList = []
          const provider = ethers.getDefaultProvider(this.rpc)
          myTokenList.forEach(async (n) => {
            try {
              const contract = new ethers.Contract(n.contract, ABI, provider)
              // get token balance by address
              contract.balanceOf(this.address).then((res) => {
                const balance = res.toString()
                const num = Number(balance)
                tokenList.push({
                  ...n,
                  balance: num
                })
              })
            } catch (err) {
              throw new Error(err)
            }
          })
          this.SET_TOKENLIST(tokenList)
        }
      } else {
        this.SET_TOKENLIST([])
      }
    },
    async updateMessageList () {
      const allMessageList = await this.localStore.get('messageList')
      if (allMessageList) {
        const messageList = allMessageList.filter((n) => {
          return (n.rpc === this.rpc) && (n.from === this.address || n.to === this.address)
        })
        messageList.forEach(async (n) => {
        // Get status
          if (n.type === 'pending') {
            const itemRes = await this.getDetail(n.cid)
            if (itemRes) {
            // get detail, update store messageList (type,allGasFee,blockTime)
              const updateMessageItem = allMessageList.find(m => n.cid === m.cid)
              const restMessageList = allMessageList.filter(m => n.cid !== m.cid)
              await this.localStore.set({
                messageList: [
                  ...restMessageList,
                  {
                    ...updateMessageItem,
                    type: itemRes.type,
                    allGasFee: itemRes.allGasFee,
                    blockTime: itemRes.blockTime,
                    height: itemRes.height
                  }
                ]
              })
            }
          }
        })
        this.deleteSameNonce()
      }
    },
    // get detail by hash
    async getDetail (cid) {
      const MyGlobalApi = new GlobalApi()
      MyGlobalApi.setRpc(this.rpc)
      MyGlobalApi.setNetworkType(this.networkType)
      const detail = await MyGlobalApi.getTransaction(cid)
      return detail
    },
    // delete same nonce （ type = pending）
    async deleteSameNonce () {
      const allMessageList = await this.localStore.get('messageList')
      if (allMessageList) {
        const messageList = allMessageList.filter(n => {
          return (n.rpc === this.rpc) && (n.address === this.address)
        })
        const obj = {}
        let nonce = 0
        for (let i = 0; i < messageList.length; i++) {
          if (!obj.nonce) {
            obj.nonce = messageList[i].nonce
          } else {
            nonce = messageList[i].nonce
          }
        }

        if (nonce) {
          const restMessageList = allMessageList.filter(n => {
            return (n.nonce !== nonce) && (n.type !== 'pending') && (n.rpc !== this.rpc) && (n.address !== this.address)
          })

          await this.localStore.set({
            messageList: restMessageList
          })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.wallet-page{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .content{
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 999;
    }
    .loading{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
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
    /deep/.el-dialog{
        margin: 0 auto;
        border-radius: 10px;
        &.is-fullscreen{
            border-radius: 0;
            .el-dialog__body{
                width: 100%;
                height: 100%;
            }
        }
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

    /deep/.network-dialog{
        bottom: 0;
        top: auto;
        .el-dialog{
            border-radius: 10px 10px 0 0;
        }
    }
}
</style>
