<template>
    <ky-layout>
        <div class="setting-networks">
            <networksList
                :networks="networks"
                @networksItemClick="networksItemClick"
                @addNetwork="addNetwork"
                v-if="pageType === 'list'"
            />
            <networksFrom
                :deleteRpc="deleteRpc"
                :detail="detail"
                :pageType.sync="pageType"
                @deleteNetworkCb="deleteNetworkCb"
                @addNetworkCb="addNetworkCb"
                v-if="pageType === 'detail'"
            />
        </div>
    </ky-layout>
</template>

<script>
import networksList from './networks-list'
import networksFrom from './networks-form'
import ExtensionStore from '@/utils/local-store'
export default {
  data () {
    return {
      pageType: 'list',
      detail: null,
      deleteRpc: '',
      networks: [],
      localStore: null
    }
  },
  components: {
    networksList,
    networksFrom
  },
  async mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
    const networks = await localStore.get('networks')
    this.networks = networks
  },
  methods: {
    networksItemClick (obj) {
      this.detail = obj
      this.deleteRpc = obj.rpc
      this.pageType = 'detail'
    },
    addNetwork () {
      this.deleteRpc = ''
      this.detail = null
      this.pageType = 'detail'
    },
    async deleteNetworkCb () {
      const networks = await this.localStore.get('networks')
      if (networks) {
        this.networks = networks
      }
      this.pageType = 'list'
    },
    async addNetworkCb () {
      const networks = await this.localStore.get('networks')
      if (networks) {
        this.networks = networks
      }
      this.pageType = 'list'
    }
  }
}
</script>

<style  lang="less" scoped>
.setting-networks{
    height: 100%;
}
</style>
