<template>
  <layout @layoutMounted="layoutMounted">
    <div class="add-token-page">
      <div class="back-wrap">
        <kyBack @pageBack="back" :name="$t('addToken.addToken')" />
      </div>
      <div class="add-content">
        <div class="input-item">
          <div class="label">{{ $t("addToken.contractAddress") }}</div>
          <kyInput :value="contract" @changeInput="contractInput"/>
          <div class="error" v-if="isExists">{{ $t("addToken.error") }}</div>
        </div>
        <div class="info" v-if="contractEffective">
          <div class="info-item">
            <div class="label">{{ $t("addToken.contractAddress") }}:</div>
            <div class="value">
              <div class="text">{{contract}}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.token") }}:</div>
            <div class="value">
              <div class="text">{{name}}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.tokenSymbol") }}:</div>
            <div class="value">
              <div class="text">{{symbol}}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("addToken.decimalPoint") }}</div>
            <div class="value">
              <div class="text">{{decimals}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <kyButton
          :type="'primary'"
          @btnClick="addContract"
          :active="active"
        >
          {{ $t("addToken.addToken") }}
        </kyButton>
      </div>
      <!-- <kyCanvas /> -->
      <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" />
      </div>
    </div>
  </layout>
</template>
<script>
import layout from "@/components/layout";
import kyBack from "@/components/back";
import kyInput from "@/components/input";
import kyButton from "@/components/button";
// import kyCanvas from "@/components/canvas";
import { ethers } from 'ethers'
import randomColor from 'randomcolor'
import ABI from '@/utils/abi'
import { mapState } from 'vuex';
export default {
  data() {
    return {
      contract: "0x740542fb3a6ca5ab1dcd067a7e08af9ab9c16886",
      loading: require("@/assets/image/loading.png"),
      isFetch: false,
      provider:null,
      contractEffective:false,
      decimals:'',
      symbol:'',
      name:'',
      tokenList:[],
      isExists:false
    };
  },
  computed:{
      ...mapState('app',['rpc']),
      active(){
          let v = false
          v = this.contract !== '' && this.contractEffective
          return v
      }
  },
  components: {
    layout,
    kyBack,
    kyInput,
    kyButton,
    //kyCanvas
  },
  async mounted() {
    let color = randomColor({
        count: 10,
        hue: 'green'
    });
    console.log(color,'color10')
    let tokenList = await window.filecoinwalletDb.tokenList.where({ khazix:'khazix' }).toArray () || [];
    this.tokenList = tokenList
  },
  methods: {
     layoutMounted() {},
    contractInput(val){
        let that = this
        this.contract = val
        let isExists = this.tokenList.find(item => {return item.contract == this.contract}) != undefined
        this.isExists = isExists
        // '0x740542fb3a6ca5ab1dcd067a7e08af9ab9c16886'
        console.log(isExists,'isExists 123')
        if(!isExists){
            let provider = ethers.getDefaultProvider(this.rpc);
            let contract = new ethers.Contract(this.contract, ABI, provider);
            let decimalsPromise = contract.decimals()
            let namePromise = contract.name()
            let symbolPromise = contract.symbol()
            Promise.all([decimalsPromise, namePromise, symbolPromise]).then((values) => {
                if(values.length === 3){
                    that.contractEffective = true
                    that.decimals = values[0].toString()
                    that.name = values[1]
                    that.symbol = values[2]
                }
                console.log(values,'symbolPromise');
            }).catch(err=>{
                that.contractEffective = false
                that.decimals = ''
                that.name = ''
                that.symbol = ''
                console.log(err,'err123')
            })
        }
        
    },
    back() {
      this.$router.go(-1);
    },
    async addContract() {
        // rpc,name,decimals,symbol,khazix
        if(this.contractEffective){
            await window.filecoinwalletDb.tokenList.add({
                chainName:this.name,
                decimals:this.decimals,
                rpc:this.rpc,
                symbol:this.symbol,
                contract:this.contract,
                khazix:'khazix',
            })
            window.location.href = './wallet.html'
        }
    },
  },
};
</script>

<style  lang="less" scoped>
.add-token-page {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  .back-wrap {
    padding: 15px 20px;
    border-bottom: 1px solid #f6f7ff;
  }
  .add-content {
    padding: 20px;
    .input-item {
        margin-bottom: 30px;
        .label {
            color: #101010;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 8px;
        }
        .error{
            font-size: 12px;
            color: #EA0F0F;
            padding-top: 10px;
        }
    }
    .info {
      border: 1px solid #e6f0f0;
      border-radius: 5px;
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e6f0f0;
        padding: 10px;
        &:last-child {
          border-bottom: none;
        }
        .label {
          font-size: 14px;
          color: #737171;
          line-height: 20px;
          flex-shrink: 0;
        }
        .value {
          padding-left: 20px;
          flex-grow: 1;
          display: flex;
          justify-content: flex-end;
          .text {
            font-size: 14px;
            color: #101010;
            line-height: 20px;
            word-break: break-all;
            text-align: left;
          }
        }
      }
    }
  }

  .btn-wrap {
    padding: 0 20px;
    position: absolute;
    width: 100%;
    bottom: 20px;
    left: 0;
    box-sizing: border-box;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
}
</style>
