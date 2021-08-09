<template>
    <layout @layoutMounted="layoutMounted">
        <div class="wallet-page" >
            <bHeader @networkChange="layoutMounted"/>
            <div class="content">
                <kyTop
                    v-if="rpc"
                    :balance="balance"
                    :price_usd="price_usd"
                    :editNameVisable.sync="editNameVisable"
                    :deleteUserVisible.sync="deleteUserVisible"
                    :receiveVisible.sync="receiveVisible"
                />
                <kyList
                    v-if="address && rpc"
                    :price_usd="price_usd"
                    :balance="balance"
                    @tokenShow="tokenShow"
                />
            </div>
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
                    :tokenDecimals="tokenDecimals"
                    :tokenName="tokenName"
                    :balance="balance"
                    :price_usd="price_usd"
                    :receiveVisible.sync="receiveVisible"
                    :symbol1="symbol"
                    @closeToken="tokenVisible = false"
                />
            </el-dialog>
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
import { MyGlobalApi } from '@/utils/api'
import QRCode from 'qrcode'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
    data(){
        return{
            addressName:'',
            editNameVisable:false,
            deleteUserVisible:false,
            receiveVisible:false,
            tokenVisible:false,
            balance:0,
            price_usd:0,
            QRUrl:'',
            signed_cid:'',
            tokenName:'',
            tokenDecimals:0
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
            'networkType'
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
        kyToken
    },
    methods:{
        ...mapMutations('app',[
            'SET_PRIVATEKEY',
            'SET_ADDRESS',
            'SET_DIGEST',
            'SET_ACCOUNTNAME'
        ]),
        async layoutMounted(){
            this.addressName = this.accountName
            this.getPrice()
            this.getBalanceNonce()
            this.getQRCode()
        },
        confirmEdit(){
            let address = this.address
            let rpc = this.rpc
            let addressName = this.addressName
            this.SET_ACCOUNTNAME(addressName)
            window.filecoinwalletDb.accountList.where({
                address:address,
                rpc:rpc
            }).modify({
                accountName:addressName
            })
            window.filecoinwalletDb.activeAccount.where({
                address:address,
                rpc:rpc
            }).modify({
                accountName:addressName
            })
            this.editNameVisable = false
        },
        closeEdit(){
            this.editNameVisable = false
        },
        async confirmDelete(){
            await window.filecoinwalletDb.activeAccount.where({khazix:'khazix'}).delete()
            await window.filecoinwalletDb.accountList.where({
                address:this.address,
                rpc:this.rpc
            }).delete()
            let accountList = await window.filecoinwalletDb.accountList.where({ rpc:this.rpc }).toArray () || [];
            if(accountList.length){
                let first = accountList.filter((n,index)=>{
                    return index === 0
                })
                let{privateKey,address,digest,accountName} = first
                this.SET_PRIVATEKEY(privateKey)
                this.SET_ADDRESS(address)
                this.SET_DIGEST(digest)
                this.SET_ACCOUNTNAME(accountName)
                await window.filecoinwalletDb.activeAccount.bulkPut(first).then(res=>{
                    window.location.href = './wallet.html'
                })
            }else{
                window.location.href = './welcome.html'
            }
        },
        closeDelete(){
            this.deleteUserVisible = false
        },
        async getPrice(){
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getPrice(this.ids)
            let { usd } = res
            this.price_usd = usd
        },
        sendFil(){
            window.location.href = './send-fil.html'
        },
        async getBalanceNonce(){
            let address = this.address
            let rpc = this.rpc
            MyGlobalApi.setRpc(rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getBalance(address)
            let { balance,nonce } = res
            this.balance = balance
            window.filecoinwalletDb.accountList.where({
                address:address,
                rpc:rpc
            }).modify({
                fil:balance,
            }).then(res=>{
                console.log(balance,'balance update')
            })
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
        tokenShow(obj){
            let {symbol,decimals} = obj
            this.tokenVisible = true
            this.tokenName = symbol
            this.tokenDecimals = Number(decimals)
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
}
</style>
