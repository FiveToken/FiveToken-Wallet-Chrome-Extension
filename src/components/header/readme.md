# header compontent

## emit
openNetwork : Click to select the callback function of the network 

## methods
toWallet: jump to wallet page
toAccount: jump to account page
```
<template>
<kyHeader @openNetwork="openNetwork"></kyHeader>
</template>
import kyHeader from '@/components/header'
export default {
    components:{
        kyHeader
    },
    methods:{
        openNetwork(){

        }
    }
}
```

