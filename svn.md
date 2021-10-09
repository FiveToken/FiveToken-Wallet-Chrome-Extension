├── README.md  # Project introduction  
├── babel.config.js # javascript compiler    
├── .eslintrc.js # javascript code inspection tool   
├── .gitignore # commit ignored file configuration   
├── .babelrc # configure transcoding rules and plug-ins   
├── dist # packaged files    
├── package-lock.json  #version used to lock dependency     
├── package.json  # configuration files for npm    
├── public    
│   └── index.html # packaged template file    
├── src  # project source code    
│   ├── background.js  # JavaScript in the background that can call almost all Chrome extension APIs    
│   ├── page-script.js  # JS injected into the page
│   ├── popup.js  #popupa window page popping up when clicking browser_action & page_action; popup.js can access most APIs 
│   ├── api.js  # api packaging    
│   ├── assets   # static resources    
│   ├── components  # global UI components    
│   │   ├── back # components of return    
│   │   ├── button  # button components    
│   │   ├── canvas  # components of token canvas    
│   │   ├── header  # header components     
│   │   ├── input  # components of input boxes    
│   │   └── layout # components of layout templates    
│   ├── fil-api.js # API to link FiveToken to Filecoin network     
│   ├── i18n  # configuration about multilingual plug-ins   
│   ├── lang  # multiple languages     
│   ├── manifest.development.json  # plugins to configure development environment    
│   ├── manifest.production.json  #  plugin-related to configure production environment     
│   ├── pages  # pages    
│   │   ├── account  # individual account page   
│   │   ├── add-token # add token page   
│   │   ├── check-words # check mneonmic words   
│   │   ├── create-wallet  # create a wallet   
│   │   ├── create-words # create mneonmic words    
│   │   ├── fiveToken # initialize the page, check page status   
│   │   ├── fiveToken-connect # page to link FiveToken to DApps    
│   │   ├── import-privatekey # page of importing private key    
│   │   ├── import-words  # page of importing mneomic words    
│   │   ├── lock-user # page of locking the user   
│   │   ├── message-detail # page of detailed messages    
│   │   ├── send-fil # page about sending messages    
│   │   ├── setting # page about setting    
│   │   ├── setting-about # About Us   
│   │   ├── setting-address # address setting and management     
│   │   ├── setting-backups # pages of back-ups     
│   │   ├── setting-networks # network management     
│   │   ├── wallet # wallet pages  
│   │   └──  welcome # welcome page     
│   ├── router  # route     
│   ├── store  # state management      
│   └── utils  # a set of helpful functions     
├── tests  # unit testing    
└── vue.config.js  # packaged configuration files     
