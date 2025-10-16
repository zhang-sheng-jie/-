<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isLogin ? '登录' : '注册' }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="请输入邮箱"
              class="form-input"
            >
          </div>
          
          <div v-if="!isLogin" class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="请输入用户名"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              :placeholder="isLogin ? '请输入密码' : '请设置密码（至少6位）'"
              class="form-input"
            >
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '处理中...' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>
        
        <div class="switch-mode">
          <p>
            {{ isLogin ? '还没有账号？' : '已有账号？' }}
            <button class="switch-btn" @click="toggleMode">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LoginModal',
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: ''
      },
      error: ''
    }
  },
  computed: {
    ...mapState(['isLoading'])
  },
  methods: {
    ...mapActions(['login', 'register', 'checkAuth']),
    
    async handleSubmit() {
      this.error = ''
      try {
        if (this.isLogin) {
          await this.login({
            email: this.form.email,
            password: this.form.password
          })
        } else {
          await this.register({
            email: this.form.email,
            password: this.form.password,
            username: this.form.username
          })
        }
        // 登录/注册成功后检查认证状态
        await this.checkAuth()
        this.$emit('success')
        this.$emit('close')
      } catch (error) {
        this.error = error.message || '操作失败，请重试'
      }
    },
    
    toggleMode() {
      this.$emit('toggle-mode')
      this.error = ''
      this.form = {
        email: this.form.email,
        username: '',
        password: ''
      }
    }
  },
  watch: {
    isLogin(newVal) {
      this.error = ''
      if (newVal) {
        this.form.username = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e9ecef;
  
  h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5rem;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;
  
  &:hover {
    color: #2c3e50;
  }
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
  }
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #42b883;
    outline: none;
  }
}

.error-message {
  background: #ffeaea;
  color: #e74c3c;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  background: #42b883;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #369670;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
}

.switch-mode {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  
  p {
    margin: 0;
    color: #7f8c8d;
  }
}

.switch-btn {
  background: none;
  border: none;
  color: #42b883;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  
  &:hover {
    color: #369670;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
}
</style>