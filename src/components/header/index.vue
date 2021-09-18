<template>
    <div class="header">
        <div class="left" @click="toWallet">
            <div class="logo">
                <img class="img" :src="logo" />
            </div>
        </div>
        <div class="networks-select">
            <div class="networks-name" @click="openNetwork">
                <div class="text">{{rpcName}}</div>
                <i
                    class="icon el-icon-arrow-down"
                ></i>
            </div>
        </div>
        <div class="right">
            <div class="user">
                <div class="icon-user-wrap" @click="toAccount">
                    <i class="el-icon-user"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ky-header',
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      settingVisible: false,
      net: ''
    }
  },
  computed: {
    ...mapState('app', [
      'rpcName'
    ])
  },
  methods: {

    openNetwork () {
      this.$emit('openNetwork')
    },
    toWallet () {
      window.location.href = './wallet.html'
    },
    toAccount () {
      window.location.href = './account.html'
    }
  }
}
</script>
<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:8px 10px;
    width: 100%;
    box-sizing: border-box;
    background: #f2f2f2;
    .left{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        .logo{
            width: 28px;
            height: 28px;
            margin-right: 10px;
            .img{
                width: 28px;
                height: 28px;
            }
        }
        .text{
            font-size: 18px;
            color: #222;
            font-weight: 800;
        }
    }
    .networks-select{
        position: relative;
        .networks-name{
            width: 120px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 20px;
            border: 1px solid #ccc;
            padding: 0 15px 0 5px;
            cursor: pointer;
            position: relative;
            .text{
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .icon{
                position: absolute;
                right: 5px;
                top:50%;
                transform: translateY(-50%);
            }
        }
    }
    .right{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .user{
            width: 40px;
            height: 40px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            cursor: pointer;
            .icon-user-wrap{
                i{
                    font-size: 24px;
                    color: #666;
                }
            }

        }
    }
}

</style>
