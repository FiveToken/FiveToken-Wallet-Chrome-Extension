<template>
    <layout>
        <div class="setting-networks">
            <networksList @networksItemClick="networksItemClick" @addNetwork="addNetwork" v-if="pageType === 'list'"/>
            <networksFrom :detail="detail" :pageType.sync="pageType" v-if="pageType === 'detail'"/>
        </div>
    </layout>
</template>

<script>
import networksList from './networks-list'
import networksFrom from './networks-form'
import layout from '@/components/layout'
export default {
    data(){
        return{
           pageType:'list',
           detail:null
        }
    },
    components:{
       networksList,
       networksFrom,
       layout
    },
    mounted(){
       
    },
    methods:{
        networksItemClick(obj){
            console.log(obj,'oobbjj')
            this.detail = obj
            this.pageType = 'detail'
        },
        addNetwork(){
            this.detail = null
            this.pageType = 'detail'
        }
    }
}
</script>

<style  lang="less" scoped>
.setting-networks{
    height: 100%;
}
</style>
