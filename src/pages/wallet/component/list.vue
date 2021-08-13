<template>
    <div class="list-wrap">
        <div class="tab">
            <div class="tab-item" v-for="(item,index) in $t('wallet.tab')" :key="index" 
                :class="{active:type === item.type}"
                @click="selectType(item.type)"
            >{{ item.name }}</div>
        </div>
        <div class="list">
            <div class="list-property" v-if="type === '1'">
                <div class="list-item" @click="selectType('2')">
                    <div class="logo">
                        <img class="img" :src="filLogo" />
                    </div>
                    <div class="amount">
                        <div class="fil">Filecoin</div>
                        <div class="usd">$ {{(balance*price_usd).toFixed(2)}}</div>
                    </div>
                    <div class="fil-amount">{{balance.toFixed(4)}} FIL</div>
                </div>
            </div>
            <div class="list-activity" v-if="type === '2'">
                <div class="activity-item" v-for="(values,key) in listData.obj" :key="key">
                    <div class="date-refresh">
                        <div class="t">{{ key | isToday(that) }}</div>
                        <div class="refresh" :class="{animate:listFetch}" @click="refreshList"><i class="el-icon-refresh"></i></div>
                    </div>
                    <div class="activity-wrap"> 
                        <div class="list-item" v-for="(item,index) in values" :key="index" @click="showDetail(item.signed_cid,item)">
                            <div class="icon reveiced" v-if="item.type === 'success' && item.to === address">
                            <img class="img" :src="send" />
                            </div>
                            <div class="icon send" v-else-if="item.type === 'success' && item.from === address">
                                <img class="img" :src="rec" />
                            </div>
                            <div class="icon pending" v-if="item.type === 'pending'">
                                <img class="img" :src="pending" />
                            </div>
                            <div class="icon error" v-if="item.type === 'error'">
                                <img class="img" :src="error" />
                            </div>
                            <div class="des">
                                <div class="name">{{item.typeName}}</div>
                                <div class="from-to">
                                    <span :class="{from:address === item.from}">{{item.from | addressFormat}} </span>
                                    - 
                                    <span :class="{to:address === item.to}">{{item.to |addressFormat }}</span>
                                </div>
                            </div>
                            <div class="amount">
                                <div class="fil">{{ Number(item.value) / Math.pow(10, 18)}} FIL</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no-data" v-if="listData.list && !listData.list.length">{{$t('wallet.noTransactionRecord')}}</div>
                <div class="view-more" v-if="isNext"><div @click="getNextPage" class="btn">{{$t('wallet.viewMore')}}</div></div>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageByAddressDirection } from '@/utils/api'
import { formatDate ,getNowFormatDateEn,formatDateEn} from '@/utils'
export default {
    data(){
        return{
            that: this,
            filLogo:require('@/assets/image/fil-w.png'),
            rec:require('@/assets/image/rec.png'),
            send:require('@/assets/image/send.png'),
            pending:require('@/assets/image/pending.png'),
            error:require('@/assets/image/fail.png'),
            type:'1',
            listParams:{
                "address": "",
                "timePoint": new Date().getTime(),
                "direction": "up",
                "count": 10,
                "method": ""
            },
            isNext:false,
            listFetch:false,
            listData:[]
        }
    },
    props:{
        address:String,
        price_usd:Number,
        balance:Number,
        walletNonce:Number,
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
        isToday(val,that){
            let nowDate = getNowFormatDateEn()
            if(nowDate === val){
                return that.$t('wallet.today')
            }else{
                return val
            }
        }
    },
    watch:{
        address:{
            handler(newVal){
                if(newVal){
                    this.$set(this.listParams,'address',newVal)
                    this.getList()
                }
            },
            immediate:true
        }
    },
    methods:{
        // get message list
        async getMyMesList(){
            let mesList = await window.filecoinwalletDb.messageList.where({ kunyao:'kunyao'}).reverse().sortBy('block_time')|| []
            let myMesList = mesList.filter(n=>{
                return n.from === this.address || n.to === this.address
            })
            let dateList = myMesList.map(n=>{
                let date = formatDateEn(n.block_time,false)
                let succ = this.address === n.from ? this.$t('wallet.sendSuccess') : this.$t('wallet.receivedSuccess')
                let err = this.address === n.from ? this.$t('wallet.sendError') : this.$t('wallet.receivedError')
                let typeName = ''
                switch(n.type){
                    case 'success':
                        typeName = succ
                        break;
                    case 'error':
                        typeName = err
                        break;
                    case 'pending':
                        typeName = this.$t('wallet.waiting')
                        break;
                }
                return {
                    date,
                    typeName,
                    ...n,
                }
            }) || []
            let resObj = {}
            dateList.forEach((n,index)=>{
                if(resObj.hasOwnProperty(n.date)){
                    resObj[n.date].push(n)
                }else{
                    resObj[n.date] = []
                    resObj[n.date].push(n)
                }
            })
            return {
                obj:resObj,
                list:dateList
            }
        },
        getNextPage(){
            this.getList()
        },
        refreshList(){
            this.$set(this.listParams,'timePoint',new Date().getTime())
            this.$set(this.listParams,'address',this.address)
            this.getList()
        },
        // update message status
        getList(){
            if(this.listFetch)return
            this.listFetch = true
            MessageByAddressDirection([this.listParams]).then(async (result)=>{
                let that = this
                this.listFetch = false
                console.log(result,'MessageByAddressDirection')
                let res = result.data
                if(res && res.data){
                    let resList = res.data
                    let total = res.total
                    let block_time = resList.length && resList[resList.length - 1].block_time
                    this.$set(this.listParams,'timePoint',block_time)
                    // delete state pending && nonce > walletnonce
                    let mesList = await window.filecoinwalletDb.messageList.where({ kunyao:'kunyao'}).reverse().sortBy('block_time')|| []
                    let myMesList = mesList.filter(n=>{
                        return n.from === this.address || n.to === this.address
                    })
                    let effectiveList = myMesList.filter(n=>{
                        return n.type !== 'pending' || (n.type === 'pending' && n.nonce >= this.walletNonce)
                    })
                    let resDbList = []
                    if(effectiveList.length){
                        resList.forEach(n => {
                            let type = n.exit_code === null || n.exit_code === 0 ? 'success':'error';
                            let create_time = ''
                            effectiveList.forEach(m=>{
                                if(n.signed_cid === m.signed_cid){
                                    window.filecoinwalletDb.messageList.where("signed_cid").equals(m.signed_cid).delete()
                                    create_time = m.create_time
                                }
                            })
                            let obj = {
                                signed_cid:n.signed_cid,
                                from:n.from,
                                to:n.to,
                                nonce:n.nonce,
                                kunyao:'kunyao',
                                type,
                                create_time,
                                block_time:n.block_time,
                                value:n.value
                            }
                            resDbList.push(obj)
                        })
                        await window.filecoinwalletDb.messageList.bulkPut(resDbList)
                        this.listData = await this.getMyMesList()
                    }else{
                        let dList = resList.map(n=>{
                            return {
                                signed_cid:n.signed_cid,
                                from:n.from,
                                to:n.to,
                                nonce:'',
                                kunyao:'kunyao',
                                type:n.exit_code === null || n.exit_code === 0 ? 'success':'error',
                                create_time:'',
                                block_time:n.block_time,
                                value:n.value
                            }
                        })
                        await window.filecoinwalletDb.messageList.bulkPut(dList)
                        this.listData = await this.getMyMesList()
                    }

                    if(total >= this.listParams.count){
                        this.isNext = true
                    }else{
                        this.isNext = false
                    }
                }else{
                    this.listData = await this.getMyMesList()
                }
            }).catch(err=>{
                this.listFetch = false
                console.log(err,'MessageByAddressDirection err')
            })
        },
        selectType(type){
            this.type = type
        },
        showDetail(signed_cid,obj){
            this.$emit('openDetail',signed_cid,obj)
        },
    }
}
</script>

