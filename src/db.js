let filecoinwalletDb = new Dexie("filecoinwallet");

filecoinwalletDb.version(2).stores({
    messageList: 'id++,signed_cid,from,to,nonce,kunyao,create_time,block_time,type,value',
    accountList: 'id++,address,accountName,type,walletType,createType,default,privateKey,fil,kunyao,create_time,mnemonicWords,digest,readonly',
    activeAccount:'address,accountName,privateKey,create_time,kunyao,fil,mnemonicWords,digest',
    addressBook:'id++,address,name,create_time,kunyao',
    addressRecordLast:'id++,address,create_time,kunyao',
    lockUser:'address,privateKey,create_time,kunyao,digest',
    
});
window.filecoinwalletDb = filecoinwalletDb

window.localStorage.setItem('filecoinWalletVersion','1.0.0')