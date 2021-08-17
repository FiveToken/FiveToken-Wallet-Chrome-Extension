<template>
  <layout>
    <div class="message-detail-page">
      <div class="back-wrap">
        <kyBack :name="$t('messageDetail.title')" @pageBack="back" />
      </div>
      <div class="content" v-if="detail">
        <div class="icon-wrap">
          <i class="el-icon-time"></i>
        </div>
        <div class="status">{{ statusName }}</div>
        <div class="time">{{ time }}</div>
        <div class="amount">
          <div class="label">{{ $t("messageDetail.amount") }}:</div>
          <div class="value">
            {{ detail.value | formatAmount(8,detail.decimals) }} {{ detail.token }}
          </div>
        </div>
        <div class="info">
          <div class="info-item">
            <div class="label">
              {{  detail.type === 'pending'?$t("messageDetail.willgasFee"):$t("messageDetail.gasFee") }}:
            </div>
            <div class="value">
              <div class="text">
                {{ detail.allGasFee | formatGas(8,detail.decimals) }} {{ detail.token }}
              </div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("messageDetail.from") }}:</div>
            <div class="value">
              <div class="text">{{ detail.from }}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("messageDetail.to") }}:</div>
            <div class="value">
              <div class="text">{{ detail.to }}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="label">{{ $t("messageDetail.messageId") }}</div>
            <div class="value">
              <div class="text">{{ detail.signed_cid }}</div>
            </div>
            <div class="view" @click="viewInBroswer">
              <i class="el-icon-top-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import layout from "@/components/layout";
import kyBack from "@/components/back";
import { getQueryString,formatNumber, formatDate, isFilecoinChain } from "@/utils";
import { mapState } from "vuex";
export default {
  data() {
    return {
      detail: null,
    };
  },
  filters: {
    formatAmount(val, n,decimals) {
      let dec = val / Math.pow(10,Number(decimals))
      let num = formatNumber(dec,n)
      return num
    },
    formatGas(val, n,decimals) {
      console.log(decimals,'decimals 77777')
      let dec = val / Math.pow(10,Number(decimals))
      let num = formatNumber(dec,n)
      return num
    },
  },
  computed: {
    ...mapState('app',['networkType','browser']),
    time() {
      let str = "";
      if (this.detail && this.detail.type === "pending") {
        str = this.detail.create_time;
      } else {
        str = this.detail.block_time;
      }
      return str;
    },
    statusName() {
      let name = "";
      if (this.detail) {
        if (this.detail.type === "success") {
          name = this.$t("messageDetail.success");
        } else if (this.detail.type === "error") {
          name = this.$t("messageDetail.error");
        } else {
          name = this.$t("messageDetail.pending");
        }
      }
      return name;
    },
  },
  components: {
    layout,
    kyBack,
  },
  mounted() {
    let listObjStr = getQueryString("listObjStr");
    let detailObj = JSON.parse(listObjStr);
    this.detail = Object.assign({}, this.detail, detailObj);
    console.log(detailObj, "listObjStr 123");
  },
  methods: {
    back() {
      window.location.href = './wallet.html?fromPage=messageDetail';
    },
    viewInBroswer() {
      if (this.browser) {
        let signed_cid = this.detail.signed_cid;
        let url = "";
        if (isFilecoinChain(this.networkType)) {
          url = this.browser + `/tipset/message-detail?cid=${signed_cid}`;
          openUrl(url);
        } else {
          url = this.browser + `/tx/${signed_cid}`;
          openUrl(url);
        }
      }else{
        this.$message.error(this.$t("messageDetail.noBrowser"));
      }
    },
  },
};
</script>
<style lang="less" scoped>
.message-detail-page {
  width: 100%;
  height: 100%;
  .back-wrap {
    padding: 15px 20px;
    border-bottom: 1px solid #f6f7ff;
  }
  .content {
    padding: 20px;
    .icon-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      i {
        color: #5cc1cb;
        font-weight: bold;
        font-size: 48px;
      }
    }
    .status {
      font-size: 14px;
      color: #6a6767;
      text-align: center;
      line-height: 17px;
      margin-bottom: 8px;
    }
    .time {
      font-size: 12px;
      line-height: 14px;
      color: #a8a5a5;
      margin-bottom: 8px;
      text-align: center;
      margin-bottom: 20px;
    }
    .amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      padding: 20px 10px;
      border-radius: 5px;
      .label {
        font-size: 14px;
        color: #131313;
        line-height: 20px;
      }
      .value {
        font-size: 14px;
        color: #101010;
        line-height: 20px;
        font-weight: bold;
      }
      margin-bottom: 20px;
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
        .view {
          width: 24px;
          padding-left: 10px;
          cursor: pointer;
          i {
            font-size: 24px;
            color: #5cc1cb;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
