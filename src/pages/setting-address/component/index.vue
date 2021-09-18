<template>
    <layout @layoutMounted="layoutMounted">
        <div class="setting-address">
            <addressList
                v-if="pageType === 'list'"
                :pageType.sync='pageType'
                @addressDetail="addressDetail"
                @addAddress="addAddress"
                :addressRecordLast="addressRecordLast"
                :addressBook="addressBook"
            />
            <addressFrom
                v-else
                :editAddress="editAddress"
                :addressBook="addressBook"
                @addEditAddressCb="addEditAddressCb"
                @deleteAddressCb="deleteAddressCb"
                :pageType.sync="pageType"
                :detail="detail"
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
import { Database } from '@/utils/database.js'
export default {
  data () {
    return {
      pageType: 'list',
      detail: null,
      to: '',
      editAddress: '',
      addressRecordLast: [],
      addressBook: [],
      db: null
    }
  },
  components: {
    addressList,
    addressFrom,
    layout
  },
  computed: {
    ...mapState('app', ['rpc', 'address'])
  },
  mounted () {
    const to = getQueryString('to')
    if (to) {
      this.to = to
      this.pageType = 'add'
    }
    console.log(to, 'ttoo')
  },
  methods: {
    async layoutMounted () {
      const rpc = this.rpc
      const db = new Database()
      this.db = db
      const addressRecordLast = await db.getTable('addressRecordLast', { rpc: rpc, address: this.address })
      this.addressRecordLast = addressRecordLast
      const addressBook = await db.getTable('addressBook', { rpc: rpc })
      this.addressBook = addressBook
    },
    addressDetail (detailObj) {
      this.pageType = 'edit'
      this.detail = detailObj
      this.editAddress = detailObj.address
    },
    addAddress () {
      this.pageType = 'edit'
      this.detail = null
    },
    async addEditAddressCb () {
      const rpc = this.rpc
      const addressBook = await this.db.getTable('addressBook', { rpc: rpc })
      this.addressBook = addressBook
      this.pageType = 'list'
    },
    async deleteAddressCb () {
      const rpc = this.rpc
      const addressBook = await this.db.getTable('addressBook', { rpc: rpc })
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
