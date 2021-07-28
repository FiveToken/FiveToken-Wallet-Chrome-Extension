<template>
<div class="wallet-page">
    <bHeader :etitCount="etitCount"/>
    <div class="content">
        <div class="top">
            <!-- <div class="connect-left" @click="openConnect">{{$t('wallet.connected')}}</div> -->
            <div class="center">
                <div class="account">{{accountName}}</div>
                <el-popover
                    v-model="copyAddressTips"
                    placement="bottom"
                    width="100"
                    trigger="click"
                    :content="$t('wallet.copySuccess')"
                >
                    <div class="copy-wrap" slot="reference">
                        <div 
                            class="address copy-address-box1" 
                            @mouseover="mouseOverAddress"
                            @mouseleave="mouseLeaveAddress" 
                            @click="copyAddress1" 
                            :data-clipboard-text="address"
                        >
                            {{address|addressFormat}}
                        </div>
                        <div class="copy-title" v-if="copyTitleVisable">{{$t('wallet.copyAddress')}}</div>
                    </div>
                    
                </el-popover>
            </div>
        </div>
        <div class="middle">
            <div class="logo">
                <img class="img" :src="filLogo" />
            </div>
            <div class="fil">{{balance|formatBalance}} FIL</div>
            <div class="usd">$ {{(balance*this.price_usd).toFixed(2)}}</div>
            <div class="action">
                <div class="receive" @click="openReceive">
                    <div class="icon">
                        <img class="img" :src="send" />
                    </div>
                    <div class="text">{{$t('wallet.receive')}}</div>
                </div>
                <div class="send" @click="sendFil">
                    <div class="icon">
                        <img class="img" :src="rec" />
                    </div>
                    <div class="text">{{$t('wallet.send')}}</div>
                </div>
            </div>
        </div>
        <list 
            :address="address" 
            :price_usd="price_usd"
            :balance="balance" 
            :walletNonce="walletNonce"
            @openDetail="openDetail"
        />
    </div>
    <div class="help">
      <div class="text">Need help? </div>
      <div class="link" @click="toDocs">Contact Filecoin Wallet Docs</div>
    </div>
    <el-dialog
        :visible.sync="receiveVisible"
        width="94%"
        :show-close="false"
    >
        <receive 
            :receiveVisible.sync="receiveVisible"
            :exportSecretVisible.sync="exportSecretVisible"
            :QRUrl="QRUrl"
            :accountName.sync="accountName"
            :etitCount.sync="etitCount"
            :address="address"
        />
    </el-dialog>
    <el-dialog
        :visible.sync="exportSecretVisible"
        width="94%"
        :show-close="false"
    >
        <exportPKey
            :accountName="accountName"
            :address="address"
            :exportSecretVisible.sync="exportSecretVisible"
            :showPkVisible.sync="showPkVisible"
            :encodePrivateKey="encodePrivateKey"
            :digest="digest"
            :hexPrivateKey.sync="hexPrivateKey"
        />
    </el-dialog>
    <el-dialog
        :visible.sync="showPkVisible"
        width="94%"
        top="10vh"
        :show-close="false"
    >
        <showPKey 
            :accountName="accountName"
            :address="address"
            :showPkVisible.sync="showPkVisible"
            :hexPrivateKey.sync="hexPrivateKey"
        />
    </el-dialog>

    <el-dialog
        :visible.sync="transactionDetails"
        width="94%"
        top="8vh"
        :show-close="false"
    >
        <detail 
            :signed_cid="signed_cid" 
            :transactionDetails.sync="transactionDetails" 
            :detail="detail"
        />
    </el-dialog>

    <el-dialog
        :visible.sync="connectDialogVisable"
        width="94%"
        :show-close="false"
    >
        <connect />
    </el-dialog>
</div>
</template>

