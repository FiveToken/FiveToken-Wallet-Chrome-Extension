<template>
    <layout>
        <div class="setting-networks">
            <networksList
                :networks="networks"
                @networksItemClick="networksItemClick" 
                @addNetwork="addNetwork" 
                v-if="pageType === 'list'"
            />
            <networksFrom
                :deletaRpc="deletaRpc"
                :detail="detail" 
                :pageType.sync="pageType" 
                @deleteNetworkCb="deleteNetworkCb"
                @addNetworkCb="addNetworkCb"
                v-if="pageType === 'detail'"
            />
        </div>
    </layout>
</template>

<script>
import networksList from './networks-list'
import networksFrom from './networks-form'
import layout from '@/components/layout'
import { Database,reverseOrder } from '@/utils/database.js';
export default {
    data(){
        return{
           pageType:'list',
           detail:null,
           deletaRpc:'',
           networks:[],
           db:null
        }
    },
    components:{
       networksList,
       networksFrom,
       layout
    },
    async mounted(){
        let db = new Database()
        this.db = db
        let networks = await db.getTable('networks',{ khazix:'khazix'});
        this.networks = networks
    },
    methods:{
        networksItemClick(obj){
            this.detail = obj
            this.deletaRpc = obj.rpc
            this.pageType = 'detail'
        },
        addNetwork(){
            this.deletaRpc = ''
            this.detail = null
            this.pageType = 'detail'
        },
        async deleteNetworkCb(){
            let networks = await this.db.getTable('networks',{ khazix:'khazix'},reverseOrder,'create_time')
            this.networks = networks
            this.pageType = 'list'
        },
        async addNetworkCb(){
            let networks = await this.db.getTable('networks',{ khazix:'khazix'},reverseOrder,'create_time')
            this.networks = networks
            this.pageType = 'list'
        },
    }
}
</script>

<style  lang="less" scoped>
.setting-networks{
    height: 100%;
}
</style>
