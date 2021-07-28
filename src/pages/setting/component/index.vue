<template>
<div class="setting">
    <div class="top-nav">
        <div class="name">{{$t('setting.name')}}</div>
        <div class="close" @click="back">
            <i class="el-icon-close"></i>
        </div>
    </div>
    <div class="setting-content">
        <div class="menu">
            <div v-for="(item,index) in $t('setting.menu')" :key="index">
                <a :href="item.url" class="menu-item" v-if="!((item.url === './setting-backups.html') && !mnemonicWords)">
                    <div class="left">{{ item.name }}</div>
                    <div class="right">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </a>
            </div>
            
        </div>
    </div>
</div>
</template>

<script>

export default {
    data(){
        return{
            mnemonicWords:''
        }
    },
    
    async mounted(){
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ();
        let mnemonicWords = activeAccount.length && activeAccount[0].mnemonicWords
        this.mnemonicWords = mnemonicWords
    },
    methods:{
        back(){
            window.location.href = './wallet.html'
        }
    }
}
</script>

<style  lang="less" scoped>
.setting{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    .top-nav{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        .name{
            font-size: 18px;
            color: #222;
            font-weight: bolder;
        }
        .close{
            cursor: pointer;
            i{
                font-size: 18px;
            color: #222;  
            }
        }
    }
    .setting-content{
        display: flex;
        align-items: flex-start;
        .menu{
            width: 100%;
            .menu-item{
                color: #222;
                text-decoration: none;
                padding:0 20px;
                width: 100%;
                height: 50px;
                line-height: 50px;
                display: flex;
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
                .left{
                    flex-grow: 1;
                    font-size: 14px;
                    color: #222;
                    text-decoration: none;
                }
            }
        }
    }
}
</style>
