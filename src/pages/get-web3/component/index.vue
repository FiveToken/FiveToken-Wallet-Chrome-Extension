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
                    {{connectOrigin}}to access your personal public information?
                </div>
                <div class="tips">Do you trust the website? Your authorization means you allow{{connectOrigin}}to access your personal public information. </div>
                <div class="btn-wrap">
                    <kyButton @btnClick="canael">Cancel</kyButton>
                    <kyButton :type="'primary'" :active="active" @btnClick="getValue">Confirm</kyButton>
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
import { Database } from '@/utils/database.js';
export default {
    data(){
        return{
            logo:require('@/assets/image/logo.png'),
            apiToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg3NTE0YTZEZjRGYjFGYzIwZjRlYTU4QWM1REFjYTg2NjE0Q0I4ZGUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjg2NjI2MjEwMDcsIm5hbWUiOiJmaXZlVG9rZW4ifQ.gzVdJ7_5b_3sIP9gLYtLoD-Cx3hPzBN-e8_4Z168elw",
            loading:require('@/assets/image/loading.png'),
            src:'',
            address:'',
            isFetch:false,
            connectOrigin:'',
            accountName:'',
            active:true,
            db:null
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
        let get = popupGetVal('getWeb3')
        if(get && get.connectOrigin){
            this.connectOrigin = get.connectOrigin
            this.address = get.address
            this.accountName = get.accountName
        }
        let db = new Database()
        this.db = db
        console.log(get,'get update ,999')
    },
    methods:{
        async layoutMounted(){
            
        },
        canael(){
            popupWindowRemove()
        },
        async getValue(){
            console.log(12312)
            let res = popupGetVal('getWeb3')
            try{
                let { address,rpc } = res
                let web3FileDb = await this.db.getTable("web3File",{rpc:rpc,address:address})
                console.log(address,rpc,web3FileDb,'web3FileDb')
                if(web3FileDb.length){
                    this.isFetch = true
                    const client = new Web3Storage({ token: this.apiToken })
                    let cid = web3FileDb[0].cid
                    let result = await client.get(cid)
                    const files = await result.files()
                    let file0 = await this.getBase64(files[0])
                    let file1 = await this.getBase64(files[1])
                    let data = [file0,file1]
                    console.log(file0,file1,'file0,file1 5555')
                    this.isFetch = false
                    popupToBackground('scriptWeb3Storage', data)
                    this.canael()
                }else{
                    this.$message.error('Current account does not save data')
                }
            }catch(error){
                
                this.canael()
            }
            
        },
        getBase64(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                let fileResult = "";
                if (file) {
                    reader.readAsDataURL(file);
                }
                reader.onload = function() {
                    fileResult = reader.result;
                };
                reader.onerror = function(error) {
                    reject(error);
                };
                reader.onloadend = function() {
                    resolve(fileResult);
                };
            });
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
        padding: 20px;
        .logo{
            width: 60px;
            height: 60px;
            margin: 0 auto 40px;
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
            padding-top: 30px;
            font-size: 14px;
            color: #666;
            margin-bottom: 190px;
            text-align: center;
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
