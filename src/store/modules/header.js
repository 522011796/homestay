const state = {          // 组件间共享的数据
  topMenu: '',
  leftFirstMenu:''
}

const mutations = {      // 修改共享数据
  setTopMenu: (state, value) => {
    state.topMenu = value
  },
  setLeftFirstMenu: (state, value) => {
    state.leftFirstMenu = value
  }
}

const getters = {        // 获取共享数据
  getTopMenu: state => {
    return state.topMenu
  },
  getLeftFirstMenu: state => {
    return state.leftFirstMenu
  }
}

export default {
  getters,
  state,
  mutations
}
