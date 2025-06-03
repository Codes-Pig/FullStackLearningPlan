<template>
  <div class="event-demo">
    <!-- 事件触发控件 -->
    <div class="controls">
      <button @click="emitDataEvent" class="btn">触发Data事件</button>
      <button @click="emitErrorEvent" class="btn">触发Error事件</button>
      <button @click="emitCountEvent" class="btn">触发Count事件</button>
    </div>

    <!-- 事件响应展示 -->
    <div v-if="lastData" class="card">
      <h3>最新Data事件:</h3>
      <pre>{{ lastData }}</pre>
    </div>

    <div v-if="lastError" class="card error">
      <h3>最新Error事件:</h3>
      <pre>{{ lastError.message }}</pre>
    </div>

    <div v-if="lastCount !== null" class="card">
      <h3>最新Count事件:</h3>
      <p>当前计数: {{ lastCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from '../core/eventBus';
import { AppEvents } from '../core/events';

// 创建全局事件总线实例
export const eventBus = new EventBus<AppEvents>();

export default defineComponent({
  name: 'EventDemo',
  setup() {
    // 响应式数据
    const lastData = ref<AppEvents['data'] | null>(null);
    const lastError = ref<AppEvents['error'] | null>(null);
    const lastCount = ref<AppEvents['count'] | null>(null);

    // 事件处理函数
    const handleDataEvent = (payload: AppEvents['data']) => {
      lastData.value = { ...payload, timestamp: Date.now() };
    };

    const handleErrorEvent = (payload: AppEvents['error']) => {
      lastError.value = { ...payload, message: `[${payload.code}] ${payload.message}` };
    };

    const handleCountEvent = (payload: AppEvents['count']) => {
      lastCount.value = payload;
    };

    // 生命周期管理
    onMounted(() => {
      eventBus.on('data', handleDataEvent);
      eventBus.on('error', handleErrorEvent);
      eventBus.on('count', handleCountEvent);
    });

    onUnmounted(() => {
      eventBus.off('data', handleDataEvent);
      eventBus.off('error', handleErrorEvent);
      eventBus.off('count', handleCountEvent);
    });

    // 触发事件的方法
    const emitDataEvent = () => {
      eventBus.emit('data', {
        text: '来自Vue组件的事件数据',
        timestamp: Date.now()
      });
    };

    const emitErrorEvent = () => {
      eventBus.emit('error', new Error('模拟错误') as AppEvents['error'] & { code: 500 });
    };

    const emitCountEvent = () => {
      const newCount = (lastCount.value || 0) + 1;
      eventBus.emit('count', newCount);
    };

    return {
      lastData,
      lastError,
      lastCount,
      emitDataEvent,
      emitErrorEvent,
      emitCountEvent
    };
  }
});
</script>

<style scoped>
.event-demo {
  margin-top: 2rem;
}

.controls {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #33a06f;
  transform: translateY(-1px);
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease-out;
}

.card.error {
  background-color: #ffe6e6;
  border-left: 4px solid #ff4444;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>