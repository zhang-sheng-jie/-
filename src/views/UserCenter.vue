<template>
  <div class="user-center">
    <!-- 用户信息头部 -->
    <section class="user-header">
      <div class="header-content">
        <div class="user-avatar">
          <div class="avatar-placeholder">👤</div>
        </div>
        <div class="user-info">
          <h1 class="user-name">{{ userName }}</h1>
          <p class="user-email">{{ userEmail }}</p>
          <p class="user-stats">已收藏 {{ favorites.length }} 首诗歌</p>
        </div>
      </div>
    </section>

    <!-- 功能导航 -->
    <section class="user-nav">
      <div class="nav-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="nav-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
        </button>
      </div>
    </section>

    <!-- 内容区域 -->
    <section class="user-content">
      <div class="content-container">
        <!-- 收藏页面 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h2 class="tab-title">我的收藏</h2>
          <div v-if="favorites.length === 0" class="empty-state">
            <div class="empty-icon">⭐</div>
            <h3>暂无收藏</h3>
            <p>去诗歌库发现你喜欢的诗歌吧</p>
            <button class="explore-btn" @click="$router.push('/poems')">探索诗歌</button>
          </div>
          <div v-else class="favorites-grid">
            <div 
              v-for="poem in favorites" 
              :key="poem.id" 
              class="favorite-card"
              @click="viewPoem(poem)"
            >
              <div class="poem-badge">{{ poem.dynasty }}</div>
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.author }}</p>
              <p class="poem-preview">{{ poem.content }}</p>
              <div class="card-actions">
                <button class="action-btn remove" @click.stop="removeFavorite(poem)">
                  ❌ 移除
                </button>
                <button class="action-btn view" @click.stop="viewPoem(poem)">
                  📖 阅读
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 评论页面 -->
        <div v-if="activeTab === 'comments'" class="tab-content">
          <h2 class="tab-title">我的评论</h2>
          <div class="comments-section">
            <div class="comment-input">
              <textarea 
                v-model="newComment" 
                placeholder="分享你对诗歌的感悟..."
                class="comment-textarea"
                rows="3"
              ></textarea>
              <button class="submit-comment" @click="submitComment">发表评论</button>
            </div>
            
            <div v-if="comments.length === 0" class="empty-state">
              <div class="empty-icon">💬</div>
              <h3>暂无评论</h3>
              <p>分享你的诗歌感悟，与其他爱好者交流</p>
            </div>
            
            <div v-else class="comments-list">
              <div 
                v-for="comment in userComments" 
                :key="comment.id" 
                class="comment-item"
              >
                <div class="comment-header">
                  <span class="comment-poem">{{ comment.poemTitle }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
                <div class="comment-actions">
                  <button class="action-btn edit" @click="editComment(comment)">编辑</button>
                  <button class="action-btn delete" @click="deleteComment(comment.id)">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 投稿页面 -->
        <div v-if="activeTab === 'contribute'" class="tab-content">
          <h2 class="tab-title">诗歌投稿</h2>
          <div class="contribute-form">
            <div class="form-group">
              <label for="poem-title">诗歌标题</label>
              <input 
                id="poem-title"
                v-model="contributeForm.title" 
                type="text" 
                placeholder="请输入诗歌标题"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="poem-author">作者</label>
              <input 
                id="poem-author"
                v-model="contributeForm.author" 
                type="text" 
                placeholder="请输入作者姓名"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="poem-dynasty">朝代</label>
              <select 
                id="poem-dynasty"
                v-model="contributeForm.dynasty" 
                class="form-select"
              >
                <option value="">选择朝代</option>
                <option value="唐代">唐代</option>
                <option value="宋代">宋代</option>
                <option value="元代">元代</option>
                <option value="明代">明代</option>
                <option value="清代">清代</option>
                <option value="现代">现代</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="poem-content">诗歌内容</label>
              <textarea 
                id="poem-content"
                v-model="contributeForm.content" 
                placeholder="请输入诗歌内容，每行一句"
                class="form-textarea"
                rows="6"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button class="submit-btn primary" @click="submitContribution">提交投稿</button>
              <button class="submit-btn secondary" @click="resetForm">重置</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'UserCenter',
  data() {
    return {
      activeTab: 'favorites',
      newComment: '',
      contributeForm: {
        title: '',
        author: '',
        dynasty: '',
        content: ''
      },
      comments: [],
      tabs: [
        { id: 'favorites', name: '我的收藏', icon: '⭐' },
        { id: 'comments', name: '我的评论', icon: '💬' },
        { id: 'contribute', name: '诗歌投稿', icon: '📝' }
      ]
    }
  },
  computed: {
    ...mapGetters(['getFavorites', 'isAuthenticated']),
    ...mapState(['user']),
    favorites() {
      return this.getFavorites
    },
    userEmail() {
      return this.user?.email || '诗歌爱好者'
    },
    userName() {
      return this.user?.user_metadata?.username || this.user?.email?.split('@')[0] || '诗歌爱好者'
    },
    userComments() {
      return this.comments
    }
  },
  methods: {
    ...mapActions(['removeFromFavorites', 'fetchFavorites', 'addComment', 'submitPoem']),
    viewPoem(poem) {
      this.$router.push({ 
        name: 'Poems',
        query: { highlight: poem.id }
      })
    },
    removeFavorite(poem) {
      this.removeFromFavorites(poem.id)
    },
    submitComment() {
      if (this.newComment.trim()) {
        try {
          this.comments.unshift({
            id: Date.now(),
            poemTitle: '新评论',
            content: this.newComment,
            time: new Date().toLocaleDateString()
          })
          this.newComment = ''
        } catch (error) {
          console.error('发表评论失败:', error)
          alert('发表评论失败，请稍后重试')
        }
      }
    },
    editComment(comment) {
      try {
        this.newComment = comment.content
        this.deleteComment(comment.id)
      } catch (error) {
        console.error('编辑评论失败:', error)
        alert('编辑评论失败，请稍后重试')
      }
    },
    deleteComment(commentId) {
      try {
        this.comments = this.comments.filter(c => c.id !== commentId)
      } catch (error) {
        console.error('删除评论失败:', error)
        alert('删除评论失败，请稍后重试')
      }
    },
    async submitContribution() {
      if (!this.validateForm()) return
      
      try {
        await this.submitPoem(this.contributeForm)
        alert('投稿提交成功！感谢您的贡献。')
        this.resetForm()
        // 投稿成功后自动跳转到诗歌库查看新投稿的诗歌
        this.$router.push('/poems')
      } catch (error) {
        alert('投稿失败：' + error.message)
      }
    },
    validateForm() {
      if (!this.contributeForm.title.trim()) {
        alert('请输入诗歌标题')
        return false
      }
      if (!this.contributeForm.author.trim()) {
        alert('请输入作者')
        return false
      }
      if (!this.contributeForm.dynasty) {
        alert('请选择朝代')
        return false
      }
      if (!this.contributeForm.content.trim()) {
        alert('请输入诗歌内容')
        return false
      }
      return true
    },
    resetForm() {
      this.contributeForm = {
        title: '',
        author: '',
        dynasty: '',
        content: ''
      }
    }
  },
  async mounted() {
    if (this.isAuthenticated) {
      try {
        await this.fetchFavorites()
      } catch (error) {
        console.error('获取收藏列表失败:', error)
        // 静默处理错误，避免页面崩溃
      }
    }
  },
  watch: {
    isAuthenticated: {
      immediate: true,
      handler(isAuthenticated) {
        // 路由守卫已经处理了认证检查，这里作为备用检查
        if (!isAuthenticated) {
          this.$router.push('/')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  min-height: calc(100vh - 60px);
  background: #f8f9fa;
}

.user-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(74, 107, 136, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(101, 78, 163, 0.08) 0%, transparent 50%),
      linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 30px;
  position: relative;
  z-index: 2;
}

.user-avatar {
  .avatar-placeholder {
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.user-info {
  .user-name {
    font-size: 2.5rem;
    margin-bottom: 5px;
    font-weight: 700;
  }
  
  .user-email {
    font-size: 1.1rem;
    opacity: 0.8;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .user-stats {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

.user-nav {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 0;
}

.nav-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 20px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 3px solid transparent;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.active {
    color: #42b883;
    border-bottom-color: #42b883;
    background: #f8f9fa;
  }
  
  .tab-icon {
    font-size: 1.3rem;
  }
  
  .tab-text {
    font-weight: 600;
  }
}

.user-content {
  padding: 40px 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tab-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
}

.explore-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #369670;
    transform: translateY(-2px);
  }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.favorite-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.poem-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e8f5e8;
  color: #27ae60;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.poem-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.poem-author {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin-bottom: 15px;
}

.poem-preview {
  color: #34495e;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 15px;
}

.card-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 15px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.remove:hover {
    background: #ffeaea;
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
  
  &.view:hover {
    background: #e3f2fd;
    border-color: #42b883;
    color: #42b883;
  }
}

.comments-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.comment-input {
  margin-bottom: 30px;
}

.comment-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 15px;
  
  &:focus {
    border-color: #42b883;
    outline: none;
  }
}

.submit-comment {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background: #369670;
  }
}

.comments-list {
  .comment-item:not(:last-child) {
    margin-bottom: 20px;
  }
}

.comment-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-poem {
  font-weight: 600;
  color: #2c3e50;
}

.comment-time {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.comment-content {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 15px;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.contribute-form {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #42b883;
    outline: none;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.submit-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #42b883;
    color: white;
    
    &:hover {
      background: #369670;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .user-name {
    font-size: 2rem;
  }
  
  .nav-container {
    flex-direction: column;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>