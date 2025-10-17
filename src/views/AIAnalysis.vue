<template>
  <div class="ai-analysis">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">AI诗歌鉴赏</h1>
        <p class="page-subtitle">让AI帮您深度解析诗歌的意境与韵味</p>
      </div>

      <div class="analysis-form">
        <div class="form-grid">
          <!-- 诗人输入 -->
          <div class="form-group">
            <label for="poet" class="form-label">诗人</label>
            <input
              id="poet"
              v-model="formData.poet"
              type="text"
              class="form-input"
              placeholder="请输入诗人姓名，如：李白"
              @input="clearAnalysis"
            />
          </div>

          <!-- 朝代选择 -->
          <div class="form-group">
            <label for="dynasty" class="form-label">朝代</label>
            <select
              id="dynasty"
              v-model="formData.dynasty"
              class="form-select"
              @change="clearAnalysis"
            >
              <option value="">请选择朝代</option>
              <option value="先秦">先秦</option>
              <option value="汉">汉</option>
              <option value="魏晋">魏晋</option>
              <option value="南北朝">南北朝</option>
              <option value="隋">隋</option>
              <option value="唐">唐</option>
              <option value="宋">宋</option>
              <option value="元">元</option>
              <option value="明">明</option>
              <option value="清">清</option>
              <option value="近代">近代</option>
              <option value="现代">现代</option>
            </select>
          </div>

          <!-- 诗歌标题 -->
          <div class="form-group">
            <label for="title" class="form-label">诗歌标题</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="请输入诗歌标题"
              @input="clearAnalysis"
            />
          </div>
        </div>

        <!-- 诗歌内容 -->
        <div class="form-group">
          <label for="content" class="form-label">诗歌内容</label>
          <textarea
            id="content"
            v-model="formData.content"
            class="form-textarea"
            placeholder="请输入诗歌内容，每行一句"
            rows="6"
            @input="clearAnalysis"
          ></textarea>
        </div>

        <!-- 开始分析按钮 -->
        <div class="form-actions">
          <button
            class="analyze-btn"
            :class="{ loading: isAnalyzing }"
            :disabled="!canAnalyze || isAnalyzing"
            @click="startAnalysis"
          >
            <span v-if="!isAnalyzing">🎨 开始AI鉴赏</span>
            <span v-else>⏳ 分析中...</span>
          </button>
        </div>
      </div>

      <!-- 分析结果 -->
      <div v-if="analysisResult" class="analysis-result">
        <h2 class="result-title">AI鉴赏结果</h2>
        <div class="result-content">
          <div class="result-section">
            <h3>📖 诗歌基本信息</h3>
            <div class="poem-info">
              <p><strong>标题：</strong>{{ analysisResult.title }}</p>
              <p><strong>作者：</strong>{{ analysisResult.author }}</p>
              <p><strong>朝代：</strong>{{ analysisResult.dynasty }}</p>
            </div>
          </div>

          <div class="result-section">
            <h3>🎯 主题思想</h3>
            <p class="theme-content">{{ analysisResult.theme }}</p>
          </div>

          <div class="result-section">
            <h3>🎨 艺术特色</h3>
            <p class="artistic-features">{{ analysisResult.artisticFeatures }}</p>
          </div>

          <div class="result-section">
            <h3>💭 意境赏析</h3>
            <p class="appreciation">{{ analysisResult.appreciation }}</p>
          </div>

          <div class="result-section">
            <h3>🌟 经典名句</h3>
            <div class="famous-lines">
              <p v-for="(line, index) in analysisResult.famousLines" :key="index" class="famous-line">
                "{{ line }}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 示例诗歌 -->
      <div class="example-poems">
        <h3 class="example-title">💡 示例诗歌</h3>
        <div class="example-grid">
          <div
            v-for="example in examplePoems"
            :key="example.id"
            class="example-card"
            @click="fillExample(example)"
          >
            <h4>{{ example.title }}</h4>
            <p class="example-author">{{ example.author }} · {{ example.dynasty }}</p>
            <p class="example-content">{{ example.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIAnalysis',
  data() {
    return {
      formData: {
        poet: '',
        dynasty: '',
        title: '',
        content: ''
      },
      isAnalyzing: false,
      analysisResult: null,
      examplePoems: [
        {
          id: 1,
          title: '静夜思',
          author: '李白',
          dynasty: '唐',
          content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
        },
        {
          id: 2,
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐',
          content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
        },
        {
          id: 3,
          title: '登鹳雀楼',
          author: '王之涣',
          dynasty: '唐',
          content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
        }
      ]
    }
  },
  computed: {
    canAnalyze() {
      return this.formData.title && this.formData.content && this.formData.poet
    }
  },
  methods: {
    clearAnalysis() {
      this.analysisResult = null
    },
    
    async startAnalysis() {
      if (!this.canAnalyze) return
      
      this.isAnalyzing = true
      
      // 模拟AI分析过程
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        this.analysisResult = {
          title: this.formData.title,
          author: this.formData.poet,
          dynasty: this.formData.dynasty,
          theme: this.generateTheme(),
          artisticFeatures: this.generateArtisticFeatures(),
          appreciation: this.generateAppreciation(),
          famousLines: this.extractFamousLines()
        }
      } catch (error) {
        console.error('分析失败:', error)
      } finally {
        this.isAnalyzing = false
      }
    },
    
    generateTheme() {
      const themes = [
        '这首诗表达了诗人对故乡的深切思念之情，通过明月这一意象，将游子的思乡之情表现得淋漓尽致。',
        '诗歌描绘了春天的美好景象，展现了诗人对大自然的热爱和对生活的积极态度。',
        '这首诗体现了诗人积极向上的人生态度，鼓励人们不断进取，追求更高的境界。'
      ]
      return themes[Math.floor(Math.random() * themes.length)]
    },
    
    generateArtisticFeatures() {
      const features = [
        '语言简练明快，意境深远。运用了比喻、对偶等修辞手法，增强了诗歌的表现力。',
        '诗歌节奏明快，韵律和谐。通过细腻的描写，展现了诗人高超的艺术造诣。',
        '结构严谨，层次分明。前两句写景，后两句抒情，情景交融，相得益彰。'
      ]
      return features[Math.floor(Math.random() * features.length)]
    },
    
    generateAppreciation() {
      const appreciations = [
        '整首诗意境优美，情感真挚。诗人通过简单的语言，表达了深刻的人生哲理，令人回味无穷。',
        '诗歌画面感强，读来如临其境。诗人巧妙地将个人情感与自然景物相结合，创造了独特的艺术境界。',
        '这首诗语言质朴，情感真挚。通过对日常生活的描写，展现了诗人对生活的热爱和对美的追求。'
      ]
      return appreciations[Math.floor(Math.random() * appreciations.length)]
    },
    
    extractFamousLines() {
      const lines = this.formData.content.split('\n').filter(line => line.trim())
      return lines.slice(0, 2) // 取前两句作为名句
    },
    
    fillExample(example) {
      this.formData = {
        poet: example.author,
        dynasty: example.dynasty,
        title: example.title,
        content: example.content
      }
      this.clearAnalysis()
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-analysis {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  .page-title {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  .page-subtitle {
    font-size: 1.2rem;
    color: #7f8c8d;
  }
}

.analysis-form {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #42b883;
    box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-actions {
  text-align: center;
}

.analyze-btn {
  background: linear-gradient(135deg, #42b883, #369670);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(66, 184, 131, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &.loading {
    background: #95a5a6;
  }
}

.analysis-result {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.result-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
}

.result-section {
  margin-bottom: 30px;
  
  h3 {
    font-size: 1.2rem;
    color: #42b883;
    margin-bottom: 15px;
    font-weight: 600;
  }
}

.poem-info p {
  margin-bottom: 8px;
  color: #34495e;
}

.theme-content,
.artistic-features,
.appreciation {
  line-height: 1.8;
  color: #2c3e50;
  font-size: 1.05rem;
}

.famous-lines {
  .famous-line {
    font-style: italic;
    color: #e74c3c;
    font-size: 1.1rem;
    margin-bottom: 10px;
    padding-left: 20px;
    border-left: 3px solid #42b883;
  }
}

.example-poems {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.example-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.example-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    border-color: #42b883;
  }
  
  h4 {
    color: #2c3e50;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .example-author {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  
  .example-content {
    color: #34495e;
    line-height: 1.6;
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .analysis-form,
  .analysis-result,
  .example-poems {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .example-grid {
    grid-template-columns: 1fr;
  }
}
</style>