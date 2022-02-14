# canvas compontent
Generate icon from contract address

## props
contract: String, contract address 

```
<template>
<kyCanvas :contract="">{{name}}</kyCanvas>
</template>
import kyCanvas from '@/components/token-icon'
export default {
    data(){
        return {
            contract:'0xdd42bcecbe746e8f9415138ef01a4d16d1553df8',
        }
    },
    components:{
        kyBack
    },
    methods:{
        btnClick(){

        }
    }
}
```

