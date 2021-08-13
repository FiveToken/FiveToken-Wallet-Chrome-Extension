let connectOrigin = '';
let web3File = null;
let web3Info = null;
let web3Options = null;
let web3Address = '';
let web3Rpc = ''
let web3AccountName = ''

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   
    if(request.method === 'openFilecoinWallet'){
        chrome.windows.getCurrent({}, function (event) {
            connectOrigin = request.params.origin
            chrome.windows.create({
                url: 'pages/filecoinwallet-connect.html',
                width: 360,
                height: 600,
                left: event.left + request.params.width - 360,
                top: event.top,
                type: 'popup'
            }, function () { 
                
            })
        })
    }
    if(request.method === 'closeWindow'){
        backgroundWindowRemove()
    }
    if(request.method === 'uploadWeb3Stroage'){
        chrome.windows.getCurrent({}, function (event) {
            web3File = request.params.file
            web3Options = request.params.option
            web3Info = request.params.info
            connectOrigin = request.params.origin
            web3AccountName =  request.params.accountName
            chrome.windows.create({
                url: 'pages/update-web3.html',
                width: 360,
                height: 600,
                left:event.left + request.params.width - 360,
                top: 20,
                type: 'popup'
            }, function () { 
                
            })
        })
    }

    if(request.method === 'getWeb3StorageData'){
        chrome.windows.getCurrent({}, function (event) {
            web3Address = request.params.address
            web3Rpc = request.params.rpc
            connectOrigin = request.params.origin
            web3AccountName =  request.params.accountName
            chrome.windows.create({
                url: 'pages/get-web3.html',
                width: 360,
                height: 600,
                left: event.left + request.params.width - 360,
                top: 20,
                type: 'popup'
            }, function () { 
                
            })
        })
    }

    sendResponse('')
});

function backgroundReturnValue(key){
    switch(key){
        case "origin":
            return connectOrigin
            break;
        case "uploadWeb3":
            return {
                file:web3File,
                info:web3Info,
                option:web3Options,
                connectOrigin,
                accountName:web3AccountName
            }
            break;
        case "getWeb3":
            return {
                address:web3Address,
                rpc:web3Rpc,
                connectOrigin,
                accountName:web3AccountName
            }
            break;

    }
}

function backgroundWindowRemove(){
    chrome.windows.getCurrent({}, function (event) {
        chrome.windows.remove(event.id)
    })
}

function backgroundSendMessage(tag, data, cb){
    chrome.tabs.query({active:true}, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {
            tag: tag,
            data: data
        }, function(res) {
            if(cb){
                cb(res);
            }
        });
    });
   
}