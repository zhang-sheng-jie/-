<template>
  <div class="poems">
    <div class="poems-header">
      <div class="header-content">
        <h1 class="page-title">诗歌库</h1>
        <p class="page-subtitle">探索经典诗歌，感受文化魅力</p>
        
        <div class="search-section">
          <div class="search-box">
            <div class="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索诗歌标题、作者或朝代..." 
              class="search-input"
              @input="handleSearch"
            >
            <div v-if="searchQuery" class="clear-search" @click="clearSearch">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </div>
          </div>
          
          <div class="search-stats">
            <span v-if="searchQuery">找到 {{ filteredPoems.length }} 首诗歌</span>
            <span v-else>共 {{ poems ? poems.length : 0 }} 首诗歌</span>
          </div>
        </div>
      </div>
    </div>

    <div class="poems-container">
      <div v-if="filteredPoems.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>未找到相关诗歌</h3>
        <p>尝试使用不同的关键词搜索</p>
        <button class="retry-btn" @click="clearSearch">重新搜索</button>
      </div>
      
      <div v-else class="poems-grid">
        <div 
          v-for="poem in filteredPoems" 
          :key="poem.id" 
          class="poem-card"
          :class="{ 'highlighted': isHighlighted(poem.id) }"
        >
          <div class="poem-badge">{{ poem.dynasty }}</div>
          
          <div class="poem-content">
            <h3 class="poem-title">{{ poem.title }}</h3>
            <p class="poem-author">{{ poem.author }}</p>
            <p class="poem-text">{{ poem.content }}</p>
          </div>
          
          <div class="poem-actions">
            <button 
              class="action-btn favorite"
              :class="{ active: isFavorite(poem.id) }"
              @click="toggleFavorite(poem, $event)"
              :title="isFavorite(poem.id) ? '取消收藏' : '收藏'"
            >
              <span class="icon">{{ isFavorite(poem.id) ? '❤️' : '🤍' }}</span>
              <span class="text">{{ isFavorite(poem.id) ? '已收藏' : '收藏' }}</span>
            </button>
            
            <button class="action-btn share" @click="sharePoem(poem)" title="分享">
              <span class="icon">📤</span>
              <span class="text">分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'Poems',
  data() {
    return {
      searchQuery: '',
      searchTimeout: null,
      isSearching: false
    }
  },
  computed: {
    ...mapGetters(['getFavorites', 'isAuthenticated']),
    ...mapState(['poems', 'isLoading']),
    filteredPoems() {
      if (!this.poems || !Array.isArray(this.poems)) {
        return []
      }
      
      if (!this.searchQuery) {
        return this.poems
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.poems.filter(poem => 
        poem && poem.title && poem.title.toLowerCase().includes(query) ||
        poem && poem.author && poem.author.toLowerCase().includes(query) ||
        poem && poem.dynasty && poem.dynasty.toLowerCase().includes(query) ||
        poem && poem.content && poem.content.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    ...mapActions(['addToFavorites', 'removeFromFavorites', 'searchPoems']),
    async handleSearch() {
      // 防抖搜索
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(async () => {
        if (this.searchQuery.trim()) {
          this.isSearching = true
          try {
            await this.searchPoems(this.searchQuery)
          } catch (error) {
            console.error('搜索失败:', error)
          } finally {
            this.isSearching = false
          }
        }
      }, 500)
    },
    clearSearch() {
      this.searchQuery = ''
    },
    isFavorite(poemId) {
      return this.getFavorites.some(fav => fav.id === poemId)
    },
    isHighlighted(poemId) {
      return this.$route.query.highlight === poemId.toString()
    },
    async toggleFavorite(poem, event) {
      try {
        if (this.isFavorite(poem.id)) {
          await this.removeFromFavorites(poem.id)
        } else {
          await this.addToFavorites(poem.id)
          // 添加收藏动画效果
          const btn = event?.target?.closest('.action-btn')
          if (btn) {
            btn.classList.add('pulse')
            setTimeout(() => btn.classList.remove('pulse'), 600)
          }
        }
      } catch (error) {
        console.error('收藏操作失败:', error)
        // 静默处理错误，不显示弹窗
      }
    },
    sharePoem(poem) {
      if (navigator.share) {
        navigator.share({
          title: `${poem.title} - ${poem.author}`,
          text: poem.content,
          url: window.location.href
        })
      } else {
        // 备用分享方式
        const text = `${poem.title}
${poem.author} · ${poem.dynasty}

${poem.content}`
        navigator.clipboard.writeText(text)
        alert('诗歌内容已复制到剪贴板！')
      }
    }
  },
  async mounted() {
    // 如果有高亮参数，滚动到对应诗歌
    if (this.$route.query.highlight) {
      setTimeout(() => {
        const highlighted = document.querySelector('.highlighted')
        if (highlighted) {
          highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.poems {
  min-height: calc(100vh - 60px);
  background: #f8f9fa;
}

.poems-header {
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
  position: relative;
  z-index: 2;
}

.page-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.search-section {
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:focus-within {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  padding: 15px 0;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
}

.clear-search {
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
}

.search-stats {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.poems-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
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

.retry-btn {
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

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
}

.poem-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
  
  &.highlighted {
    border: 2px solid #42b883;
    animation: highlight-pulse 2s ease-in-out;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #42b883, #667eea);
  }
}

@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(66, 184, 131, 0.3); }
  50% { box-shadow: 0 4px 30px rgba(66, 184, 131, 0.6); }
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

.poem-content {
  margin-bottom: 20px;
}

.poem-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.3;
}

.poem-author {
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 20px;
  font-style: italic;
}

.poem-text {
  color: #34495e;
  line-height: 1.7;
  font-size: 1.1rem;
  white-space: pre-line;
}

.poem-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-1px);
  }
  
  &.favorite {
    &.active {
      background: #ffeaea;
      border-color: #ff6b6b;
      color: #ff6b6b;
    }
  }
  
  &.share:hover {
    background: #e3f2fd;
    border-color: #42b883;
    color: #42b883;
  }
  
  &.pulse {
    animation: button-pulse 0.6s ease;
  }
}

@keyframes button-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.icon {
  font-size: 1rem;
}

.text {
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .poem-card {
    padding: 20px;
  }
  
  .poem-actions {
    justify-content: space-between;
  }
  
  .search-box {
    padding: 0 15px;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 12px 0;
  }
}
</style>