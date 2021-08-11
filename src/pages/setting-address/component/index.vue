<template>
    <layout @layoutMounted="layoutMounted">
        <div class="setting-address">
            <addressList 
                v-if="pageType === 'list'" 
                :pageType.sync='pageType' 
                @addressDetail="addressDetail" 
                :addressRecordLast="addressRecordLast"
                :addressBook="addressBook"
            />
            <addressFrom 
                v-else 
                @addAddressCb="addAddressCb" 
                :pageType.sync="pageType" 
                :detailObj="detailObj" 
                :to="to"
            />
        </div>
    </layout>
</template>

<script>
import addressList from './address-list'
import addressFrom from './address-form'
import layout from '@/components/layout'
import { getQueryString } from '@/utils'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            pageType:'list',
            detailObj:null,
            to:'',
            addressRecordLast:[],
            addressBook:[]
        }
    },
    components:{
        addressList,
        addressFrom,
        layout
    },
    computed:{
        ...mapState('app',['rpc','address'])
    },
    mounted(){
        let to = getQueryString('to')
        if(to){
            this.to = to
            this.pageType = 'add'
        }
        console.log(to,'ttoo')
    },
    methods:{
        async layoutMounted(){
            let rpc = this.rpc
            let addressRecordLast = await window.filecoinwalletDb.addressRecordLast.where({ rpc: rpc}).toArray () || [];
            this.addressRecordLast = addressRecordLast.filter(n=>{
                return n.address === this.address
            })
            let addressBook = await window.filecoinwalletDb.addressBook.where({ rpc:rpc}).toArray () || [];
            this.addressBook = addressBook
        },
        addressDetail(detailObj){
            this.pageType = 'detail'
            this.detailObj = detailObj
        },
        async addAddressCb(){
            let rpc = this.rpc
            let addressBook = await window.filecoinwalletDb.addressBook.where({ rpc:rpc}).toArray () || [];
            this.addressBook = addressBook
            this.pageType = 'list'
        }
    }
}
</script>

<style  lang="less" scoped>
.setting-address{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
}
</style>
