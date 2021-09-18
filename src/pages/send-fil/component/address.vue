<template>
    <div class="address-components">
        <div class="back-wrap">
            <kyBack :name="$t('sendFil.selectAddress')" @pageBack="back"/>
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
        <div class="search-wrap" v-if="search">
            <div class="address-list" v-if="searchList">
                <div class="address-item" v-for="(item,index) in searchList" :key="index" @click="addressClick(item,'search')">
                    <div class="addressName" v-if="item.accountName">{{item.accountName}}</div>
                    <div class="address">{{item.address}}</div>
                </div>
            </div>
        </div>
        <div class="select-wrap" v-else>
            <el-collapse :value="collapse">
                <el-collapse-item :title="$t('sendFil.recordLast')" name="1" v-if="addressRecordLast.length">
                    <div class="address-list">
                        <div class="address-item" v-for="(item,index) in addressRecordLast" :key="index" @click="addressClick(item,'record')">
                            <div class="address">{{item.address}}</div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item :title="$t('sendFil.myAccount')" name="2">
                    <div class="address-list" v-if="accountList">
                        <div class="address-item" v-for="(item,index) in accountList" :key="index" @click="addressClick(item,'myAccount')">
                            <div class="addressName">{{item.accountName}}</div>
                            <div class="address">{{item.address}}</div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item :title="$t('sendFil.addressBook')" name="3" v-if="addressBook.length">
                    <div class="address-list">
                        <div class="address-item" v-for="(item,index) in addressBook" :key="index" @click="addressClick(item,'book')">
                            <div class="addressName">{{item.accountName}}</div>
                            <div class="address">{{item.address}}</div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>

import kyBack from '@/components/back'
import kyInput from '@/components/input'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      search: '',
      searchList: [],
      collapse: ['1', '3']
    }
  },
  computed: {
    ...mapState('app', [
      'rpc'
    ]),
    ...mapState('send-fil', [
      'addressRecordLast',
      'addressBook',
      'accountList'
    ])
  },
  components: {
    kyBack,
    kyInput
  },
  methods: {
    changeSearch (val) {
      this.search = val
      const totalList = [
        ...this.addressRecordLast,
        ...this.addressBook,
        ...this.accountList
      ]
      this.searchList = totalList.filter(n => {
        return n.address.indexOf(val) > -1 || (n.accountName && n.accountName.indexOf(val) > -1)
      })
    },
    addressClick (item, type) {
      this.$emit('selectAddress', { item, type })
    },
    back () {
      this.$emit('colseAddress')
    },
    searchClear () {
      this.search = ''
    }
  }
}
</script>

<style  lang="less" scoped>
.address-components{
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
    .address-list{
        padding:0 20px;
        .address-item{
            cursor: pointer;
            padding: 10px 0;
            border-bottom:1px solid #F6F7FF;
            &:last-child{
                border-bottom:none;
            }
            .addressName{
                font-size: 14px;
                color: #101010;
                margin-bottom: 5px;
            }
            .address{
                font-size: 12px;
                color: #6A6767;
            }
        }
    }
    .search-wrap{

    }
    .select-wrap{
        /deep/.el-collapse-item__header{
            padding: 0 20px;
            background: #AFE0E5;
            height: 44px;
            line-height: 44px;
        }
        /deep/.el-collapse-item__content{
            padding-bottom: 0;
        }
    }
}
</style>
