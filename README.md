# install dependencies
$ npm install

# serve with hot reload
$ npm run build-watch

# build for production
$ npm run build


# FiveToken Chrome Extension
FiveToken Chrome Extension, to provide professional transaction service for Filecoin storage providers and to bridge Filecoin ecosystem to Web 3 metaverse with reliable ID management via website service.

# Introduction of  product

The future of Filecoin ecosystem and Web3 network are highly expected especially when the related applications are booming because it means Filecoin network has converted the data value from storing to flowing. But from the perspective of Token Infrastructure, Filecoin ecosystem is lacking a product that can both offer professional token service for miners and help Filecoin to expand its awareness to the big blockchain world and the broader communities. Web 3 is lacking a decentralized and comprehensive payment app like PayPal.

FiveToken targets to solve the problems via developing cross-chain payment protocol, designing interlayer that supports RPC network and realizing the closed loop of transaction, payment and reputation system. We want to support more than Filecoin and also have features more than a wallet, to help expand the application scenario of Filecoin and to proactively be a systematic DApp in Web 3 network. The system can be divided into 3 components:

- Payment: 

  multi-chain mode/protocol can support Filecoin to link to other blockchains to build a seamless interoperability from Filecoin network to the web 3 metaverse.

- Identity:

  1. To enforce the capability of information management via all individual identity accounts and data communication across varied blockchains;
  2. To enhance the connection of the decentralized network to the identity in the real world to support all potential applications on Filecoin applied to the real world;

- Reputation system:
  1. To support Filecoin network to more decentralized DApps and help its application in the real world;
  2. To enhance the management (eps. self management) of decentralized individual identity. It can help utilize the reputation system in the real world to the decentralized network;

# Dependencies
Node.js version 12+

# How to run
### Project setup 

```npm install```

### Development

1.```npm run build-watch```

2. Google Chrome > More tools > Add extension > Developer Tools

3. Load the decompressed extension and select dist folder in the project

### Compiles and minifies for production
```npm run build```

# How to use
## Install FiveToken Chrome Extension

### Method 1：Chrome Extension Store

Visit page of FiveToken in Chrome Extension Store, add to Chrome browser.

[Download Chrome Extension Store-FiveToken](https://chrome.google.com/webstore/detail/fivetoken/mbffiajjodnaglhnplbgmhcbjfiimeol)

### Method 1：Extension Package

#### Download Extension Package

Visit the FiveToken Chrome Extension library of FiveToken project in Github, download and unzip it into a folder.

[Download](https://github.com/FiveToken/FiveToken-Wallet-Chrome-Extension/releases)

Check [FiveToken Documentation](https://docs.fivetoken.io/userguide/filecoinchrome.html#install-fivetoken-chrome-extension) for more details

# Browsers support
Chrome (last 2 versions)

# License
[MIT](https://github.com/FiveToken/FiveToken-Wallet-Chrome-Extension/blob/master/LICENSE)




# FiveToken API
Welcome to use the developer documentation for FiveToken. This document is intended for browsers with the Chrome FiveToken Extension plug-in installed.
The whole Window.dapplink API is injected into the websites that the users visit. The API allows websites to request the user's plug-in wallet account, read numbers from the blockchain that the user is connected to, sign messages and trade from the user.

### DAppLink.version
Plug-in Version Number

### DAppLink.isConnected()
Returning true indicates that the API has been injected into the current site. If the injection fails, the page must be reloaded before the connection can be re-established.

### DAppLink.request(args)
Example:
```js
args :{
  method: string;
  params: object;
}
DAppLink.request({
    // open chrome plugins
    method: "openFilecoinWallet",
    params:{
        // window width
        width:window.outerWidth,
        // origin
        origin:'https://filscan.io'
    }
})
```

### DAppLink.onMessage(tag,callback)
tag

|  filecoinWalletAddress   | scriptUpdateWeb3Storage  | scriptWeb3Storage |
|  ----  | ----  | ----  | 
| Listen to the result of connection address and return to the connection address  | Listen to the result of data storage and return to CID | Listen to the result of accessing address information and return to the storage information of the address |

data

Return data

Example:
``` js
// tag: string;
// callback:Funtion;
window.AppLink.onMessage('filecoinWalletAddress',(data)=>{
    console.log(data)
})
```