<template>
    <layout @layoutMounted="layoutMounted">
        <div class="wallet-page" >
            <bHeader 
                @openNetwork="openNetwork" 
            />
            <div class="content">
                <kyTop
                    v-if="rpc"
                    :balance="balance"
                    :mask.sync="mask"
                    :editNameVisable.sync="editNameVisable"
                    :deleteUserVisible.sync="deleteUserVisible"
                    :receiveVisible.sync="receiveVisible"
                />
                <kyList
                    v-if="address && rpc"
                    :price_currency="price_currency"
                    :balance="balance"
                    @tokenShow="tokenShow"
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
                <kyNetwork 
                    @closeNetwork="closeNetwork"
                    @networkChange="networkChange"
                />
            </el-dialog>

            <el-dialog
                :visible.sync="editNameVisable"
                width="300px"
                :show-close="false"
                :top="'31vh'"
            >
                <editName
                    :addressName.sync="addressName"
                    @confirmEdit="confirmEdit"
                    @closeEdit="closeEdit"
                />
            </el-dialog>
            
            <el-dialog
                :visible.sync="deleteUserVisible"
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
                    :price_currency="price_currency"
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
    </layout>
</template>
<script>
import bHeader from '@/components/header'
import layout from '@/components/layout'
import editName from './edit-name.vue'
import deleteUser from './delete-user.vue'
import receive from './receive.vue'
import kyTop from './top.vue'
import kyList from './transaction-list.vue'
import kyToken from './token.vue'
import kyNetwork from '@/components/header/network.vue'
import { GlobalApi } from '@/utils/api'
import QRCode from 'qrcode'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { formatDate } from '@/utils'
import { Database,reverseOrder } from '@/utils/database.js';
export default {
    data(){
        return{
            mask:false,
            loading:require('@/assets/image/loading.png'),
            isLoading:false,
            addressName:'',
            editNameVisable:false,
            deleteUserVisible:false,
            receiveVisible:false,
            tokenVisible:false,
            balance:0,
            price_currency:0,
            QRUrl:'',
            signed_cid:'',
            tokenName:'',
            tokenDecimals:0,
            tokenList:[],
            tokenBalance:0,
            tokenIsMain:0,
            networkVisible:false,
            db:null
        }
    },
    computed:{
        ...mapState('app',[
            'rpc',
            'symbol',
            'accountName',
            'address',
            'privateKey',
            'ids',
            'networkType',
            'currency'
        ]),
    },
    components:{
        layout,
        bHeader,
        editName,
        deleteUser,
        receive,
        kyTop,
        kyList,
        kyToken,
        kyNetwork
    },
    mounted(){
        const db = new Database();
        this.db = db
    },
    methods:{
        ...mapMutations('app',[
            'SET_PRIVATEKEY',
            'SET_ADDRESS',
            'SET_DIGEST',
            'SET_ACCOUNTNAME'
        ]),
        async layoutMounted(){
            this.isLoading = true
            this.addressName = this.accountName
            await this.getPrice()
            await this.getBalanceNonce()
            this.getQRCode()
            this.isLoading = false
        },
        networkChange(){
            this.closeNetwork()
            this.layoutMounted()
        },
        openNetwork(){
            this.mask = true
            this.networkVisible = true
        },
        closeNetwork(){
            this.mask = false
            this.networkVisible = false
        },
        maskClick(){
             this.mask = false
            this.networkVisible = false
        },
        confirmEdit(){
            let address = this.address
            let rpc = this.rpc
            let addressName = this.addressName
            this.SET_ACCOUNTNAME(addressName)
            this.db.modifyTable(
                'accountList',
                {
                    address:address,
                    rpc:rpc
                },
                {
                    accountName:addressName
                }
            )
            this.db.this.db.modifyTable(
                'activeAccount',
                {
                    address:address,
                    rpc:rpc
                },
                {
                    accountName:addressName
                }
            )
            this.editNameVisable = false
        },
        closeEdit(){
            this.editNameVisable = false
        },
        async confirmDelete(){
            await this.db.deleteTable('activeAccount',{ khazix:'khazix' })
            await this.db.deleteTable('accountList',{  
                address:this.address,
                rpc:this.rpc 
            })

            let accountList = await this.db.getTable('accountList',{ rpc:this.rpc });
            if(accountList.length){
                let first = accountList.find((n,index)=>{
                    return index === 0
                })
                let{ privateKey,address,digest,accountName } = first
                this.SET_PRIVATEKEY(privateKey)
                this.SET_ADDRESS(address)
                this.SET_DIGEST(digest)
                this.SET_ACCOUNTNAME(accountName)
                await this.db.addTable('activeAccount',first)
                window.location.href = './wallet.html'
            }else{
                window.location.href = './welcome.html'
            }
        },
        closeDelete(){
            this.deleteUserVisible = false
        },
        async getPrice(){
            if(this.ids){
                let MyGlobalApi = new GlobalApi()
                MyGlobalApi.setRpc(this.rpc)
                MyGlobalApi.setNetworkType(this.networkType)
                let res = await MyGlobalApi.getPrice(this.ids)
                let { usd,cny } = res
                if(this.currency === 'cny'){
                    this.price_currency = cny
                }else{
                    this.price_currency = usd
                }
            }  
        },
        sendFil(){
            window.location.href = './send-fil.html'
        },
        async getBalanceNonce(){
            let address = this.address
            let rpc = this.rpc
            let MyGlobalApi = new GlobalApi()
            MyGlobalApi.setRpc(rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getBalance(address)
            let { balance,nonce } = res
            this.balance = balance
            this.db.modifyTable(
                'accountList',
                {
                    address:address,
                    rpc:rpc
                },
                {
                    fil:balance,
                }
            )
            this.db.modifyTable(
                'activeAccount',
                {
                    address:address,
                    rpc:rpc
                },
                {
                    fil:balance,
                }
            )
        },
        openReceive(){
            this.receiveVisible = true
        },
        closeReceive(){
            this.receiveVisible = false
        },
        getQRCode(){
             QRCode.toDataURL(this.address).then(QRUrl => {
                this.QRUrl = QRUrl
            }).catch(err => {
                console.error(err)
            })
        },
        async tokenShow(obj){
            let {symbol,decimals,balance,isMain} = obj
            this.tokenName = symbol
            this.tokenDecimals = Number(decimals)
            this.tokenBalance = balance
            this.tokenIsMain = isMain
            
            let mesList = await this.db.getTable(
                'messageList',
                { rpc:this.rpc },
                reverseOrder,
                'create_time',
            )
            let tokenList = mesList.filter(n=>{
                return (n.from === this.address) && (n.token === symbol) || (n.to === this.address) && (n.token === symbol)
            })
            console.log(tokenList,' tokenList 2222')
            this.tokenList = tokenList.map(n=>{
                return {
                    ...n,
                }
            })
            this.tokenVisible = true
        },
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
