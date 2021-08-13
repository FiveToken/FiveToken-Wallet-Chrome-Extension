const zh = {
  header:{
    myAccount:'My Account',
    lock:'Lock',
    createAccount:'Create an account',
    setting:'Seting',
    import:'Import an account'
  },
  welcome: {
    title:'Welcome to FiveToken',
    subTitle1:'Connecting you to Filecoin and the decentralized network.',
    subTitle2:"We're excited to meet you.",
    btn:'Getting Started'
  },
  firstWallet:{
    question:'Using FiveToken for the first time?',
    create:'Import an account',
    arr:[
      {
        icon:'el-icon-download',
        title:'No, I already have an account recovery phrase.',
        subTitle:'Import your existing wallet account using the 12-word recovery phrase.',
        btn:'Import Wallet',url:'./import-wallet.html?createType=words'
      },
      {
        icon:'el-icon-download',
        title:'No, I already have a private key.',
        subTitle:'Use the private key to import your existing wallet account.',
        btn:'Import Wallet',
        url:'./import-wallet.html?createType=key'
      },
      {
        icon:'el-icon-plus',
        title:'For the first time, start the setup immediately.',
        subTitle:'A new wallet account and recovery phrase will be created for you',
        btn:'Create Wallet',
        url:'./create-wallet.html?createType=create'
      },
    ]
  },
  importWallet:{
    back:'Back to',
    title:'Importing an account using the recovery phrase',
    keyTitle:'Importing an account using the private key',
    subTitle:'Enter a 12-word recovery phrase to restore your account.',
    mnemonicWords:'Recovery phrase',
    placeholder:'Paste the recovery phrase from the clipboard',
    showWords:'Show recovery phrase',
    password:'New password (at least 8 characters, including numbers, upper and lower case letters)',
    confirmPassword:'Confirm password',
    agree:'I have read and agree to',
    diffError:'Password is not the same',
    correctPassword:'Please enter the correct password',
    clause:'Terms of Use',
    btn:'Import',
    accountName:'Account name',
    privateKey:'Private key',
    importError:'Type not supported',
    exist:'Account already exists'
  },
  creatWallet:{
    accountName:'Account Name',
    back:'Back to',
    title:'Create Password',
    password:'New password (at least 8 characters, including numbers, upper and lower case letters)',
    diffError:'Password is not the same',
    correctPassword:'Please enter the correct password',
    confirmPassword:'Confirm Password',
    agree:'I have read and agree to',
    clause:'Terms of Use',
    btn:'Create'

  },
  creatWords:{
    title:'Recovery phrase',
    subTitle1:'Your recovery phrase can help you easily back up and restore your personal account.',
    subTitle2:'Warning: Do not disclose your recovery phrase to others. Once anyone has your recovery phrase, they can control your assets.',
    showWords:'Click here to show secret message',
    btn1:'Reminder later',
    btn2:' Next step',
    tips:'Tips:',
    tipsInfo:'Please record your recovery phrase on paper and keep it in a secure location. If you want to increase the security of your information, record it on multiple sheets of paper and keep it in 2-3 separate locations.Remember your recovery phrase.',
    rememberTips:''
  },
  checkWords:{
    title:'Please confirm your recovery phrase',
    subTitle:'Please select each word to ensure it is correct.',
    btn:'Confirm',
    checkError:'Incorrect recovery phrase order'
  },
  createSuccess:{
    title:'Congratulations!',
    subTitle:'You have successfully passed the test. It is your responsibility to keep your recovery phrase safe.',
    skill:'Tips for safe storage',
    skillArr:[
      'Keep backup data in multiple locations',
      "Don't share the recovery phrase with anyone",
      "Beware of phishing, FiveToken will never ask you for your personal account details",
      "If you need to back up your account helper again, please do so via Settings > Security Options."
    ],
    warn:'FiveToken cannot restore your recovery phrase.',
    btn:' All done'
  },
  wallet:{
    receive:'Receive',
    send:'Send',
    tab:[
      {name:'Assets',type:'1'},
      {name:'Activity',type:'2'}
    ],
    title:'Show Private Key',
    label:'Enter your FiveToken password',
    exportBtn:'Export the private key',
    lookBtn:'View on Filscan (Filecoin Browser)',
    cancel:'Cancel',
    confirm:'Confirm',
    tips:'Note: Never make this private key public. Anyone who has your private key can steal any asset in your account.',
    copy:'Here is your private key (click to copy)',
    finish:'Done',
    sendFil:'Send FIL',
    detail:'Details',
    from:'From',
    to:'To',
    transaction:'Transactions',
    nonce:'Nonce',
    amount:'Amount',
    networkServiceCharge:'Network Gas Fee',
    totalAmount:'Total Amount',
    activityLog:'Activity Log',
    transCreated:'Transactions created',
    transConfirmed:'Transactions Confirmed',
    transAmount:'Transaction amount',
    passwordError:'Incorrect password',
    receivedSuccess:'Received',
    receivedError:'Receiving failed',
    copySuccess:'Copied successfully',
    viewMore:'Load more',
    sendSuccess:'Sent',
    sendError:'Failed',
    noTransactionRecord:'No transaction record',
    waiting:'Waiting',
    copyAddress:'Copy Address',
    copyPrivateKey:'Copy Private Key',
    copyCid:'Copy Transaction ID',
    today:'Today',
    connected:'Connected',
    linkTips:'View in Filscan'
  },
  sendFil:{
    waiting:'Waiting',
    sendFil:'Send FIL',
    fast:'Fast',
    normal:"Normal",
    custom:'Customize',
    reset:'Reset',
    edit:'Edit',
    password:'Password verification',
    sendFil:'Send FIL',
    cancel:'Cancel',
    confirm:'Confirm',
    next:'Next step',
    error:'Incorrect password',
    cost:'Transaction fee',
    amount:'Amount',
    balance:'Balance',
    addReveice:'Add Recipient',
    invalidReceiverAddress:'Recipient address is invalid',
    property:'Assets',
    addToaddress:'Monitor for new addresses! Click to add to address book.',
    customFuel:'Customize Fuel',
    senior:'Advanced',
    minerFees:'Miner Fees',
    sendAmount:'Send Amount',
    transFees:'Transaction fee',
    newTotal:'New Total',
    save:'Save',
    inMyAccount:'Transfer between my accounts',
    lastRecord:'Recent records',
    addressBook:'Address Book',
    backAll:'Back to all',
    myAccount:'My Account',
    insufficientBalance:'Insufficient balance'
  },
  setting:{
    name:'Setting',
    menu:[
      {name:'General',url:'./setting-currency.html'},
      {name:'Address Book',url:'./setting-address.html'},
      {name:'Backups',url:'./setting-backups.html'},
      {name:'About',url:'./setting-about.html'},
   ]
  },
  settingAbout:{
    about:'About',
    filVersion:'FiveToken Version',
    version:'1.0.0',
    tips:'FiveToken designed and developed by Singapore team',
    links:'Links',
    privacy:'Privacy Policy',
    useRule:'Terms of Use'
  },
  settingBackups:{
    backups:'Backups',
    showWords:'Show recovery phrase',
    accountWords:'Recovery phrase',
    tips:'If you change browsers or computers, you will need to use your recovery phrase to access your account. Please keep your recovery phrase in a safe and secret place.',
    warning:'Do not show this account helper to anyone!',
    warningTips:'The account recovery phrase can be used to access all your accounts',
    inputPassword:'Enter your password to continue',
    cancel:'cancel',
    next:'Next step',
    yourWords:'Your account recovery phrase',
    copy:'Copy to clipboard',
    saveCsv:'Save as CSV file',
    close:'Close',
    passwordError:'Incorrect password',
    copySuccess:'Copied successfully'
  },
  settingCurrency:{
    currencyConversion:'Token transfer',
    currency:'General',
    back:"Back to",
    currentLanguage:'Current Language',
    deleteAccount:'Delete Account',
    language:'zh',
    currencyArr:[
      {label:'USD',value:'usd'}
    ],
    languageList:[
      
      {langName:'English',lang:'en'},
      {langName:'한국어',lang:'ko'},
      {langName:'日本語',lang:'ja'},
      {langName:'中文',lang:'zh'}
    ],
    deleteTips:'Confirm to delete this account?',
    deleteTitle:'Delete account',
    cancel:'cancel',
    confirm:'confirm'
  },
  settingAddress:{
    name:'Name',
    filAddress:'FiveToken Address',
    ethereumAddress:'Ethereum Public Address',
    addressError:'Address format error',
    edit:'Edit',
    address:'Addresses',
    cancel:'cancel',
    confirm:'confirm',
    placeholder:"Find FiveToken address, f0/f1/f2/f3 address",
    addAddress:'Add Address',
    addressDetail:'Address details',
    editAddress:'Edit Address',
    copySuccess:'Copied successfully',
    editSuccess:'Edit successfully',
    addressBook:'address book',
    myWallet:'My Account Wallet',
    autoAdd:'All created FiveToken accounts will be automatically added to this section',
    lastRecord:'Recent record',
    add:'Add'
  },
  lock:{
    welcomeBack:'Welcome back!',
    enterNetwork:'Coming soon to the decentralized network',
    unlocking:'Unlock',
    passwordError:'Incorrect password',
    selectAccount:'Please select unlock account',
    inputPassword:'Please enter your account password'
  },
  connect:{
    title:'Connect using FiveToken',
    cancel:'Cancel',
    connect:'Connect'
  }
}
export default zh