<script>
import bHeader from '@/components/header'
import connect from './connect.vue'
import detail from './detail.vue'
import list from './list.vue'
import receive from './receive.vue'
import exportPKey from './export-p-key.vue'
import showPKey from './show-p-key.vue'
import { BalanceNonceByAddress,FilPricePoints,MessageDetails } from '@/utils/api'
import ClipboardJS from 'clipboard'
import QRCode from 'qrcode'
import { getNowFormatDateEn,formatDate } from '@/utils'
export default {
    data(){
        return{
            receiveVisible:false,
            exportSecretVisible:false,
            showPkVisible:false,
            transactionDetails:false,
            connectDialogVisable:false,
            copyTitleVisable:false,
            copyAddressTips:false,
            filLogo:require('@/assets/image/fil-w.png'),
            logo:require('@/assets/image/logo.png'),
            rec:require('@/assets/image/rec.png'),
            send:require('@/assets/image/send.png'),
            address:'',
            encodePrivateKey:'',
            digest:'',
            walletNonce:0,
            balance:0,
            accountName:'',
            price_usd:0,
            QRUrl:'',
            signed_cid:'',
            hexPrivateKey:'',
            etitCount:0,
            detail:{
                from:'',
                to:'',
                nonce:0,
                fil:0,
                all_gas_fee:0,
                totalFil:0,
                totalUsd:0,
                create_time:'',
                block_time:''
            },
        }
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
        formatBalance(val){
            let isZ = val%1 === 0
            if(isZ) {
                return val
            }else{
                return val.toFixed(8)
            }
        }
    },
    components:{
        bHeader,
        detail,
        connect,
        list,
        receive,
        exportPKey,
        showPKey
    },
    async mounted(){
        this.getFilPricePoints()
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ()|| [];
        if(activeAccount.length){
            this.encodePrivateKey = activeAccount[0].privateKey
            this.digest = activeAccount[0].digest
            this.accountName = activeAccount[0].accountName
            let address =  activeAccount[0].address
            this.address = address
            this.getBalanceNonce(address)
            this.getQRCode(address)
        }
    },
    methods:{
        toDocs(){
            openUrl(`https://docs.filecoinwallet.com/`)
        },
        openConnect(){
            this.connectDialogVisable = true
        },
        async getFilPricePoints(){
             FilPricePoints(['real']).then(result=>{
                console.log(result,'rreess FilPricePoints')
                let res = result.data
                if(res && res.data && res.data.length){
                    this.price_usd = Number(res.data[0].price_usd)
                }
            }).catch(err=>{
                this.price_usd = 0
                console.log(err,'FilPricePoints err')
            })
        },
        sendFil(){
            window.location.href = './send-fil.html'
        },
        getBalanceNonce(address){
            BalanceNonceByAddress([{address}]).then((result)=>{
                console.log(result,'BalanceNonceByAddress')
                if(result && result.data){
                    let res = result && result.data
                    let balance = Number(res.balance || 0) / Math.pow(10, 18)
                    this.balance = balance
                    this.walletNonce = res.nonce
                    window.filecoinwalletDb.accountList.where("address").equals(this.address).modify({fil:balance}).then(res=>{
                        this.etitCount += 1
                    })
                    window.filecoinwalletDb.activeAccount.where("address").equals(this.address).modify({fil:balance}).then(res=>{
                        this.etitCount += 1
                    })
                }
            }).catch(err=>{
                 this.balance = 0
                 this.walletNonce = 0
                console.log(err,'BalanceNonceByAddressErr')
            })
        },
        openReceive(){
            this.exportSecretVisible = false
            this.receiveVisible = true
        },
        getQRCode(address){
             QRCode.toDataURL(address).then(QRUrl => {
                this.QRUrl = QRUrl
            }).catch(err => {
                console.error(err)
            })
        },
        copyAddress1(){
            this.copyTitleVisable = false
            let that = this
            const clipboard = new ClipboardJS('.copy-address-box1')
            this.copyAddressTips = true
            clipboard.on('success', function(e) {
                that.copyAddressTips = true
                console.log(that.copyAddressTips,'that.copyAddressTips 123')
                setTimeout(()=>{
                    that.copyAddressTips = false
                },2000)
            })
            clipboard.on('error', function(e) {})
        },
        mouseOverAddress(){
            this.copyTitleVisable = true
        },
        mouseLeaveAddress(){
            this.copyTitleVisable = false
        },
        openDetail(signed_cid,obj){
            this.signed_cid = signed_cid
            this.getDetail(signed_cid,obj)
        },
        getDetail(signed_cid,itemObj){
            MessageDetails([signed_cid]).then(async (result)=>{
                console.log(result,'MessageDetails')
                try{
                    let res = result.data
                    let fil = Number(res.value)/Math.pow(10, 18)
                    let all_gas_fee = Number(res.all_gas_fee)/Math.pow(10, 18)
                    let totalFil = fil + all_gas_fee
                    let totalUsd = totalFil * this.price_usd
                    this.$set(this.detail,'from',res.from)
                    this.$set(this.detail,'to',res.to)
                    this.$set(this.detail,'nonce',res.nonce)
                    this.$set(this.detail,'fil',fil)
                    this.$set(this.detail,'all_gas_fee',all_gas_fee)
                    this.$set(this.detail,'totalFil',totalFil)
                    this.$set(this.detail,'totalUsd',totalUsd.toFixed(2))
                    this.$set(this.detail,'signed_cid',signed_cid)
                    // signed_cid
                    let messageList = await window.filecoinwalletDb.messageList.where({ kunyao:'kunyao'}).toArray () || [];
                    let signedMess = messageList.find(n=>{
                        return n.signed_cid === res.signed_cid
                    })
                    let create_time = signedMess.create_time ? formatDate(signedMess.create_time,true):''
                    let block_time = res.block_time ? formatDate(res.block_time,true) : ""
                    this.$set(this.detail,'block_time',block_time)
                    this.$set(this.detail,'create_time',create_time)
                    console.log(this.detail,signedMess,'this.detail 222')
                }catch{
                    let fil = Number(itemObj.value)/Math.pow(10, 18)
                    this.$set(this.detail,'from',itemObj.from)
                    this.$set(this.detail,'to',itemObj.to)
                    this.$set(this.detail,'fil',fil)
                    this.$set(this.detail,'signed_cid',signed_cid)
                    console.log('MessageDetails try catch err')
                }
            }).catch(err=>{
                console.log(err,'MessageDetails err')
            })
            this.transactionDetails = true
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
    .content{
        .top{
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            text-align: center;
            border-bottom:1px solid #eee;
            padding:15px 0;
            .position{
                position: absolute;
                top: 50%;
                right:20px;
                transform: translateY(-50%);
                font-size: 14px;
                color: #222;
            }
            .connect-left{
                padding-left: 15px;
                position: absolute;
                top: 50%;
                left:20px;
                transform: translateY(-50%);
                color: #222;
                font-size: 14px;
                cursor: pointer;
                &::after{
                    content: '';
                    width: 3px;
                    height: 3px;
                    background: #5CC1CB;
                    border-radius: 2px;
                    position: absolute;
                    left: 3px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &::before{
                    content: '';
                    width: 7px;
                    height: 7px;
                    background: transparent;
                    border-radius: 7px;
                    border: 1px solid #5CC1CB;
                    position: absolute;
                    left: 0px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .center{
                font-size: 14px;
                color: #666;
                .copy-wrap{
                    position: relative;
                    .copy-title{
                        position: absolute;
                        top: calc(100% + 10px);
                        left: 50%;
                        transform: translateX(-50%);
                        padding: 3px 10px;
                        background: rgba(0,0,0,0.8);
                        color: #fff;
                        border-radius: 5px;
                        text-align: center;
                        white-space:nowrap;
                        &::after{
                            content: '';
                            width: 0;
                            height: 0;
                            border: 8px solid;
                            border-color: transparent transparent rgba(0,0,0,0.8);
                            position: absolute;
                            bottom: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                }
                .account{
                    font-size: 24px;
                    color: #222;
                    font-weight: bolder;
                    margin-bottom: 10px;
                }
                .address{
                    cursor: pointer;
                    background: #f2f2f2;
                    padding: 5px 10px;
                    border-radius: 5px;
                    color: #999;
                }
            }
        }
        .middle{
            padding: 20px 0;
            .logo{
                width: 60px;
                height: 60px;
                background: #5CC1CB;
                margin:0 auto 20px;
                border-radius: 30px;
                .img{
                    width: 60px;
                    height: 60px;
                }
            }
            .fil{
                text-align: center;
                font-size: 28px;
                font-weight: bolder;
                color: #222;
                margin-bottom: 10px;
                padding: 0 10px;
                word-break: break-all;
            }
            .usd{
                text-align: center;
                font-size: 14px;
                color: #999;
                margin-bottom: 10px;
            }
            .action{
                padding-top: 10px;
                display: flex;
                justify-content: center;
                .receive{
                    margin-right: 40px;
                    .icon{
                        background: #5CC1CB;
                    }
                }
                .send{
                    .icon{
                        background: #5C8BCB;
                    }
                }
                .receive,.send{
                    text-align: center;
                    cursor: pointer;
                    .icon{
                        width: 30px;
                        height: 30px;
                        border-radius: 15px;
                        margin: 0 auto 10px;
                        line-height: 30px;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        .img{
                            width: 22px;
                            height: 22px;
                        }
                    }
                    .text{
                        font-size: 14px;
                        color: #999;

                    }
                }
            }
        }
    }
    .help{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 20px 10px;
        .text{
            color: #222;
            font-size: 14px;
            margin-right: 8px;
        }
        .link{
            font-size: 14px;
            color:#5CC1CB;
        }
    }
    /deep/.el-dialog{
        margin: 0 auto;
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
