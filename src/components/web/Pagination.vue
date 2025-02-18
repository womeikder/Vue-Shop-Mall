<!-- src/components/Pagination.vue -->
<template>
  <div class="pagination">
    <button
      class="btn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      上一页
    </button>
    <span class="page-info">
      第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
    </span>
    <button
      class="btn"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      下一页
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-change']);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .btn {
    padding: 8px 16px;
    margin: 0 5px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: #FF7E00;
      border-color: #FF7E00;
    }

    &:disabled {
      background: #f0f0f0;
      color: #999;
      cursor: not-allowed;
    }

    &.primary {
      background-color: #FF7E00;
      color: white;
      border-color: #FF7E00;

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .page-info {
    margin: 0 10px;
    color: #666;
    font-size: 14px;
  }
}
</style>