<style lang="less" scoped>

@keyframes rotate{
	0%{
		transform: rotateZ(0deg);/*从0度开始*/
	}
	100%{
		transform: rotateZ(360deg);/*360度结束*/
	}
}
    .list-wrap{
        .tab{
            display: flex;
            .tab-item{
                height: 40px;
                line-height: 40px;
                color: #222;
                text-align: center;
                flex-grow: 1;
                cursor: pointer;
                font-size: 14px;
                &.active{
                    color: #5CC1CB;
                    position: relative;
                    &::after{
                        content: '';
                        width: 100%;
                        height: 2px;
                        background: #5CC1CB;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                    }
                }
            }
        }
        .list{
            .list-property{
                // padding-bottom: 100px;
                .list-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    cursor: pointer;
                    .logo{
                        width: 30px;
                        height: 30px;
                        border-radius: 15px;
                        background: #5CC1CB;
                        .img{
                            width: 30px;
                            height: 30px;
                        }
                    }
                    .amount{
                        flex-grow: 1;
                        padding-left: 15px;
                        .fil{
                            font-size: 16px;
                            color: #222;
                            font-weight: bolder;
                        }
                        .usd{
                            font-size: 12px;
                            color: #999;
                        }
                    }
                    .fil-amount{
                        font-size: 14px;
                        color: #5CC1CB;
                    }
                }
            }
            .list-activity{
                .activity-item{
                    &:first-child{
                        .date-refresh{
                            .refresh{
                                display: block;
                                cursor: pointer;
                                &.animate{
                                    animation: rotate 1s linear infinite;
                                }
                            }
                        }
                    }
                    .date-refresh{
                        padding: 3px 20px;
                        font-size: 14px;
                        color: #B4B5B7;
                        background: #F8F8F8;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .refresh{
                            display: none;
                        }
                    }
                }
                .no-data{
                    padding: 15px 0;
                    font-size: 16px;
                    text-align: center;
                    color: #c2c2c2;
                }
                .list-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    .icon{
                        width: 30px;
                        height: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 15px;
                        &.reveiced{
                            background: #5CC1CB;
                        }
                        &.send{
                            background: #5C8BCB;
                        }
                        &.pending{
                            background: #E8CC5C;
                        }
                        &.error{
                            background: #B4B5B7;
                        }
                        .img{
                            width:22px;
                            height: 22px;
                        }
                    }
                    .des{
                        flex-grow: 1;
                        padding-left: 15px;
                        .name{
                            font-size: 14px;
                            color: #222;
                            margin-bottom: 5px;
                            font-weight: bold;
                        }
                        .from-to{
                            font-size: 12px;
                            color:#5CC1CB;
                            .from{
                                color: #999;
                            }
                            .to{
                                color:#999;
                            }
                        }
                    }
                    .amount{
                        flex: 0 0 72px;
                        width: 72px;
                        .fil{
                            font-size: 14px;
                            color: #222;
                            margin-bottom: 5px;
                            font-weight: bold;
                            width: 100%;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            text-align: right;
                        }
                        .usd{
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
                .view-more{
                    display: flex;
                    justify-content: center;
                    padding: 15px 0;
                    .btn{
                        width: 150px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        font-size: 14px;
                        color: #222;
                        margin: 0 auto;
                        border:1px solid #eee;
                        border-radius: 20px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
