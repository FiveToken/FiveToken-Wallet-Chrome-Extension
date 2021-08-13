<template>
<div class="add-wallet">
    <div class="top-nav" v-if="accountList.length">
        <div class="name">{{$t('firstWallet.create')}}</div>
        <div class="close" @click="back">
            <i class="el-icon-close"></i>
        </div>
    </div>
    <div class="question" v-if="!accountList.length">{{$t('firstWallet.question')}}</div>
    <div class="content">
        <div class="item-wrap" v-for="(item,index) in $t('firstWallet.arr')" :key='index'>
            <div class="content-item" v-if="!(isExport === '1' && item.icon === 'el-icon-plus')" >
                <div class="title">{{item.title}}</div>
                <div class="btn-wrap">
                    <el-button type="primary" @click="skipToPages(item.url)">
                        {{item.btn}}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {getQueryString} from '@/utils'
export default {
    data(){
        return{ 
            accountList:[],
            isExport:'0'
        }
    },
    async mounted(){
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ()|| [];
        this.accountList = accountList
        this.isExport = getQueryString('export')
    },
    methods:{
        skipToPages(url){
            console.log(url,'ppppaaaaa')
            window.location.href = url
        },
        back(){
            window.location.href = './wallet.html'
        }
    }

}
</script>

<style  lang="less" scoped>
.add-wallet{
    width: 100%;
    margin: 0 auto;
    overflow-x: auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
  .question{
    text-align: center;
    color: #222;
    font-size: 18px;
    font-weight: bolder;
    padding-top: 20px;
  }
  .top-nav{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
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
  .content{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      padding: 20px;
      .item-wrap{
          width: 100%;
      }
      .content-item{
            padding:20px ;
            border: 1px solid #eee;
            border-radius: 10px;
            margin-bottom: 20px;
            width: 100%;
            box-sizing: border-box;
            .icon{
                text-align: center;
                margin-bottom: 10px;
                i{
                    font-size: 36px;
                    color: #222;
                }
            }
            .title{
                text-align: center;
                color: #222;
                font-size: 18px;
                font-weight: bolder;
                margin-bottom: 10px;
            }
            .sub-title{
                text-align: center;
                color: #222;
                font-size: 16px;
                margin-bottom: 10px;
            }
            .btn-wrap{
                text-align: center;
                padding-top: 20px;
                /deep/.el-button{
                    a{
                        color: #fff;
                        font-size: 14px;
                        text-decoration: none;
                    }
                }
            }
      }
  }
}
</style>
