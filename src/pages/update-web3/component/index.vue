<template>
    <layout @layoutMounted="layoutMounted">
        <div class="account-page">
            <div class="accaccount-top">
                <div class="address">{{accountName}} {{address|addressFormat}}</div>
                <div class="network">All blockchain networks</div>
            </div>
            <div class="web3-content">
                <div class="logo">
                    <img :src="logo" class="img" alt="">
                </div>
                <div class="allow">Allow</div>
                <div class="title">
                    {{connectOrigin}}to modify your personal public information?
                </div>
                <div class="tips">Do you trust the website? Your authorization means you allow{{connectOrigin}}to modify your personal public information. </div>
                <div class="info-box">
                    <div class="update">Update content:</div>
                    <div class="img-wrap">
                        <img :src="src" alt="" class="img">
                    </div>
                    <div class="item-wrap">
                        <div class="label">Name:</div>
                        <div class="value">{{nickname}}</div>
                    </div>
                    <div class="item-wrap">
                        <div class="label">Description:</div>
                        <div class="value">{{describe}}</div>
                    </div>
                </div>
                <div class="btn-wrap">
                    <kyButton @btnClick="cancel">Cancel</kyButton>
                    <kyButton :type="'primary'" :active="active" @btnClick="updateValue">Confirm</kyButton>
                </div>
            </div>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
    </layout>
</template>
<script>
import layout from '@/components/layout'
import kyButton from '@/components/button'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
export default {
    data(){
        return{
            logo:require('@/assets/image/logo.png'),
            apiToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg3NTE0YTZEZjRGYjFGYzIwZjRlYTU4QWM1REFjYTg2NjE0Q0I4ZGUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjg2NjI2MjEwMDcsIm5hbWUiOiJmaXZlVG9rZW4ifQ.gzVdJ7_5b_3sIP9gLYtLoD-Cx3hPzBN-e8_4Z168elw",
            loading:require('@/assets/image/loading.png'),
            src:'',
            nickname:'',
            address:'',
            describe:'',
            isFetch:false,
            connectOrigin:'',
            accountName:'',
            active:true
        }
    },
    components:{
        layout,
        kyButton
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        }
    },
    async mounted(){
         let update = popupGetVal('uploadWeb3')
        if(update && update.info){
            this.src = update.file
            this.address = update.info.address
            this.nickname = update.info.nickname
            this.describe = update.info.describe
            this.connectOrigin = update.connectOrigin
            this.accountName = update.info.accountName
        }
        console.log(update,'get update ,999')
    },
    methods:{
        async layoutMounted(){
            
        },
        cancel(){
            popupWindowRemove()
        },
        async updateValue(){
            try{
                this.isFetch = true
                let res = popupGetVal('uploadWeb3')
                let { file,info,option } = res
                let web3File = this.dataURLtoFile(file,'web3File')
                const infoFile = new File([JSON.stringify(info)], 'info')
                const client = new Web3Storage({ token: this.apiToken })
                console.log(info,'info 999999')
                let result = await client.put([web3File,infoFile],option)
                console.log(result,'result 44444444')
                // web3File:'address,rpc,nickname,describe,cid,create_time,khazix'
                await window.filecoinwalletDb.web3File.where({ 
                    address:info.address,
                    rpc:info.rpc,
                }).delete()
                let create_time =  parseInt(new Date().getTime() / 1000)
                await window.filecoinwalletDb.web3File.add({
                    address:info.address,
                    rpc:info.rpc,
                    nickname:info.nickname,
                    describe:info.describe,
                    cid:result,
                    create_time,
                    khazix:'khazix',
                })
                this.isFetch = false
                popupToBackground('scriptUpdateWeb3Storage', result)
                this.cancel()
            }catch(error){
                console.log(error,12312312)
                // this.isFetch = false
            }
            
        },
        dataURLtoFile: function(dataurl, filename) { 
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
    }
}
</script>

<style  lang="less" scoped>
.account-page{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    position: relative;
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
    .accaccount-top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        background: #f5f5f5;
        .address,.network{
            font-size: 14px;
            color: #333;
            text-decoration: underline;
        }
    }
    .web3-content{
        padding: 20px 20px 0;
        .update{
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
        }
        .logo{
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            .img{
                width: 60px;
                height: 60px;
                border-radius: 30px;
            }
        }
        .allow,.title{
            font-size: 18px;
            color: #333;
            text-align: center;
            font-weight: bold;
        }
        .tips{
            padding-top: 20px;
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
            text-align: center;
        }
        .info-box{
            border-radius: 5px;
            border:1px solid #eee;
            padding: 10px;
            margin-bottom: 20px;
            .img-wrap{
                width: 60px;
                height: 60px;
                margin: 0 auto 20px;
                .img{
                    width: 100%;
                }
            }
            .item-wrap{
                display: flex;
                align-items: center;
                justify-content: center;
                .label,.value{
                    font-size: 14px;
                    color: #666;
                }
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            /deep/.button-wrap{
                width: 140px;
            }
        }
    }
    
}
</style>
