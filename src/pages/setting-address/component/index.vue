<template>
<div class="setting-address">
    <div class="address-content">
        <addressList v-if="pageType === 'list'" :pageType.sync='pageType' @addressDetail="addressDetail" />
        <addressFrom v-else :pageType.sync="pageType" :detailObj="detailObj" :to="to"/>
    </div>
</div>
</template>

<script>
import addressList from './address-list'
import addressFrom from './address-form'
import { getQueryString } from '@/utils'
export default {
    data(){
        return{
            pageType:'list',
            detailObj:null,
            to:''
        }
    },
    components:{
        addressList,
        addressFrom
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
        addressDetail(detailObj){
            console.log(detailObj,'addressDetailaddressDetail')
            this.pageType = 'detail'
            this.detailObj = detailObj
        }
    }
}
</script>

<style  lang="less" scoped>
.setting-address{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
}
</style>
