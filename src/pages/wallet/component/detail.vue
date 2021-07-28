<template>
 <div class="dialog-detail">
    <div class="top">
        <div class="title">{{$t('wallet.sendFil')}}</div>
        <i  @click="closeDetail" class="el-icon-close"></i>
    </div>
    <div class="send-detail">
        <div class="text">{{$t('wallet.detail')}}</div>
        <div class="c-id-wrap"  slot="reference">
            <i 
                class="el-icon-document-copy copy-cid-box" 
                @click="copySignedCid" 
                :data-clipboard-text="detail.signed_cid" 
                @mouseover="mouseOverCid"
                @mouseleave="mouseLeaveCid"
            >
            </i>
            <div class="copy-c-id" v-if="copySignedCidTips">{{$t('wallet.copySuccess')}}</div>
            <div class="copy-c-id" v-if="copyCIdVisable">{{$t('wallet.copyCid')}}</div>
        </div>
        <div class="icon link" @click="skipToWeb(detail.signed_cid)">
            <i class="el-icon-top-right" @mouseover="mouseOverLink"
                @mouseleave="mouseLeaveLink"></i>
                <div class="tips" v-if="linkTips">{{$t('wallet.linkTips')}}</div>
        </div>
    </div>
    <div class="from-to">
        <div class="from">
            <span>{{$t('wallet.from')}}:</span>
            <div class="copy-addr-wrap"  >
                <div
                    class="copy-label copy-detail-from" 
                    @click="copyAddressFrom" 
                    :data-clipboard-text="detail.from" 
                    @mouseover="mouseOverFrom"
                    @mouseleave="mouseLeaveFrom"
                >
                    {{detail.from | addressFormat}}
                </div>
                <div class="copy-addr" v-if="copyFromPop">{{$t('wallet.copySuccess')}}</div>
                <div class="copy-addr" v-if="copyFromVisable">{{$t('wallet.copyAddress')}}</div>
            </div>
        </div>
        <div class="text">></div>
        <div class="to">
            <span>{{$t('wallet.to')}}:</span>
            <div class="copy-addr-wrap"  slot="reference">
                <div
                    class="copy-label copy-detail-to" 
                    @click="copyAddressTo" 
                    :data-clipboard-text="detail.to" 
                    @mouseover="mouseOverTo"
                    @mouseleave="mouseLeaveTo"
                >
                    {{detail.to | addressFormat}}
                </div>
                <div class="copy-addr" v-if="copyToPop">{{$t('wallet.copySuccess')}}</div>
                <div class="copy-addr" v-if="copyToVisable">{{$t('wallet.copyAddress')}}</div>
            </div>
        </div>
    </div>
    <div class="transaction">{{$t('transaction')}}</div>
    <div class="transaction-content">
        <div class="transaction-item">
            <div class="key">{{$t('wallet.nonce')}}</div>
            <div class="value">{{detail.nonce}}</div>
        </div>
        <div class="transaction-item">
            <div class="key">{{$t('wallet.amount')}}</div>
            <div class="value">{{detail.fil}}FIL</div>
        </div>
        <div class="transaction-item">
            <div class="key">{{$t('wallet.networkServiceCharge')}}</div>
            <div class="value">{{ detail.all_gas_fee }}</div>
        </div>
        <div class="transaction-item">
            <div class="key">{{$t('wallet.totalAmount')}}</div>
            <div class="value">
                <div class="fil">{{detail.totalFil}}FIL</div>
                <!-- <div class="usd">{{detail.totalUsd}}USD</div> -->
            </div>
        </div>
    </div>
    <div class="activity-log">{{$t('wallet.activityLog')}}</div>
    <div class="log-content" v-if="detail.create_time !== '' && detail.block_time !== ''">
        <div class="log-item" v-if="detail.create_time !== ''">{{$t('wallet.transCreated')}} {{detail.create_time}}</div>
        <div class="log-item" v-if="detail.block_time !== ''">{{$t('wallet.transConfirmed')}} {{detail.block_time}},{{$t('wallet.transAmount')}} {{ detail.totalFil }}FIl</div>
    </div>
