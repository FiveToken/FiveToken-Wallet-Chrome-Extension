<template>
    <div class="receive-dialog">
        <kyBack @pageBack="pageBack"/>
        <div class="dialog-content">
            <div class="name-qr-address">
                <div class="account">
                    {{accountName}}
                </div>
                <div class="er-code">
                    <img class="img" :src="QRUrl" />
                </div>
                <div class="address">{{address}} </div>
            </div>
            <div class="btn-wrap">
                <div class="copy-address-box2" @click="copyAddress2" :data-clipboard-text="address">
                    {{$t('wallet.copyAddress')}}
                </div>
            </div>
        </div>

        <div class="logo">
            <img :src="logo1" class="img" alt="">
        </div>
        <div class="ft">FiveToken</div>
    </div>
</template>

<script>
import ClipboardJS from 'clipboard'
import { mapState } from 'vuex'
import kyBack from '@/components/back'
export default {
    data(){
        return{
            logo1:require('@/assets/image/logo-white.png'),
         }
    },
    props:{
        QRUrl:String,
        accountName:String,
        address:String
    },
    components:{
        kyBack
    },
    methods:{
        pageBack(){
            this.$emit('closeReceive')
        },
        copyAddress2(){
            let that = this
            const clipboard = new ClipboardJS('.copy-address-box2')
            clipboard.on('success', function(e) {
                that.$message.success(that.$t('wallet.copySuccess'))
            })
            clipboard.on('error', function(e) {})
        },
    }
}
</script>

<style lang="less" scoped>
.receive-dialog{
    width: 100%;
    height: 100%;
    background: #5CC1CB;
    padding: 20px;
    box-sizing: border-box;
    /deep/.back-component{
        margin-bottom: 20px;
    }
    .dialog-content{
        position: relative;
        background: #F5F5F5;
        border-radius: 15px;
        .name-qr-address{
            background: #fff;
            border-radius: 10px;
            padding: 30px 45px;
            .account{
                font-size: 14px;
                color: #101010;
                text-align: center;
            }
            .er-code{
                width: 180px;
                height: 180px;
                margin: 0 auto 20px;
                .img{
                    width: 180px;
                    height: 180px;
                }
            }
            .address{
                text-align: center;
                font-size: 14px;
                word-break: break-all;
                color: #101010;
                line-height: 22px;
            }
        }
        .btn-wrap{
            display: flex;
            margin-bottom: 40px;
            .copy-address-box2{
                height: 58px;
                line-height: 58px;
                font-size: 14px;
                color: #101010;
                text-align: center;
                flex-grow: 1;
                cursor: pointer;
            }
        }
    }
    .logo{
        width: 36px;
        height: 36px;
        margin: 0 auto 8px;
        .img{
            width: 36px;
            height: 36px;
        }
    }
    .ft{
        font-size: 14px;
        color: #fff;
        text-align: center;
    }
}
</style>
