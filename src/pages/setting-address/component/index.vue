<template>
    <ky-layout @layoutMounted="layoutMounted">
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
    </ky-layout>
</template>

<script>
import addressList from './address-list'
import addressFrom from './address-form'
import { getQueryString } from '@/utils'
import { mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
export default {
  components: {
    addressList,
    addressFrom
  },
  data () {
    return {
      pageType: 'list',
      detail: null,
      to: '',
      editAddress: '',
      addressRecordLast: [],
      addressBook: [],
      localStore: null
    }
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
  },
  methods: {
    async layoutMounted () {
      const rpc = this.rpc
      const localStore = new ExtensionStore()
      this.localStore = localStore
      const _addressRecordLast = await localStore.get('addressRecordLast')
      if (_addressRecordLast) {
        const addressRecordLast = _addressRecordLast.filter(n => {
          return (n.rpc === rpc) && (n.address === this.address)
        })
        this.addressRecordLast = addressRecordLast
      }

      const _addressBook = await localStore.get('addressBook')
      if (_addressBook) {
        const addressBook = _addressBook.filter(n => n.rpc === rpc)
        this.addressBook = addressBook
      }
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
      const _addressBook = await this.localStore.get('addressBook') || []
      if (_addressBook) {
        const addressBook = _addressBook.filter(n => n.rpc === rpc)
        this.addressBook = addressBook
      }
      this.pageType = 'list'
    },
    async deleteAddressCb () {
      const rpc = this.rpc
      const _addressBook = await this.localStore.get('addressBook') || []
      if (_addressBook) {
        const addressBook = _addressBook.filter(n => n.rpc === rpc)
        this.addressBook = addressBook
      }
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
