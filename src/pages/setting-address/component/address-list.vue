<template>
<div class="address-list">
    <div class="back-wrap">
        <kyBack
            @pageBack="back"
            :name="$t('settingAddress.addressBook')"
            :close="true"
            @pageClose="closeSetting"
        />
    </div>
    <div class="book-list">
        <div
            class="address-item"
            v-for="(item,index) in addressBook"
            :key="index"
            @click="addressClick(item)"
        >
            <div class="addr">
                <div class="name">{{item.accountName}}</div>
                <div class="add">{{item.address}}</div>
            </div>
            <div class="a-right"><i class="el-icon-arrow-right"></i></div>
        </div>
    </div>
    <div class="position">
        <div class="add-btn">
            <kyButton :type="'primary'" :active="true" @btnClick="addAddress">
                {{$t('settingAddress.add')}}
            </kyButton>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import kyBack from '@/components/back'
import kyButton from '@/components/button'
export default {
  data () {
    return {
      search: '',
      collapse: '1'
    }
  },
  components: {
    kyBack,
    kyButton
  },
  props: {
    pageType: String,
    addressRecordLast: Array,
    addressBook: Array
  },
  computed: {
    ...mapState('app', ['accountList'])
  },
  filters: {
    addressFormat (val) {
      if (val.length > 12) {
        return val.substr(0, 6) + '...' + val.substr(val.length - 6, 6)
      } else {
        return val
      }
    }
  },
  mounted () {

  },
  methods: {
    changeSearch (val) {
      this.search = val
    },
    back () {
      window.location.href = './setting.html'
    },
    closeSetting () {
      window.location.href = './wallet.html'
    },
    addressClick (detail) {
      console.log(detail, 'detail 123')
      this.$emit('addressDetail', detail)
    },
    addAddress () {
      this.$emit('addAddress')
    }
  }
}
</script>

<style  lang="less" scoped>
.address-list{
    height: 100%;
    background: #fff;
    .back-wrap{
        padding:  15px 20px;
        border-bottom: 1px solid #F6F7FF;
    }
    .search-address{
        padding: 10px 20px;
        position: relative;
        .search{
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .book-list{
        height: 480px;
        overflow-y: auto;
        padding: 0 20px;
        .address-item{
            background: #fff;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            .a-right{
                font-size: 14px;
                color: #222;
            }
            .addr{
                font-size: 12px;
                color: #999;
                .name{
                    font-size: 14px;
                    color: #222;
                }
                .add{
                    width: 100%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    whitewhite-space: nowrap;
                }
            }

        }
    }
    .position{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        .add-btn{
            display: flex;
            padding:15px 20px;
            /deep/.el-button{
                flex-grow: 1;
            }
        }
    }
}
</style>
