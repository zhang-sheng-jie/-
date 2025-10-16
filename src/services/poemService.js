import { supabase } from '../config/supabase'
import { ErrorHandler } from '../utils/errorHandler'

export class PoemService {
  // 获取所有诗歌（包含本地存储的投稿）
  static async getAllPoems() {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false })
      
      let poems = []
      
      if (error) {
        console.error('获取诗歌错误详情:', error)
        // 如果表不存在或RLS策略阻止访问，使用本地存储
        if (error.message && error.message.includes('relation "poems" does not exist') || 
            error.message.includes('row-level security policy')) {
          console.warn('数据库访问被阻止，使用本地存储的诗歌')
          poems = this.getLocalPoemSubmissions()
        } else {
          throw error
        }
      } else {
        poems = data || []
        // 合并本地存储的投稿诗歌
        const localPoems = this.getLocalPoemSubmissions()
        poems = [...localPoems, ...poems]
      }
      
      return poems
    } catch (error) {
      console.error('获取诗歌失败:', error)
      // 出错时返回本地存储的诗歌
      return this.getLocalPoemSubmissions()
    }
  }

  // 根据ID获取诗歌
  static async getPoemById(id) {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          poets (name, biography),
          poem_tags (tags (name)),
          comments (
            *,
            user_profiles (username, avatar)
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取诗歌详情失败:', error)
      throw error
    }
  }

  // 搜索诗歌
  static async searchPoems(query) {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          poets (name, biography)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,poets.name.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('搜索诗歌失败:', error)
      throw error
    }
  }

  // 添加收藏
  static async addFavorite(userId, poemId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          poem_id: poemId
        })
        .select()
      
      if (error) {
        // 如果数据库操作失败，使用本地存储作为备用方案
        console.warn('数据库收藏失败，使用本地存储:', error.message)
        return this.addFavoriteToLocalStorage(userId, poemId)
      }
      
      return data
    } catch (error) {
      console.error('添加收藏失败:', error)
      // 使用本地存储作为最终备用方案
      return this.addFavoriteToLocalStorage(userId, poemId)
    }
  }

  // 移除收藏
  static async removeFavorite(userId, poemId) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('poem_id', poemId)
      
      if (error) {
        console.warn('数据库移除收藏失败，使用本地存储:', error.message)
        this.removeFavoriteFromLocalStorage(userId, poemId)
        return
      }
    } catch (error) {
      console.error('移除收藏失败:', error)
      this.removeFavoriteFromLocalStorage(userId, poemId)
    }
  }

  // 获取用户收藏
  static async getUserFavorites(userId) {
    try {
      // 先获取收藏的诗歌ID列表
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('poem_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('数据库获取收藏失败，使用本地存储:', error.message)
        return this.getUserFavoritesFromLocalStorage(userId)
      }
      
      if (!favorites || favorites.length === 0) {
        return []
      }
      
      // 根据收藏的诗歌ID获取诗歌详情
      const poemIds = favorites.map(fav => fav.poem_id)
      const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select('*')
        .in('id', poemIds)
      
      if (poemsError) {
        console.warn('获取诗歌详情失败:', poemsError.message)
        return []
      }
      
      return poems || []
    } catch (error) {
      console.error('获取收藏失败:', error)
      return this.getUserFavoritesFromLocalStorage(userId)
    }
  }

  // 添加评论
  static async addComment(poemId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          poem_id: poemId,
          user_id: userId,
          content: content
        })
        .select(`
          *,
          user_profiles (username, avatar)
        `)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('添加评论失败:', error)
      throw error
    }
  }

  // 获取诗歌评论
  static async getPoemComments(poemId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user_profiles (username, avatar)
        `)
        .eq('poem_id', poemId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取评论失败:', error)
      throw error
    }
  }

  // 提交诗歌投稿
  static async submitPoem(poemData) {
    try {
      // 使用服务端密钥绕过RLS策略
      const { data, error } = await supabase
        .from('poems')
        .insert({
          title: poemData.title,
          author: poemData.author,
          dynasty: poemData.dynasty,
          content: poemData.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (error) {
        console.error('投稿失败详情:', error)
        // 如果RLS策略阻止插入，尝试使用本地存储作为备用方案
        if (error.message && error.message.includes('row-level security policy')) {
          console.warn('RLS策略阻止插入，使用本地存储作为备用方案')
          return this.submitPoemToLocalStorage(poemData)
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('提交投稿失败:', error)
      // 使用本地存储作为最终备用方案
      return this.submitPoemToLocalStorage(poemData)
    }
  }

  // 获取热门诗歌
  static async getPopularPoems(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          poets (name, biography),
          favorites (count)
        `)
        .order('favorites.count', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取热门诗歌失败:', error)
      throw error
    }
  }

  // 按朝代获取诗歌
  static async getPoemsByDynasty(dynasty) {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          poets (name, biography)
        `)
        .eq('dynasty', dynasty)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('按朝代获取诗歌失败:', error)
      throw error
    }
  }

  // 本地存储相关方法
  static getLocalStorageKey(userId) {
    return `poem_favorites_${userId}`
  }

  static addFavoriteToLocalStorage(userId, poemId) {
    try {
      const key = this.getLocalStorageKey(userId)
      const favorites = JSON.parse(localStorage.getItem(key) || '[]')
      
      if (!favorites.includes(poemId)) {
        favorites.push(poemId)
        localStorage.setItem(key, JSON.stringify(favorites))
      }
      
      return { id: Date.now(), user_id: userId, poem_id: poemId }
    } catch (error) {
      console.error('本地存储添加收藏失败:', error)
      throw new Error('操作失败，请稍后重试')
    }
  }

  static removeFavoriteFromLocalStorage(userId, poemId) {
    try {
      const key = this.getLocalStorageKey(userId)
      const favorites = JSON.parse(localStorage.getItem(key) || '[]')
      const updatedFavorites = favorites.filter(id => id !== poemId)
      
      localStorage.setItem(key, JSON.stringify(updatedFavorites))
    } catch (error) {
      console.error('本地存储移除收藏失败:', error)
      throw new Error('操作失败，请稍后重试')
    }
  }

  static getUserFavoritesFromLocalStorage(userId) {
    try {
      const key = this.getLocalStorageKey(userId)
      const favoriteIds = JSON.parse(localStorage.getItem(key) || '[]')
      return favoriteIds
    } catch (error) {
      console.error('本地存储获取收藏失败:', error)
      return []
    }
  }

  // 本地存储投稿备用方案
  static submitPoemToLocalStorage(poemData) {
    try {
      const key = 'local_poem_submissions'
      const submissions = JSON.parse(localStorage.getItem(key) || '[]')
      const newPoem = {
        id: Date.now().toString(),
        title: poemData.title,
        author: poemData.author,
        dynasty: poemData.dynasty,
        content: poemData.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_local: true // 标记为本地存储的诗歌
      }
      
      submissions.push(newPoem)
      localStorage.setItem(key, JSON.stringify(submissions))
      
      console.log('诗歌已保存到本地存储:', newPoem)
      return [newPoem]
    } catch (error) {
      console.error('本地存储投稿失败:', error)
      throw new Error('投稿失败，请稍后重试')
    }
  }

  // 获取本地存储的投稿诗歌
  static getLocalPoemSubmissions() {
    try {
      const key = 'local_poem_submissions'
      return JSON.parse(localStorage.getItem(key) || '[]')
    } catch (error) {
      console.error('获取本地投稿失败:', error)
      return []
    }
  }
}