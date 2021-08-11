
<template>
    <div class="select-network-component">
       <div class="title-network">{{ $t('importPrivatkey.titleNetwork') }}</div>
       <div class="close" @click="closeNet">
           <i class="el-icon-close"></i>
       </div>
       <div class="network-list">
           <div class="netwotk-item" v-for="(item,index) in networks" :key="index" @click="confirmNet(item)">
               {{ item.name }}
               <i class="el-icon-check check" v-if="rpc === item.rpc"></i>
            </div>
       </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data(){
        return{ }
    },
    computed:{
        ...mapState('app',[
            'rpc',
            'networks'
        ]),
    },
    methods:{
        confirmNet(val){
            this.$emit('confirmNet',val)
        },
        closeNet(){
            this.$emit('closeNet')
        }
    }
}
</script>

<style  lang="less" scoped>
.select-network-component{
    position: relative;
    .title-network{
        height: 43px;
        line-height: 43px;
        font-size: 14px;
        color: #101010;
        border-bottom:1px solid #F5F5F5;
        text-align: center;
    }
    .close{
        width: 20px;
        height: 20px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        i{
            color: #201F1F;
        }
    }
    .network-list{
        max-height: 300px;
        overflow-y: auto;
        .netwotk-item{
            height: 50px;
            line-height: 50px;
            position: relative;
            cursor: pointer;
            color: #131313;
            font-size: 14px;
            padding: 0 10px;
            &::before{
                width: calc(100% - 20px);
                height: 1px;
                content: '';
                position: absolute;
                bottom: 0;
                left: 10px;
                background: #E6F0F0;
            }
            &:hover{
                background: #f5f5f5;
            }
            .check{
                position: absolute;
                top: 50%;
                right: 15px;
                color: #4EC1C9;
                font-size: 18px;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
