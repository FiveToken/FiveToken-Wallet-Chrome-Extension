<template>
<div class="create-success">
    <bHeader v-if="accountList.length"/>
    <div class="content">
        <div class="title">{{$t('createSuccess.title')}}</div>
        <div class="sub-title">{{$t('createSuccess.subTitle')}}</div>
        <div class="skill">{{$t('createSuccess.skill')}}</div>
        <div class="skill-list">
            <div class="skill-item" v-for="(item,index) in $t('createSuccess.skillArr')" :key="index">{{item}}</div>
        </div>
        <div class="warn">*{{$t('createSuccess.warn')}}</div>
        <div class="btn-wrap">
            <el-button type="primary" @click="complete">{{$t('createSuccess.btn')}}</el-button>
        </div>
    </div>
</div>
</template>
<script>
import bHeader from '@/components/header'
export default {
    data(){
        return{
            accountList:[]
        }
    },
    components:{
        bHeader
    },
    
    async mounted(){
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ()|| [];
        this.accountList = accountList
    },
    methods:{
        complete(){
            window.location.href = './wallet.html'
        },
        async getSciFiBooks() {
            let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ();
            return accountList
        }
    }
}
</script>

<style  lang="less" scoped>
.create-success{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    .content{
        padding: 20px;
       .title{
            color: #222;
            font-size: 36px;
            font-weight: bolder;
            margin-bottom: 30px;
        }
        .sub-title{
            color: #222;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .skill{
            font-size: 20px;
            color: #222;
            font-weight: bolder;
            margin-bottom: 30px;
        }
        .skill-list{
            margin-bottom: 30px;
            .skill-item{
                font-size: 14px;
                color: #222; 
                line-height: 20px;  
                margin-bottom: 10px;
                position: relative;
                padding-left: 15px;
                &::after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 4px;
                    height: 4px;
                    border-radius: 2px;
                    background: #222;
                }
            }
        }
        .warn{
            font-size: 14px;
            color: #222; 
            line-height: 20px;  
            margin-bottom: 30px;

        }
       
    }
}
</style>
