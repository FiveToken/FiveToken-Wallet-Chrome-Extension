export const mocksData = {
  networks: [
    {
      name: 'Filcoin Mainnet',
      rpc: 'https://api.fivetoken.io',
      chainID: '',
      symbol: 'FIL',
      ids: 'filecoin',
      browser: 'https://filscan.io',
      networkType: 'proxy',
      filecoinAddress0: 'f',
      decimals: 18,
      disabled: true,
      image: 'fil.svg',
      deriveIndex: 0
    },
    {
      name: 'Filecoin Calibration Testnet',
      rpc: 'https://api.calibration.fivetoken.io',
      chainID: '',
      symbol: 'FIL',
      ids: 'filecoin',
      browser: 'https://calibration.filscan.io',
      networkType: 'proxy',
      filecoinAddress0: 't',
      decimals: 18,
      disabled: true,
      image: 'fil.svg',
      deriveIndex: 0
    },
    {
      name: 'Binance TEST',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainID: '56',
      symbol: 'BNB',
      ids: 'binancecoin',
      browser: 'https://testnet.bscscan.com',
      networkType: 'ethereum',
      filecoinAddress0: '',
      decimals: 18,
      image: 'bnb.svg',
      disabled: true,
      deriveIndex: 0
    }
  ],
  activeNetwork: {
    name: 'Filcoin Mainnet',
    rpc: 'https://api.fivetoken.io',
    chainID: '',
    symbol: 'FIL',
    ids: 'filecoin',
    browser: 'https://filscan.io',
    networkType: 'proxy',
    filecoinAddress0: 'f',
    decimals: 18,
    disabled: true,
    image: 'fil.svg',
    deriveIndex: 0
  },
  accountList: [
    {
      accountName: 'Account1',
      address: 'f1q7j4pbjgfrm3jw5ct63z6kmve5u2dq4lnlm5ipi',
      createType: 'mnemonic',
      fil: 0,
      privateKey: '',
      rpc: 'https://api.fivetoken.io'
    }
  ],
  activeAccount: {
    accountName: 'Account1',
    address: 'f1q7j4pbjgfrm3jw5ct63z6kmve5u2dq4lnlm5ipi',
    createType: 'mnemonic',
    fil: 0,
    privateKey: '',
    rpc: 'https://api.fivetoken.io'
  }
}