</div>
</template>
<script>
import ClipboardJS from 'clipboard'
export default {
    data(){
        return{
            copyFromPop:false,
            copyToPop:false,
            copyCIdVisable:false,
            copySignedCidTips:false,
            copyFromVisable:false,
            copyToVisable:false,
            linkTips:false,
        }
    },
    filters:{
        addressFormat(val){
            if(val && val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
    },
    props:{
        signed_cid:String,
        transactionDetails:Boolean,
        detail:Object,
        detailDefault:Object
    },
    methods:{
        closeDetail(){
            this.$emit('update:transactionDetails',false)
        },
        copySignedCid(){
            this.copyCIdVisable = false
            let that = this
            const clipboard = new ClipboardJS('.copy-cid-box')
            clipboard.on('success', function(e) {
                that.copySignedCidTips = true
                setTimeout(()=>{
                    that.copySignedCidTips = false
                },2000)
            })
            clipboard.on('error', function(e) {})
        },
        
        copyAddressFrom(){
            this.copyFromVisable = false
            let that = this
            const clipboard = new ClipboardJS('.copy-detail-from')
            clipboard.on('success', function(e) {
                that.copyFromPop = true
                setTimeout(()=>{
                    that.copyFromPop = false
                },2000)
            })
            clipboard.on('error', function(e) {})
        },
        copyAddressTo(){
            this.copyToVisable = false
            let that = this
            const clipboard = new ClipboardJS('.copy-detail-to')
            clipboard.on('success', function(e) {
                that.copyToPop = true
                setTimeout(()=>{
                    that.copyToPop = false
                },2000)
            })
            clipboard.on('error', function(e) {})
        },
        mouseOverCid(){
            this.copyCIdVisable = true
        },
        mouseLeaveCid(){
            this.copyCIdVisable = false
        },
        mouseOverFrom(){
            this.copyFromVisable = true
        },
        mouseLeaveFrom(){
            this.copyFromVisable = false
        },
        mouseOverTo(){
            this.copyToVisable = true
        },
        mouseLeaveTo(){
            this.copyToVisable = false
        },

        mouseOverLink(){
            this.linkTips = true
        },
        mouseLeaveLink(){
           this.linkTips = false
        },
        skipToWeb(signed_cid){
            openUrl(`https://filscan.io/tipset/message-detail?cid=${signed_cid}`)
        }
        
    }
}
</script>

<style lang="less" scoped>
.dialog-detail{
    padding: 20px;
    .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        .title{
            font-size: 18px;
            color: #222;
            font-weight: bolder;
        }
        i{
            font-size: 24px;
            color: #222;
            cursor: pointer;
        }
    }
    .send-detail{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .text{
            font-size: 16px;
            color: #222;
            flex-grow: 1;
        }
        .c-id-wrap{
            position: relative;
            cursor: pointer;
            .copy-c-id{
                white-space:nowrap;
                position: absolute;
                top: calc(100% + 10px);
                left: 50%;
                transform: translateX(-50%);
                padding: 3px 10px;
                background: rgba(0,0,0,0.8);
                color: #fff;
                border-radius: 5px;
                text-align: center;
                z-index: 9;
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
        i{
            font-size: 22px;
            color: #222;
            cursor: pointer;
            &.el-icon-document-copy{
                margin-right: 10px;
            }
        }
        .link{
            position: relative;
            .tips{
                position: absolute;
                top: calc(100% + 10px);
                right: -15px;
                padding: 3px 10px;
                background: rgba(0,0,0,0.8);
                color: #fff;
                border-radius: 5px;
                text-align: center;
                z-index: 9;
                white-space:nowrap;
                &::after{
                    content: '';
                    width: 0;
                    height: 0;
                    border: 8px solid;
                    border-color: transparent transparent rgba(0,0,0,0.8);
                    position: absolute;
                    bottom: 100%;
                    right: 20px;
                }
            }
        }
    }
    .from-to{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #222;
        margin-bottom: 20px;
        .from,.to{
            display: flex;
            align-items: center;
            cursor: pointer;
            .copy-addr-wrap{
                position: relative;
                .copy-addr{
                    white-space:nowrap;
                    position: absolute;
                    top: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 3px 10px;
                    background: rgba(0,0,0,0.8);
                    color: #fff;
                    border-radius: 5px;
                    text-align: center;
                        z-index: 9;
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
        }
    }
    .transaction{
        font-size: 16px;
        color: #222;
        padding: 8px 0;
        border-bottom:1px solid #eee;
    }
    .transaction-content{
        margin-bottom: 20px;
        .transaction-item{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 14px;
            color: #666;
            padding: 8px 0;
            border-bottom:1px solid #eee;
            .value{
                .fil{
                    margin-bottom: 8px;
                }
            }
        }
    }
    .activity-log{
        font-size: 16px;
        color: #222;
        margin-bottom: 10px;
    }
    .log-item{
        font-size: 14px;
        color:#666;
        padding:0 10px 20px 20px;
        position: relative;
        line-height: 20px;
        &:after{
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 3px;
            background: #ccc;
            position: absolute;
            left: 0;
            top:8px;
        }
        &::before{
            content: '';
            width: 1px;
            height: 100%;
            background: #ccc;
            position: absolute;
            left: 2px;
            top:8px;
        }
        &:last-child{
            &::before{
                display: none;
            }
        }
    }
}
</style>
