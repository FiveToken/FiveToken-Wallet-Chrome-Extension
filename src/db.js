let filecoinwalletDb = new Dexie("filecoinwallet");

filecoinwalletDb.version(2).stores({
    messageList: 'id++,signed_cid,from,to,nonce,khazix,create_time,block_time,type,value,decimals,token,allGasFee,rpc',
    accountList: 'id++,address,accountName,createType,privateKey,fil,khazix,create_time,digest,rpc',
    activeAccount:'id++,rpc,address,accountName,createType,privateKey,create_time,khazix,fil,digest',
    addressBook:'id++,address,accountName,create_time,khazix,rpc',
    addressRecordLast:'id++,address,create_time,khazix,rpc',
    lockUser:'id++,address,privateKey,create_time,khazix,digest,rpc',
    networks:'id++,rpc,create_time,name,chainID,symbol,browser,decimals,ids,khazix,networkType,filecoinAddress0,disabled',
    activenNetworks:'id++,rpc,name,chainID,symbol,ids,browser,decimals,networkType,filecoinAddress0,khazix',
    tokenList:'id++,rpc,chainName,decimals,symbol,contract,address,khazix',
    walletKey:'id++,mnemonicWords,password,khazix,rpc',
    web3File:'id++,address,rpc,create_time,nickname,describe,cid,khazix'

});
window.filecoinwalletDb = filecoinwalletDb
window.localStorage.setItem('filecoinWalletVersion','1.0.0')

window.filecoinwalletDb.networks.where({ khazix:'khazix'}).toArray().then(res=>{
    if(!res.length){
        let create_time =  parseInt(new Date().getTime() / 1000)
        let defaultNetworks = [
            {
                name:'Filcoin Mainnet',
                rpc:'https://api.filscan.io:8083',
                chainID:'',
                symbol:'FIL',
                ids:'filecoin',
                browser:'https://filscan.io',
                khazix:'khazix',
                create_time:create_time,
                networkType:'proxy',
                filecoinAddress0:'f',
                decimals:18,
                disabled:true
            },
            // {
            //     name:'Filcoin TEST',
            //     rpc:'https://1w1cJziPEPGNpMlwFjxyj8f7dhd:87323bed6d5a3aa3eb3cbd7ee1d28407@filecoin.infura.io',
            //     chainID:'',
            //     symbol:'FIL TEST',
            //     ids:'filecoin',
            //     browser:'https://filscan.io',
            //     khazix:'khazix',
            //     create_time:create_time,
            //     networkType:'filecoin',
            //     filecoinAddress0:'f',
            //     decimals:18,
            //     disabled:true
            // },
            {
                name:'Calibration Testnet',
                rpc:'https://calibration.node.glif.io',
                chainID:'',
                symbol:'FIL',
                ids:'filecoin',
                browser:'https://calibration.filscan.io/',
                khazix:'khazix',
                networkType:'filecoin',
                filecoinAddress0:'t',
                create_time:create_time+1,
                decimals:18,
                disabled:true
            },
            {
                name:'Binance Smart Chain',
                rpc:'https://bsc-dataseed.binance.org',
                chainID:'56',
                symbol:'BNB',
                ids:'binancecoin',
                browser:'https://bscscan.com',
                khazix:'khazix',
                networkType:'ethereum',
                filecoinAddress0:'',
                create_time:create_time+2,
                decimals:18,
                disabled:true
            },
            {
                name:'Ethereum Mainnet',
                rpc:'https://mainnet.infura.io/v3/96837d28a772466ca6ed88eddb221e09',
                chainID:'1',
                symbol:'ETH',
                browser:'https://etherscan.io',
                ids:'ethereum',
                khazix:'khazix',
                networkType:'ethereum',
                filecoinAddress0:'',
                create_time:create_time+3,
                decimals:18,
                disabled:true
            },
            {
                name:'Binance TEST',
                rpc:'https://data-seed-prebsc-1-s1.binance.org:8545',
                chainID:'56',
                symbol:'BNB',
                ids:'binancecoin',
                browser:'https://testnet.bscscan.com',
                khazix:'khazix',
                networkType:'ethereum',
                filecoinAddress0:'',
                create_time:create_time+4,
                decimals:18,
                disabled:true
            },
        ]
        window.filecoinwalletDb.networks.bulkPut(defaultNetworks)
    }
})
window.filecoinwalletDb.activenNetworks.where({ khazix:'khazix'}).toArray().then(res=>{
    if(!res.length){
        window.filecoinwalletDb.activenNetworks.add({
            name:'Filcoin Mainnet',
            rpc:'https://api.filscan.io:8083',
            chainID:'',
            symbol:'FIL',
            ids:'filecoin',
            browser:'https://filscan.io',
            networkType:'proxy',
            filecoinAddress0:'f',
            decimals:18,
            khazix:'khazix'
        })
    }
})



