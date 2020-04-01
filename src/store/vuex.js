import Vue from 'vue';
import Vuex from 'vuex';
import image1 from '@/pages/image/image1.jpeg';
import image2 from '@/pages/image/image2.jpg';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    canvasMesObjs: {
      userId: '1111',
      activityIdex: 0,
      imageArr: [
        image1,image2
      ],
      rotateAngle: 0
    },
    // canvas文字字体样式数据
    fontObj: {
      type: 'add', // type:edit,编辑；type:add;新增
      fontWeight: '',
      fontStyle: '',
      underline: '',
      fontSize: '36',
      fill: '#F80000',
      bgColor: '#ffffff',
      content: ''
    }
  },
  mutations: {
    // 改变activityIdex
    activityIdex (state, mes) {
      state.canvasMesObjs.activityIdex = mes;
    },
    // 改变arr 中的元素
    canvasMesObjsArr (state, mes) {
      state.canvasMesObjs.imageArr.splice(mes.index, 1, mes.url)
    },
    // 拼图后将arr 保存为一个数组
    canvasMesObjsArrOne (state, mes) {
      state.canvasMesObjs.imageArr = mes;
    },
    // 改变角度
    canvasMesObjsRotateAngle(state, mes) {
      state.canvasMesObjs.rotateAngle = mes
    },
    // canvas文字字体样式数据
    fontObj (state, mes) {
      state.fontObj = mes;
    }
  },
  actions: {
    activityIdex ({commit}, mes) {
      commit('activityIdex', mes);
    },
    canvasMesObjsArr ({commit}, mes) {
      commit('canvasMesObjsArr', mes);
    },
    // 拼图后将arr 保存为一个数组
    canvasMesObjsArrOne ({commit}, mes) {
      commit('canvasMesObjsArrOne', mes);
    },
    // 改变角度
    canvasMesObjsRotateAngle({ commit }, mes) {
      commit('canvasMesObjsRotateAngle', mes)
    },
    // canvas文字字体样式数据
    fontObj ({commit}, mes) {
      commit('fontObj', mes);
    }
  }
});
export default store;
