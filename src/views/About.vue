<template>
  <div class="about">
    <div class="about-container">
      <h1 class="about-title">关于诗歌应用</h1>
      
      <div class="about-content">
        <section class="intro-section">
          <h2>项目介绍</h2>
          <p>诗歌应用是一个基于Vue.js开发的现代化Web应用，致力于为用户提供优美的古典诗歌阅读体验。</p>
        </section>

        <section class="features-section">
          <h2>功能特性</h2>
          <ul class="features-list">
            <li>📚 丰富的诗歌库</li>
            <li>🔍 智能搜索功能</li>
            <li>⭐ 收藏喜欢的诗歌</li>
            <li>📱 响应式设计</li>
            <li>🎨 现代化的UI界面</li>
          </ul>
        </section>

        <section class="tech-section">
          <h2>技术栈</h2>
          <div class="tech-stack">
            <span class="tech-tag">Vue 3</span>
            <span class="tech-tag">Vue Router</span>
            <span class="tech-tag">Vuex</span>
            <span class="tech-tag">SCSS</span>
            <span class="tech-tag">ES6+</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style lang="scss" scoped>
.about {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-title {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 40px;
}

.about-content {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.intro-section,
.features-section,
.tech-section {
  margin-bottom: 40px;
  
  h2 {
    color: #34495e;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-left: 4px solid #42b883;
    padding-left: 15px;
  }
  
  p {
    line-height: 1.8;
    color: #5d6d7e;
    font-size: 1.1rem;
  }
}

.features-list {
  list-style: none;
  
  li {
    padding: 10px 0;
    font-size: 1.1rem;
    color: #5d6d7e;
    
    &:before {
      content: '✓ ';
      color: #42b883;
      font-weight: bold;
      margin-right: 10px;
    }
  }
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  background: #e8f5e8;
  color: #27ae60;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>