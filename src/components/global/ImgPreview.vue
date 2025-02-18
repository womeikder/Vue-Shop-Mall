<!-- src/components/ImagePreview.vue -->
<template>
  <div>
    <div v-if="isOpen" class="overlay" @click="closePreview">
      <div class="preview-container" @click.stop>
        <button class="nav-button prev" @click="prevImage" :disabled="currentIndex === 0">
          <span>&#10094;</span>
        </button>
        <img :src="baseUrl + currentSrc" alt="Full Size Image" class="full-image" />
        <button class="nav-button next" @click="nextImage" :disabled="currentIndex === images.length - 1">
          <span>&#10095;</span>
        </button>
        <button class="close-button" @click="closePreview">
          <span>&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import baseUrl from '@/utils/BaseUrl';
import { ref, computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    default: () => []
  }
});

const isOpen = ref(false);
const currentIndex = ref(0);

const currentSrc = computed(() => {
  return props.images[currentIndex.value] || props.src;
});

const openPreview = () => {
  isOpen.value = true;
  currentIndex.value = props.images.indexOf(props.src);
  if (currentIndex.value === -1) {
    currentIndex.value = 0;
  }
};

const closePreview = () => {
  isOpen.value = false;
};


const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

defineExpose({
    openPreview,
    closePreview,
    prevImage,
    nextImage
})
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-container {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  transition: background 0.3s ease;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  transition: background 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.7);
}
</style>