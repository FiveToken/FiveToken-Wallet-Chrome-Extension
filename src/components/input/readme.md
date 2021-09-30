# input compontent

## props
value: [String, Number],input value
error: Boolean, Whether to report an error
suffix: Boolean,When type="password", whether to display password is visible

# methods
toggleEyes: Switch password display in plain text or cipher text
# emit
changeInput: Callback function when input changes

```
<template>
<kyInput 
    :value="value" 
    :error="error" 
    :suffix="suffix" 
    @changeInput="changeInput"
    @changeEye="changeEye"
></kyInput>
</template>
import kyInput from '@/components/input'
export default {
    data(){
        return {
            value:'',
            error:false,
            suffix:true,
        }
    },
    components:{
        kyBack
    },
    methods:{
        changeEye(){

        },
        changeInput(){

        }
    }
}
```

