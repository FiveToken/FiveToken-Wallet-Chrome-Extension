<template>
<div class="networks-list">
    <div class="back">
        <kyBack :name="$t('settingNetworks.title')" @pageBack="back" :close="true" @pageClose="closeSetting"/>
    </div>
    <div class="list">
        <div class="list-item" :class="{disabled:item.disabled}" v-for="(item,index) in networks" :key="index" @click="networksItem(item)">
            <i class="el-icon-check check" v-if="rpc === item.rpc"></i>
            <div class="name">{{item.name}}</div>
            <i class="el-icon-lock lock" v-if="item.disabled"></i>
        </div>
    </div>
    <div class="add" @click="addNetwork">
        <kyButton :active="true" :type="'primary'">{{$t('settingNetworks.addNetwork')}}</kyButton>
    </div>
</div>
</template>

<script>
import kyBack from '@/components/back'
import kyButton from '@/components/button'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            networks:[]
        }
    },
    computed:{
        ...mapState('app',['rpc'])
    },
    components:{
        kyBack,
        kyButton
    },
    async mounted(){
        let networks = await window.filecoinwalletDb.networks.where({ khazix:'khazix'}).sortBy('create_time');
        this.networks = networks
    },
    methods:{
        back(){
            window.location.href = './setting.html'
        },
        closeSetting(){
            window.location.href = './wallet.html'
        },
        networksItem(obj){
            this.$emit('networksItemClick',obj)
        },
        addNetwork(){
            this.$emit('addNetwork')
        }
    }
}
</script>

<style  lang="less" scoped>
.networks-list{
    height: 100%;
    position: relative;
    padding:60px 0;
    box-sizing: border-box;
    .add{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /deep/.button-wrap{
            .button.primary.active{
                box-sizing: border-box;
            }
        }
    }
    .back{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding:  15px 20px;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        /deep/.back-component{
            width: 100%;
        }
    }
    .list{
        height: 100%;
        overflow-y: auto;
        .list-item{
            font-size: 14px;
            padding: 15px 20px 15px 40px;
            color: #666;
            border-bottom:1px solid #eee;
            cursor: pointer;
            position: relative;
            .check{
                position: absolute;
                top: 50%;
                left: 15px;
                color: #4EC1C9;
                font-size: 14px;
                transform: translateY(-50%);
            }
            &.disabled{
                color: #ccc;
            }
            .el-icon-lock{
                position: absolute;
                top: 50%;
                right:30px;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
