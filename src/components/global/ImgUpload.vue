<template>
  <div class="photo-wall">
    <div v-for="(file, index) in fileList" :key="index" class="photo-item">
      <img :src="file.preview" :alt="file.name" style="width: 150px"/>
      <div class="photo-actions">
        <span @click="handleView(index)">
          <Icon name="review" size="40"></Icon>
        </span>
        <span @click="handleRemove(index)">
          <Icon name="remove" size="40"></Icon>
        </span>
      </div>
    </div>
    <div class="add-photo" @click="handleAddPhoto">+</div>
  </div>
  <Dialog ref="imgDialog" title="查看图片">
    <img :src="dialogShowUrl" style="width: 60vw;">
  </Dialog>
</template>

<script setup>
import {ref} from 'vue';
import {getOssToken} from '@/api/admin/user.js';
import {v4 as uuidv4} from 'uuid';
import pMessage from '@/components/global/message/index.js';
import Icon from '@/components/global/Icon.vue';
import Dialog from '@/components/global/Dialog.vue';
import request from "@/utils/request.js";
import BaseUrl from "@/utils/BaseUrl.js";

// 统一文件类型允许列表
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const props = defineProps({
  showSize: {
    type: Number,
    default: 5
  },
  imgList: {
    type: Array,
    default: []
  }
})
// 定义自定义事件名，用于向父组件传递文件名
const emits = defineEmits(['upload-success']);

// 获取后端传递来的认证token
const token = ref({});
const getToken = async () => {
  try {
    const res = await getOssToken();
    token.value = res.data;
  } catch (error) {
    console.error('获取OSS token出错：', error);
    pMessage.error('获取OSS token失败');
  }
};
getToken();

// 采用uuid来生成唯一的文件名
const generateUUIDFileName = (originalFileName) => {
  const uuid = uuidv4();
  const fileExtension = originalFileName.split('.').pop();
  return `${uuid}.${fileExtension}`;
};

// 照片墙相关逻辑
const fileList = ref([]);

// 传入的默认值图片，赋值给数组
props.imgList.forEach((item) => {
  fileList.value.push({'preview': BaseUrl + item})
})

const imgDialog = ref(null);
const dialogShowUrl = ref('');

// 处理添加照片
const handleAddPhoto = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = allowedFileTypes.join(','); // 使accept属性和验证类型一致
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file && allowedFileTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileObj = {
          name: file.name,
          preview: e.target.result,
          file: file // 保留原始文件对象
        };
        fileList.value.push(fileObj);
        if (fileList.value.length > props.showSize) {
          fileList.value.shift()
        }
        // 确保文件读取完成后再进行上传操作
        await handleFileUpload(fileObj);
      };
      reader.readAsDataURL(file);
    } else {
      pMessage.error('请选择支持的图片文件类型');
    }
  };
  input.click();
};

// 处理移除照片
const handleRemove = (index) => {
  fileList.value.splice(index, 1);
};

// 处理查看图片
const handleView = (index) => {
  dialogShowUrl.value = fileList.value[index].preview;
  imgDialog.value.show();
};

// 处理文件上传
const handleFileUpload = (fileObj) => {
  const file = fileObj.file; // 使用原始文件对象进行上传
  if (file) {
    const randomFileName = generateUUIDFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', randomFileName);

    request.post('utils/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then((response) => {
          pMessage.success('图片上传成功');
          emits('upload-success', randomFileName);
        })
        .catch((error) => {
          pMessage.error('图片上传失败');
        });
  }
};
</script>

<style scoped>
.photo-wall {
  display: flex;
  //flex-wrap: wrap;
  justify-content: center;
}

.photo-item {
  position: relative;
  margin: 10px;
  align-content: center;
}

.photo-actions {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  justify-content: space-around;

  span {
    align-content: center;
    cursor: pointer;
  }
}

.photo-item:hover .photo-actions {
  display: flex;
  background: rgba(232, 232, 232, 0.59);
}

.add-photo {
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 2px dashed #ccc;
  margin: 10px;
  cursor: pointer;
}
</style>
