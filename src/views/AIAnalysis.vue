<template>
  <div class="ai-analysis">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">AI对话交互</h1>
        <p class="page-subtitle">直接向AI发送查询请求</p>
      </div>
      <div class="analysis-form">
        <div class="form-group">
          <label for="query" class="form-label">查询内容</label>
          <textarea
            id="query"
            v-model="formData.query"
            class="form-textarea"
            placeholder="请输入想和我讨论的内容: （例如：静夜思的分析）"
            rows="6"
            @input="clearResult"
          ></textarea>
        </div>
        <div class="form-actions">
          <button
            class="analyze-btn"
            :class="{ loading: isLoading }"
            :disabled="!canSubmit || isLoading"
            @click="sendRequest"
          >
            <span v-if="!isLoading">🚀 发送请求</span>
            <span v-else>⏳ 处理中...</span>
          </button>
        </div>
      </div>
      <div v-if="responseResult" class="analysis-result">
        <h2 class="result-title">响应结果</h2>
        <div class="result-content" v-html="formatResponse(responseResult)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked'; // 引入 marked 库来解析 Markdown

export default {
  name: 'AIAnalysis',
  data() {
    return {
      formData: {
        query: '',
      },
      isLoading: false,
      responseResult: null,
    };
  },
  computed: {
    canSubmit() {
      return this.formData.query.trim() !== '';
    },
  },
  methods: {
    clearResult() {
      this.responseResult = null;
    },
    async sendRequest() {
      if (!this.canSubmit) return;
      this.isLoading = true;
      this.responseResult = null;

      try {
        const response = await axios.post(
          'https://n8n-acfyvstb.ap-northeast-1.clawcloudrun.com/webhook/4322efde-fd16-42cc-909a-635f14c6b070',
          {
            query: this.formData.query, // 简化的请求体，发送 query 字段
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 60000, // 超时时间 60 秒
          }
        );

        // 假设响应格式为 [{ output: "..." }]
        if (response.data && Array.isArray(response.data) && response.data[0]?.output) {
          this.responseResult = response.data[0].output;
        } else {
          this.responseResult = '响应格式不符合预期';
        }
      } catch (error) {
        console.error('请求失败:', error);
        this.responseResult = `### 请求失败\n错误信息: ${error.message || '未知错误'}`;
      } finally {
        this.isLoading = false;
      }
    },
    formatResponse(data) {
      // 使用 marked 解析 Markdown 内容
      return typeof data === 'string' ? marked(data) : JSON.stringify(data, null, 2);
    },
  },
};
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

.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #42b883;
    box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
  }
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

.result-content {
  line-height: 1.8;
  color: #2c3e50;
  font-size: 1.05rem;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #42b883;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;
  }

  ul,
  ol {
    margin-left: 20px;
    margin-bottom: 1em;
  }

  pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
  }

  blockquote {
    border-left: 4px solid #ccc;
    margin-left: 0;
    padding-left: 1em;
    color: #666;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .analysis-form,
  .analysis-result {
    padding: 20px;
  }
}
</style>
