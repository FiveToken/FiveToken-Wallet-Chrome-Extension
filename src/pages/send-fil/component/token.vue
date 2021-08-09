<template>
    <div class="token-components">
        <div class="back-wrap">
            <kyBack :name="$t('sendFil.selectToken')" @pageBack="back" />
        </div>
        <div class="input-content">
            <div class="input-item">
                <kyInput :value="search" @changeInput="changeSearch" />
                <div class="search">
                    <i class="el-icon-search"></i>
                </div>
                <div class="close" v-if="search" @click="searchClear">
                    <i class="el-icon-close"></i>
                </div>
            </div>
        </div>
        <div class="search-list token-list" v-if="search">
            <div class="token-item" v-for="(item,index) in searchList" :key="index" @click="selectToken(item)">
                <div class="logo">
                    <img :src="img" alt="" class="img" />
                </div>
                <div class="info">
                    <div class="b-s">
                        <div class="balance">{{item.balance / Math.pow(10,Number(item.decimals))}}</div>
                        <div class="symbol">{{item.symbol}}</div>
                    </div>
                    <div class="name">{{item.chainName}}</div>
                </div>
            </div>
        </div>
        <div class="token-list" v-else>
            <div class="token-item" v-for="(item,index) in tokenList" :key="index" @click="selectToken(item)">
                <div class="logo">
                    <img :src="img" alt="" class="img" />
                </div>
                <div class="info">
                    <div class="b-s">
                        <div class="balance">{{item.balance/ Math.pow(10,Number(item.decimals))}}</div>
                        <div class="symbol">{{item.symbol}}</div>
                    </div>
                    <div class="name">{{item.chainName}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import kyBack from '@/components/back'
import kyInput from '@/components/input'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            search:'',
            searchList:[],
            img:require('@/assets/image/fil-w.png'),
        }
    },
    computed:{
        ...mapState('app',[
            'rpc',
        ]),
        ...mapState('send-fil',['tokenList'])
    },
    components:{
        kyBack,
        kyInput
    },
    mounted(){},
    methods:{
        changeSearch(val){
            this.search = val
            let totalList = [
                ...this.tokenList
            ]
            this.searchList = totalList.filter(n=>{
                return n.chainName.indexOf(val) > -1 || n.symbol.indexOf(val) > -1
            })
        },
        back(){
           this.$emit('colseToken') 
        },
        selectToken(item){
            this.$emit('selectToken',item)
        },
        searchClear(){
            this.search = ''
        }
    }
}
</script>

<style  lang="less" scoped>
.token-components{
    .back-wrap{
        padding: 15px 20px;
        border-bottom:1px solid #F6F7FF;
    }
    .input-content{
        padding: 20px;
        .input-item{
            height: 36px;
            background: #F5F5F5;
            border-radius: 5px;
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 30px;
            .search{
                height: 14px;
                display: flex;
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
            }
            .close{
                height: 14px;
                display: flex;
                cursor: pointer;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
            }
            /deep/.input-component{
                flex-grow: 1;
                .el-input__inner{
                    border: none;
                }
            }
        }
    }
    .token-list{
        padding: 0 20px;
        .token-item{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #F6F7FF;
            position: relative;
            padding: 10px 0;
            cursor: pointer;
            .logo{
                width: 26px;
                height: 26px;
                background: #5CC1CB;
                border-radius: 13px;
                .img{
                    width: 26px;
                    height: 26px;
                }
            }
            .info{
                padding-left: 10px;
                .b-s{
                    display: flex;
                    align-items: center;
                    margin-bottom: 2px;
                    flex-grow: 1;
                    .balance{
                        font-size: 12px;
                        color: #101010;
                        margin-right: 10px;
                    }
                    .symbol{
                        font-size: 14px;
                        color: #131313;
                        font-weight: bold;
                    }
                }
                .name{
                    font-size: 12px;
                    color: #6A6767;
                }
            }
            .check{
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                i{
                    color: #5CC1CB;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
