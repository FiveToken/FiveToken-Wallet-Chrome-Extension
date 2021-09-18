
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const mergemModules = () => {
  const modulesFiles = require.context('./modules', true, /\.js$/)
  return modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
  }, {})
}

const modules = mergemModules()
const store = new Vuex.Store({
  modules
})

export default store
