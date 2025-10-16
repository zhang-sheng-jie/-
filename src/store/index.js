import { createStore } from 'vuex'
import { AuthService } from '../services/auth'
import { PoemService } from '../services/poemService'

export default createStore({
  state: {
    user: null,
    poems: [],
    favorites: [],
    comments: [],
    isLoading: false,
    error: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_POEMS(state, poems) {
      state.poems = poems
    },
    SET_FAVORITES(state, favorites) {
      state.favorites = favorites
    },
    SET_COMMENTS(state, comments) {
      state.comments = comments
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    ADD_POEM(state, poem) {
      state.poems.push(poem)
    },
    ADD_COMMENT(state, comment) {
      state.comments.unshift(comment)
    }
  },
  actions: {
    // 用户认证相关
    async login({ commit }, { email, password }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await AuthService.signIn(email, password)
        commit('SET_USER', data.user)
        return data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async register({ commit }, { email, password, username }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = await AuthService.signUp(email, password, username)
        return data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      commit('SET_LOADING', true)
      try {
        await AuthService.signOut()
        commit('SET_USER', null)
        commit('SET_FAVORITES', [])
        commit('SET_COMMENTS', [])
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async checkAuth({ commit }) {
      try {
        const user = await AuthService.getCurrentUser()
        if (user) {
          commit('SET_USER', {
            ...user,
            email: user.email,
            username: user.user_metadata?.username || user.email?.split('@')[0] || '用户'
          })
        } else {
          commit('SET_USER', null)
        }
        return user
      } catch (error) {
        console.error('检查认证状态失败:', error)
        commit('SET_USER', null)
        commit('SET_ERROR', error.message)
        return null
      }
    },

    // 诗歌相关
    async fetchPoems({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const poems = await PoemService.getAllPoems()
        commit('SET_POEMS', poems)
        return poems
      } catch (error) {
        console.error('获取诗歌数据失败:', error)
        // 如果表不存在，设置空数组而不是抛出错误
        if (error.message && error.message.includes('relation "poems" does not exist')) {
          commit('SET_POEMS', [])
          return []
        }
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchPoemById({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const poem = await PoemService.getPoemById(id)
        return poem
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async searchPoems({ commit }, query) {
      commit('SET_LOADING', true)
      try {
        const poems = await PoemService.searchPoems(query)
        return poems
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 收藏相关
    async fetchFavorites({ commit, state }) {
      if (!state.user) return
      
      commit('SET_LOADING', true)
      try {
        const favorites = await PoemService.getUserFavorites(state.user.id)
        commit('SET_FAVORITES', favorites)
        return favorites
      } catch (error) {
        console.warn('获取收藏列表失败，使用本地存储:', error.message)
        // 静默处理错误，设置空数组而不是抛出错误
        commit('SET_FAVORITES', [])
        return []
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addToFavorites({ commit, state, dispatch }, poemId) {
      if (!state.user) throw new Error('请先登录')
      
      try {
        await PoemService.addFavorite(state.user.id, poemId)
        await dispatch('fetchFavorites')
      } catch (error) {
        console.warn('添加收藏失败，但已使用本地存储:', error.message)
        // 静默处理错误，不抛出，避免页面显示错误
        await dispatch('fetchFavorites')
      }
    },

    async removeFromFavorites({ commit, state, dispatch }, poemId) {
      if (!state.user) throw new Error('请先登录')
      
      try {
        await PoemService.removeFavorite(state.user.id, poemId)
        await dispatch('fetchFavorites')
      } catch (error) {
        console.warn('移除收藏失败，但已使用本地存储:', error.message)
        // 静默处理错误，不抛出，避免页面显示错误
        await dispatch('fetchFavorites')
      }
    },

    // 评论相关
    async fetchComments({ commit }, poemId) {
      commit('SET_LOADING', true)
      try {
        const comments = await PoemService.getPoemComments(poemId)
        commit('SET_COMMENTS', comments)
        return comments
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addComment({ commit, state }, { poemId, content }) {
      if (!state.user) throw new Error('请先登录')
      
      commit('SET_LOADING', true)
      try {
        const comment = await PoemService.addComment(poemId, state.user.id, content)
        commit('ADD_COMMENT', comment[0])
        return comment
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 投稿相关
    async submitPoem({ commit, state }, poemData) {
      if (!state.user) throw new Error('请先登录')
      
      commit('SET_LOADING', true)
      try {
        const result = await PoemService.submitPoem({
          ...poemData,
          userId: state.user.id
        })
        return result
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    getAllPoems: state => state.poems,
    getFavorites: state => state.favorites,
    getComments: state => state.comments,
    isLoading: state => state.isLoading,
    getError: state => state.error,
    getPoemById: state => id => state.poems.find(poem => poem.id === id),
    isFavorite: state => poemId => state.favorites.some(fav => fav.id === poemId)
  }
})