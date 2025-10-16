<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">诗歌应用</h1>
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link to="/" class="nav-link">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/poems" class="nav-link">诗歌库</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link to="/user" class="nav-link">用户中心</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">关于</router-link>
          </li>
        </ul>
        <div class="auth-section">
          <div v-if="isAuthenticated" class="user-info">
            <span class="welcome-text">欢迎，{{ currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || '用户' }}</span>
            <button class="auth-btn logout" @click="handleLogout">退出</button>
          </div>
          <div v-else class="auth-buttons">
            <button class="auth-btn login" @click="showLoginModal = true">登录</button>
            <button class="auth-btn register" @click="showRegisterModal = true">注册</button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 登录模态框 -->
    <LoginModal
      v-if="showLoginModal"
      :is-login="true"
      @close="showLoginModal = false"
      @toggle-mode="toggleAuthMode"
      @success="handleAuthSuccess"
    />
    
    <!-- 注册模态框 -->
    <LoginModal
      v-if="showRegisterModal"
      :is-login="false"
      @close="showRegisterModal = false"
      @toggle-mode="toggleAuthMode"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoginModal from './components/LoginModal.vue'

export default {
  name: 'App',
  components: {
    LoginModal
  },
  data() {
    return {
      showLoginModal: false,
      showRegisterModal: false
    }
  },
  computed: {
    // 使用 getters，而不是直接映射 state 上不存在的字段
    ...mapGetters(['isAuthenticated']),
    currentUser() {
      return this.$store.state.user
    }
  },
  methods: {
    ...mapActions(['logout', 'checkAuth']),
    
    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        this.logout()
      }
    },
    
    toggleAuthMode() {
      this.showLoginModal = !this.showLoginModal
      this.showRegisterModal = !this.showRegisterModal
    },
    
    handleAuthSuccess() {
      this.showLoginModal = false
      this.showRegisterModal = false
    }
  },
  async mounted() {
    await this.checkAuth()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #42b883;
  }
  
  &.router-link-active {
    color: #42b883;
  }
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: #2c3e50;
  font-size: 0.9rem;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-btn {
  padding: 8px 16px;
  border: 2px solid;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.login {
    background: white;
    border-color: #42b883;
    color: #42b883;
    
    &:hover {
      background: #42b883;
      color: white;
    }
  }
  
  &.register {
    background: #42b883;
    border-color: #42b883;
    color: white;
    
    &:hover {
      background: #369670;
      border-color: #369670;
    }
  }
  
  &.logout {
    background: #e74c3c;
    border-color: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
      border-color: #c0392b;
    }
  }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 60px);
}
</style>