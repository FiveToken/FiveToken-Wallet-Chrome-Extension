<template>
<div class="export-dialog">
    <div class="dialog-content">
        <div class="close" @click="closeExport"><i class="el-icon-close"></i></div>
        <div class="account">
            <span class="text">{{accountName}}</span>
        </div>
        <div class="address">{{address|addressFormat}}</div>
    </div>
    <div slot="footer" class="dialog-footer export-footer">
        <div class="title">{{$t('wallet.title')}}</div>
        <div class="input-item">
            <div class="label">{{$t('wallet.label')}}</div>
            <el-input v-model="password" type="password"></el-input>
        </div>
        <div class="tips">{{$t('wallet.tips')}}</div>
        <div class="btn-box">
            <el-button type="primary" class="mr" plain @click="closeExport">{{$t('wallet.cancel')}}</el-button>
            <el-button type="primary" @click="showSecret">{{$t('wallet.confirm')}}</el-button>
        </div>
    </div>
</div>
</template>

<script>
import { privateKeyDecode,validatePrivateKey} from '@/utils/key'
export default {
    data(){
        return{
            edit:false,
            password:''
        }
    },
    props:{
        accountName:String,
        address:String,
        exportSecretVisible:Boolean,
        showPkVisible:Boolean,
        encodePrivateKey:String,
        digest:String,
        hexPrivateKey:String
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
        closeExport(){
            this.$emit('update:exportSecretVisible',false)
        },
        strToHexCharCode(pk) {
        　　if(pk === "") return "";
            let obj = {
                Type:'secp256k1',
                PrivateKey:pk
            }
            let str = JSON.stringify(obj)
        　　var hexCharCode = [];
        　　for(var i = 0; i < str.length; i++) {
        　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
        　　}
        　　return hexCharCode.join("");
        },
        // Verify password
        async showSecret(){
            let voild = await validatePrivateKey(this.address,this.password,this.encodePrivateKey,this.digest)
            let privateKey = privateKeyDecode(this.encodePrivateKey,this.address, this.password)
            if(voild){
                let hexPrivateKey = this.strToHexCharCode(privateKey)
                this.$emit('update:exportSecretVisible',false)
                this.$emit('update:showPkVisible',true)
                this.$emit('update:hexPrivateKey',hexPrivateKey)
                this.password = ''
            }else{
                this.$message.error(this.$t('wallet.passwordError')) 
            }
        },
    }
}
</script>

<style lang="less" scoped>
.export-dialog{
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
        .input-item{
            display: flex;
            /deep/.el-input{
                margin-right: 20px;
            }
        }
        .address{
            text-align: center;
            font-size: 14px;
            margin: 0 auto;
            word-break: break-all;
            display: flex;
            // cursor: pointer;    
            // background: #f2f2f2;
            border-radius: 5px;
            color: #999;
            box-sizing: border-box;
            padding: 3px 10px;
            justify-content: center;
        }
    }
    .export-footer{
        padding: 20px;
        .title{
            padding-top: 15px;
            text-align: center;
            font-size: 18px;
            font-weight: bolder;
            margin-bottom: 20px;
        }
        .input-item{
            margin-bottom: 15px;
            .label{
                font-size: 14px;
                color: #222;
                margin-bottom: 10px;
                text-align: left;
            }
        }
        .tips{
            background: #FFF6F6;
            padding: 10px;
            color: #E91953;
            font-size: 14px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: left;
        }
        .btn-box{
            display: flex;
            justify-content: center;
            .mr{
                margin-right: 20px;
            }
        }
        .copy-box{
            padding: 10px;
            border-radius: 10px;
            border:1px solid #eee;
            font-size: 14px;
            color: #E91550;
            margin-bottom: 15px;
            text-align: center;
            word-break: break-all;
            cursor: pointer;
        }
        .copy-key-wrap{
            position: relative;
            .copy-p-k{
                width: 80px;
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
</style>
