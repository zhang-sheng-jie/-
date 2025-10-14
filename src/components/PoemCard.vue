<template>
  <div class="poem-card" :class="{ 'favorite': isFavorite }">
    <div class="poem-header">
      <h3 class="poem-title">{{ poem.title }}</h3>
      <button 
        class="favorite-btn"
        @click="$emit('toggle-favorite')"
        :title="isFavorite ? '取消收藏' : '收藏'"
      >
        <span v-if="isFavorite">❤️</span>
        <span v-else>🤍</span>
      </button>
    </div>
    <p class="poem-author">{{ poem.author }} · {{ poem.dynasty }}</p>
    <p class="poem-content">{{ poem.content }}</p>
  </div>
</template>

<script>
export default {
  name: 'PoemCard',
  props: {
    poem: {
      type: Object,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-favorite']
}
</script>

<style lang="scss" scoped>
.poem-card {
  background: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-base;
  transition: $transition-base;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
  
  &.favorite {
    border-color: $primary-color;
  }
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-sm;
}

.poem-title {
  font-size: $font-size-xl;
  color: $text-color;
  font-weight: 600;
  margin: 0;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: $font-size-lg;
  cursor: pointer;
  padding: $spacing-xs;
  border-radius: $border-radius-base;
  transition: $transition-base;
  
  &:hover {
    background: rgba($primary-color, 0.1);
  }
}

.poem-author {
  color: $text-light;
  font-size: $font-size-sm;
  margin-bottom: $spacing-base;
}

.poem-content {
  color: $secondary-color;
  line-height: 1.6;
  font-size: $font-size-base;
  white-space: pre-line;
}
</style>