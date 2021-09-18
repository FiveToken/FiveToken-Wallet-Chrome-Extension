
<template>
    <div class="select-network-component">
       <div class="title-network">{{ $t('importPrivatkey.titleNetwork') }}</div>
       <div class="close" @click="closeNet">
           <i class="el-icon-close"></i>
       </div>
       <div class="network-list">
           <div class="netwotk-item" v-for="(item,index) in networks" :key="index" @click="confirmNet(item)">
                <div class="img-wrap" v-if="item.disabled">
                   <img class="img" :src="require(`@/assets/svg/${item.image}`)" alt="">
                </div>
                <div class="custom-img" v-else>{{item.name.substring(0,1)}}</div>
                <div class="name">{{ item.name }}</div>
                <i class="el-icon-check check" v-if="net === item.rpc"></i>
            </div>
       </div>
    </div>
</template>

<script>
export default {
  data () {
    return { }
  },
  props: {
    networks: Array,
    net: String
  },
  methods: {
    confirmNet (val) {
      this.$emit('confirmNet', val)
    },
    closeNet () {
      this.$emit('closeNet')
    }
  }
}
</script>

<style  lang="less" scoped>
.select-network-component{
    position: relative;
    padding: 0 0 20px;
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
            display: flex;
            align-items: center;
            justify-content: space-between;
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
            .img-wrap{
                width: 26px;
                height: 26px;
                .img{
                   width: 26px;
                    height: 26px;
                }
            }
            &:nth-child(even){
                .custom-img{
                    background: #9261E8;
                }
            }
            &:nth-child(odd){
                .custom-img{
                    background: #5BC1CA;
                }
            }
            .custom-img{
                width: 26px;
                height: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #fff;
                border-radius: 13px;

            }
            .name{
                padding-left: 10px;
                flex-grow: 1;
            }
            .check{
                position: absolute;
                top: 50%;
                right: 15px;
                color: #4EC1C9;
                font-size: 14px;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
