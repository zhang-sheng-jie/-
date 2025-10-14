import { createStore } from 'vuex'

export default createStore({
  state: {
    poems: [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        dynasty: '唐代'
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        dynasty: '唐代'
      },
      {
        id: 3,
        title: '登鹳雀楼',
        author: '王之涣',
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
        dynasty: '唐代'
      },
      {
        id: 4,
        title: '望庐山瀑布',
        author: '李白',
        content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
        dynasty: '唐代'
      },
      {
        id: 5,
        title: '相思',
        author: '王维',
        content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
        dynasty: '唐代'
      },
      {
        id: 6,
        title: '江雪',
        author: '柳宗元',
        content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
        dynasty: '唐代'
      },
      {
        id: 7,
        title: '悯农',
        author: '李绅',
        content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
        dynasty: '唐代'
      },
      {
        id: 8,
        title: '游子吟',
        author: '孟郊',
        content: '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。',
        dynasty: '唐代'
      },
      {
        id: 9,
        title: '水调歌头',
        author: '苏轼',
        content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。',
        dynasty: '宋代'
      },
      {
        id: 10,
        title: '声声慢',
        author: '李清照',
        content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。',
        dynasty: '宋代'
      },
      {
        id: 11,
        title: '青玉案·元夕',
        author: '辛弃疾',
        content: '东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。',
        dynasty: '宋代'
      },
      {
        id: 12,
        title: '天净沙·秋思',
        author: '马致远',
        content: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。',
        dynasty: '元代'
      }
    ],
    favorites: []
  },
  mutations: {
    ADD_TO_FAVORITES(state, poem) {
      if (!state.favorites.find(fav => fav.id === poem.id)) {
        state.favorites.push(poem)
      }
    },
    REMOVE_FROM_FAVORITES(state, poemId) {
      state.favorites = state.favorites.filter(fav => fav.id !== poemId)
    }
  },
  actions: {
    addToFavorites({ commit }, poem) {
      commit('ADD_TO_FAVORITES', poem)
    },
    removeFromFavorites({ commit }, poemId) {
      commit('REMOVE_FROM_FAVORITES', poemId)
    }
  },
  getters: {
    getAllPoems: state => state.poems,
    getFavorites: state => state.favorites,
    getPoemById: state => id => state.poems.find(poem => poem.id === id)
  }
})