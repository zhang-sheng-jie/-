<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">诗歌之美</h1>
          <p class="hero-subtitle">发现古典诗歌的韵味与意境</p>
          <div class="hero-actions">
            <button class="cta-button primary" @click="$router.push('/poems')">
              <span>开始探索</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </button>
            <button class="cta-button secondary" @click="scrollToFeatured">
              查看精选
            </button>
          </div>
        </div>
        <div class="daily-poem-section">
          <div class="daily-poem-card">
            <div class="poem-header">
              <div class="date-badge">
                <span class="day">{{ currentDate.getDate() }}</span>
                <span class="month">{{ currentDate.getMonth() + 1 }}月</span>
              </div>
              <h3 class="daily-title">今日诗句</h3>
            </div>
            <div class="poem-content">
              <div class="poem-text">
                <p class="poem-line">"{{ dailyPoem.content }}"</p>
                <p class="poem-author">—— {{ dailyPoem.author }}《{{ dailyPoem.title }}》</p>
              </div>
              <div class="poem-decoration">
                <div class="decoration-line"></div>
                <div class="decoration-dot"></div>
                <div class="decoration-line"></div>
              </div>
            </div>
            <button class="share-btn" @click="sharePoem">
              <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
              </svg>
              分享诗句
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-poems" ref="featuredSection">
      <div class="container">
        <h2 class="section-title">精选诗歌</h2>
        <p class="section-subtitle">经典唐诗宋词，感受中华文化魅力</p>
        <div class="poems-grid">
          <div 
            v-for="poem in featuredPoems" 
            :key="poem.id" 
            class="poem-card"
            @click="viewPoem(poem)"
          >
            <div class="poem-badge">{{ poem.dynasty }}</div>
            <h3 class="poem-title">{{ poem.title }}</h3>
            <p class="poem-author">{{ poem.author }}</p>
            <p class="poem-preview">{{ poem.content }}</p>
            <div class="poem-actions">
              <button class="action-btn" @click.stop="toggleFavorite(poem)">
                <span v-if="isFavorite(poem.id)">❤️</span>
                <span v-else>🤍</span>
                收藏
              </button>
              <button class="action-btn" @click.stop="viewPoem(poem)">
                📖 阅读
              </button>
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
  name: 'Home',
  data() {
    return {
      currentDate: new Date(),
      dailyPoems: [],
      popularPoems: []
    }
  },
  computed: {
    ...mapGetters(['getAllPoems', 'getFavorites', 'isAuthenticated']),
    ...mapState(['poems']),
    featuredPoems() {
      return this.poems.slice(0, 3)
    },
    dailyPoem() {
      if (this.poems.length === 0) {
        return {
          title: '静夜思',
          author: '李白',
          content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
        }
      }
      // 根据日期选择不同的诗句
      const dayOfMonth = this.currentDate.getDate()
      const poemIndex = (dayOfMonth - 1) % this.poems.length
      return this.poems[poemIndex] || this.poems[0]
    }
  },
  methods: {
    ...mapActions(['addToFavorites', 'removeFromFavorites', 'fetchPoems']),
    scrollToFeatured() {
      this.$refs.featuredSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    },
    viewPoem(poem) {
      this.$router.push({ 
        name: 'Poems',
        query: { highlight: poem.id }
      })
    },
    isFavorite(poemId) {
      return this.getFavorites.some(fav => fav.id === poemId)
    },
    toggleFavorite(poem) {
      if (this.isFavorite(poem.id)) {
        this.removeFromFavorites(poem.id)
      } else {
        this.addToFavorites(poem.id)
      }
    },
    sharePoem() {
      const text = `今日诗句：${this.dailyPoem.content} —— ${this.dailyPoem.author}《${this.dailyPoem.title}》`
      if (navigator.share) {
        navigator.share({
          title: '今日诗句分享',
          text: text,
          url: window.location.href
        })
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert('诗句已复制到剪贴板！')
        })
      } else {
        alert(text)
      }
    }
  },
  async mounted() {
    if (this.poems.length === 0) {
      await this.fetchPoems()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - 60px);
}

.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 120px 0;
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

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-text {
  max-width: 500px;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(45deg, #fff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-weight: 600;
  
  &.primary {
    background: #42b883;
    color: white;
    
    &:hover {
      background: #369670;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(66, 184, 131, 0.4);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }
}

.icon {
  width: 18px;
  height: 18px;
}

.daily-poem-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.daily-poem-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
}

.poem-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.date-badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  min-width: 60px;
  
  .day {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }
  
  .month {
    display: block;
    font-size: 0.8rem;
    opacity: 0.8;
  }
}

.daily-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.poem-content {
  margin-bottom: 25px;
}

.poem-text {
  text-align: center;
  
  .poem-line {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 15px;
    font-style: italic;
    font-family: '楷体', 'KaiTi', serif;
  }
  
  .poem-author {
    font-size: 0.9rem;
    opacity: 0.8;
    margin: 0;
  }
}

.poem-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  
  .decoration-line {
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    flex: 1;
  }
  
  .decoration-dot {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
  }
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }
}

.share-icon {
  width: 16px;
  height: 16px;
}

.featured-poems {
  padding: 80px 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 700;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 50px;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.poem-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
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
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.poem-author {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin-bottom: 20px;
  font-style: italic;
}

.poem-preview {
  color: #34495e;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.poem-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-1px);
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .daily-poem-card {
    padding: 20px;
  }
}
</style>