<template>
<div class="receive-dialog">
     <div class="dialog-content">
            <div class="close" @click="closeDialog"><i class="el-icon-close"></i></div>
            <div class="account" v-if="!edit" @click="editAccount">
                <span class="text">{{accountName}}</span>
                <i class="el-icon-edit-outline"></i>
            </div>
            <div class="input-item" v-else>
                <el-input v-model="name" ></el-input>
                <el-button @click="edit = false">{{$t('wallet.cancel')}}</el-button>
                <el-button type="primary" @click="etitAccountName">{{$t('wallet.confirm')}}</el-button>
            </div>
            <div class="er-code">
                <img class="img" :src="QRUrl" />
            </div>
            <div class="address">
                <div class="copy-wrap">
                    <div 
                        class="address copy-address-box2" 
                        @mouseover="mouseOverAddress"
                        @mouseleave="mouseLeaveAddress" 
                        @click="copyAddress2"
                        :data-clipboard-text="address"
                    >
                        {{address|addressFormat}}
                        
                    </div>
                    <div class="copy-title 1" v-if="copyTitleVisable">{{$t('wallet.copyAddress')}}</div>
                    <div class="copy-title 11" v-if="copyAddressTips2">{{$t('wallet.copySuccess')}}</div>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer reveice-footer">
            <div class="btn-wrap mb">
                <el-button type="primary" @click="toFilscan">{{$t('wallet.lookBtn')}}</el-button>
            </div>
            <div class="btn-wrap">
                <el-button type="primary" @click="exportSecret">{{$t('wallet.exportBtn')}}</el-button>
            </div>
        </div>
</div>
</template>

<script>
import ClipboardJS from 'clipboard'
export default {
    data(){
        return{
            edit:false,
            copyAddressTips2:false,
            copyTitleVisable:false,
            name:''
        }
    },
    props:{
        QRUrl:String,
        accountName:String,
        receiveVisible:Boolean,
        exportSecretVisible:Boolean,
        address:String,
        etitCount:Number
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
    },
    methods:{
        closeDialog(){
            this.$emit('update:receiveVisible',false)
        },
        editAccount(){
            this.name = this.accountName
            this.edit = true
        },
        cancelEdit(){
            this.edit = false
        },
        etitAccountName(){
            window.filecoinwalletDb.accountList.where("address").equals(this.address).modify({accountName:this.name}).then(res=>{
                this.$emit('update:accountName',this.name)
                this.$emit('update:receiveVisible',false)
                this.$emit('update:etitCount',this.etitCount + 1)
                // window.location.href = './wallet.html'
            })
            window.filecoinwalletDb.activeAccount.where("address").equals(this.address).modify({accountName:this.name}).then(res=>{
               console.log('etitAccountName activeAccount')
            })
        },
        mouseOverAddress(){
            this.copyTitleVisable = true
        },
        mouseLeaveAddress(){
            this.copyTitleVisable = false
        },
        copyAddress2(){
            this.copyTitleVisable = false
            let that = this
            const clipboard = new ClipboardJS('.copy-address-box2')
            this.copyAddressTips2 = true
            clipboard.on('success', function(e) {
                that.copyAddressTips2 = true
                setTimeout(()=>{
                    that.copyAddressTips2 = false
                },2000)
            })
            clipboard.on('error', function(e) {})
        },
        exportSecret(){
            this.$emit('update:receiveVisible',false)
            this.$emit('update:exportSecretVisible',true)
        },
        toFilscan(){
            openUrl(`https://filscan.io/tipset/address-detail?address=${this.address}`)
        },
    }
}
</script>

<style lang="less" scoped>
.receive-dialog{
    .reveice-footer{
        padding: 30px ;
        border-top:1px solid #eee;
        .el-button{
                width: 100%;
        }
        .mb{
            margin-bottom: 20px;
        }
    }
    .dialog-content{
        padding: 50px 20px 20px;
        position: relative;
        .close{
            width: 40px;
            height: 40px;
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            i{
                font-size: 22px;
            }
        }
        .logo{
            width: 35px;
            height: 35px;
            position: absolute;
            left: 50%;
            top: -18px;
            transform: translateX(-50%);
        }
        .account{
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .text{
                font-size: 24px;
                color: #222;
                font-weight: bolder;
                margin-right: 15px;
            }
            i{
                font-size: 18px;
                color: #222;
            }
        }
        /* 收款 */
        .input-item{
            display: flex;
            /deep/.el-input{
                margin-right: 20px;
            }
        }
        .er-code{
            width: 180px;
            height: 180px;
            margin: 0 auto;
            padding: 10px 0;
            .img{
                width: 180px;
                height: 180px;
            }
        }
        .address{
            text-align: center;
            font-size: 14px;
            margin: 0 auto;
            word-break: break-all;
            cursor: pointer;    
            display: flex;
            background: #f2f2f2;
            border-radius: 5px;
            color: #999;
            width: 160px;
            box-sizing: border-box;
            padding: 3px 0;
            justify-content: center;
                .copy-wrap{
                    position: relative;
                    .copy-title{
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
}
</style>
