import Dexie from 'dexie';
// Database inherits from the Dexie class to handle all database logic for the
// todo app.
// NOTE: For an app like this where the database interactions are pretty
// simple, it's not strictly necessary to subclass Dexie, but I personally
// prefer the subclassing pattern over having a global Dexie database class
// in order to structure all the database logic in a single class.
export class Database extends Dexie {
  constructor() {
    // run the super constructor Dexie(databaseName) to create the IndexedDB
    // database.
    super('database');
    // create the table store by passing an object into the stores method. We
    // declare which object fields we want to index using a comma-separated
    // string; the ++ for the index on the id field indicates that "id" is an
    // auto-incrementing primary key, while the "done" field is just a regukar
    // IndexedDB index.
    this.version(1).stores({
        messageList: 'id++,signed_cid,from,to,nonce,khazix,create_time,block_time,type,value,decimals,token,allGasFee,rpc',
        accountList: 'id++,address,accountName,createType,privateKey,fil,khazix,create_time,digest,isDelete,rpc',
        activeAccount:'id++,rpc,address,accountName,createType,privateKey,create_time,khazix,fil,digest',
        addressBook:'id++,address,accountName,create_time,khazix,rpc',
        addressRecordLast:'id++,address,create_time,khazix,rpc',
        lockUser:'id++,address,privateKey,create_time,khazix,digest,rpc',
        networks:'id++,rpc,image,create_time,name,chainID,symbol,browser,decimals,ids,khazix,networkType,filecoinAddress0,deriveIndex,disabled',
        activenNetworks:'id++,rpc,create_time,name,image,chainID,symbol,ids,browser,decimals,networkType,filecoinAddress0,deriveIndex,disabled,khazix',
        tokenList:'id++,rpc,create_time,chainName,decimals,symbol,contract,address,khazix',
        walletKey:'id++,create_time,mnemonicWords,salt,khazix,rpc',
        web3File:'id++,address,rpc,create_time,nickname,describe,cid,khazix'
    });
  }
  // retrieves all table from the table object store in a defined
  // order; order can be:
  // - forwardOrder to get the table in forward chronological order
  // - reverseOrder to get the table in reverse chronological order
  async getTable(key,option,order,sort) {
    let todos = [];
    switch (order) {
      case forwardOrder:
        todos = await this.table(key).where({ ...option }).sortBy(sort);
        break;
      case reverseOrder:
        todos = await this.table(key).where({ ...option }).reverse().sortBy(sort);
        break;
      default:
        // as a default just fall back to forward order
        todos = await this.table(key).where({ ...option }).toArray();
    }
    return todos
  }

  // add data in to the table[key] object store.
  // Returns a promise that resolves if the addition is successful.
  async addTable(key,data) {
    try{
      let create_time =  parseInt(new Date().getTime() / 1000)
      return await this.table(key).add({
        ...data,
        create_time
      })
    }catch(error){
      console.error('add DB error')
      return Promise.reject(error)
    }
  }

  async bulkAddTable(key,data){
    try{
      return await this.table(key).bulkAdd([
        ...data
      ])
    }catch(error){
      console.error('bulkAddTable DB error')
      return Promise.reject(error)
    }
  }

  async bulkPutTable(key,data){
    try{
      return await this.table(key).bulkPut([
        ...data
      ])
    }catch(error){
      console.error('bulkPutTable DB error')
      return Promise.reject(error)
    }
  }
  

  // modify matched data
  // Returns a promise that resolves if the modify is successful.
  async modifyTable(key, option,data) {
    try{
      return await this.table(key).where({
        ...option
      }).modify({
        ...data
      })
    }catch(error){
      console.error('modify DB error')
      return Promise.reject(error)
    }
  }

  // delete matched data
  // store. Returns a promise that resolves if the deletion is successful.
  async deleteTable(key,option) {
    try{
      return await this.table(key).where({
        ...option
      }).delete()
    }catch(error){
      console.error('delete DB error')
      return Promise.reject(error)
    }
  }

  // delete matched data
  // store. Returns a promise that resolves if the deletion is successful.
  async clearTable() {
    try{
      await this.table('messageList').where({khazix:'khazix'}).delete()
      await this.table('accountList').where({khazix:'khazix'}).delete()
      await this.table('activeAccount').where({khazix:'khazix'}).delete()
      await this.table('addressBook').where({khazix:'khazix'}).delete()
      await this.table('addressRecordLast').where({khazix:'khazix'}).delete()

      await this.table('lockUser').where({khazix:'khazix'}).delete()
      await this.table('networks').where({khazix:'khazix'}).delete()
      await this.table('activenNetworks').where({khazix:'khazix'}).delete()
      await this.table('tokenList').where({khazix:'khazix'}).delete()
      await this.table('walletKey').where({khazix:'khazix'}).delete()
      await this.table('web3File').where({khazix:'khazix'}).delete()
      return Promise.resolve()
    }catch(error){
      console.error('clear DB error')
      return Promise.reject(error)
    }
  }
  
}

// forwardOrder is passed into getTodos to retrieve todos in chronological
// order.
export const forwardOrder = 'forward';

// reverseOrder is passed into getTodos to retrieve todos in reverse
// chronological order.
export const reverseOrder = 'reverse';