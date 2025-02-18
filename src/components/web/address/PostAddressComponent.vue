<template>
  <div class="address-form">
    <div class="form-header">
      <h3>添加收货地址</h3>
      <div class="location-bar">
        <span>当前配送至</span>
        <span class="location">{{ currentLocation || '中国大陆' }}</span>
        <span class="switch-btn">切换 ></span>
      </div>
    </div>

    <div class="form-content">
      <div class="form-item">
        <span class="required">*</span>
        <label>地址信息:</label>
        <div class="address-select">
          <select v-model="selectedProvince" @change="handleProvinceChange">
            <option value="">请选择省份</option>
            <option v-for="item in provinceList" 
                    :key="item.id" 
                    :value="item.id">
              {{ item.cityname }}
            </option>
          </select>

          <select v-model="selectedCity" 
                  @change="handleCityChange"
                  :disabled="!selectedProvince">
            <option value="">请选择城市</option>
            <option v-for="item in cityList" 
                    :key="item.id" 
                    :value="item.id">
              {{ item.cityname }}
            </option>
          </select>

          <select v-model="selectedArea" 
                  :disabled="!selectedCity">
            <option value="">请选择区县</option>
            <option v-for="item in areaList" 
                    :key="item.id" 
                    :value="item.id">
              {{ item.cityname }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-item">
        <span class="required">*</span>
        <label>详细地址:</label>
        <textarea
          v-model="addressDetail"
          placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"
          maxlength="120"
          rows="3"
        ></textarea>
        <div class="hint">详细地址长度需要在2-120个字符或字符，不能包含表情符号</div>
        <div class="word-count">{{ addressDetail.length }}/120</div>
      </div>

      <div class="form-item">
        <span class="required">*</span>
        <label>收货人姓名:</label>
        <input
          type="text"
          v-model="receiverName"
          placeholder="长度不超过25个字符"
          maxlength="25"
        />
      </div>

      <div class="form-item">
        <span class="required">*</span>
        <label>手机号码:</label>
        <div class="phone-input">
          <div class="prefix-select">
            <span>中国大陆 +86</span>
          </div>
          <input
            type="tel"
            v-model="phoneNumber"
            placeholder="电话号码，手机号必须填一项"
            maxlength="11"
          />
        </div>
      </div>

      <div class="form-item checkbox">
        <label class="checkbox-label">
          <input type="checkbox" v-model="isDefault" />
          <span>设置为默认收货地址</span>
        </label>
      </div>

      <div class="form-actions">
        <div class="validation-message" v-if="getValidationMessage && !isFormValid">
          {{ getValidationMessage }}
        </div>
        <button 
          class="submit-btn" 
          @click="handleSubmit"
          :disabled="!isFormValid"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAreaList, useAddAddress, useSetDefaultAddress, useUpdateAddress } from '@/api/web/address'
import pMessage from '@/components/global/message'

const props = defineProps({
  currentLocation: {
    type: String,
    default: '中国大陆'
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({}) 
  }
})

const provinceList = ref([])
const cityList = ref([])
const areaList = ref([])


const selectedProvince = ref('')
const selectedCity = ref('')
const selectedArea = ref('')
const addressDetail = ref('')
const receiverName = ref('')
const phoneNumber = ref('')
const isDefault = ref(false)


// 获取省份列表（第一级）
const getProvinceList = async () => {
  try {
    const res = await useAreaList({ pid: 1 }) // 初始 pid 为 1
    if (res.code === 200) {
      provinceList.value = res.data
    }
  } catch (error) {
    console.error('获取省份列表失败:', error)
  }
}


// 获取城市列表（第二级）
const handleProvinceChange = async () => {
  // 清空后续选择
  selectedCity.value = ''
  selectedArea.value = ''
  cityList.value = []
  areaList.value = []
  
  if (!selectedProvince.value) return
  
  try {
    const res = await useAreaList({ pid: selectedProvince.value }) // 使用选中的省份id作为pid
    if (res.code === 200) {
      cityList.value = res.data
    }
  } catch (error) {
    console.error('获取城市列表失败:', error)
  }
}

// 获取区县列表（第三级）
const handleCityChange = async () => {
  // 清空区县选择
  selectedArea.value = ''
  areaList.value = []
  
  if (!selectedCity.value) return
  
  try {
    const res = await useAreaList({ pid: selectedCity.value }) // 使用选中的城市id作为pid
    if (res.code === 200) {
      areaList.value = res.data
    }
  } catch (error) {
    console.error('获取区县列表失败:', error)
  }
}

// 修改表单验证逻辑
const isFormValid = computed(() => {
  const isAddressSelected = selectedProvince.value && selectedCity.value && selectedArea.value
  const isDetailValid = addressDetail.value && addressDetail.value.length >= 2
  const isNameValid = receiverName.value && receiverName.value.trim() !== ''
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phoneNumber.value)
  
  return isAddressSelected && isDetailValid && isNameValid && isPhoneValid
})

// 修改提交表单逻辑
const handleSubmit = async () => {
  if (!isFormValid.value) {
    pMessage.error('请填写完整信息')
    return
  }
  
  try {
    const addressData = {
      name: receiverName.value.trim(),
      city_id: selectedArea.value,
      detail: addressDetail.value.trim(),
      phone: phoneNumber.value,
      is_default: isDefault.value ? 1 : 0
    }
    let res = null
    
    if (props.isEdit) {
      res = await useUpdateAddress(props.data.id, addressData) 
    } else {
      res = await useAddAddress(addressData)
    }

    if (res.code === 201) {
      // 如果设置为默认地址，则调用设置默认地址接口
      if (isDefault.value && res.data.id) {
        try {
          await useSetDefaultAddress(res.data.id)
        } catch (error) {
          console.error('设置默认地址失败:', error)
        }
      }
      
      pMessage.success('地址添加成功')
      // 清空表单
      resetForm()
      // 触发成功回调
      emit('success')
    } else {
      pMessage.error('地址添加失败')
    }
  } catch (error) {
    console.error('保存地址失败:', error)
    pMessage.error('保存地址失败')
  }
}

// 添加重置表单方法
const resetForm = () => {
  selectedProvince.value = ''
  selectedCity.value = ''
  selectedArea.value = ''
  addressDetail.value = ''
  receiverName.value = ''
  phoneNumber.value = ''
  isDefault.value = false
  cityList.value = []
  areaList.value = []
}

// 添加表单验证提示
const getValidationMessage = computed(() => {
  if (!selectedProvince.value || !selectedCity.value || !selectedArea.value) {
    return '请选择完整的地址信息'
  }
  if (!addressDetail.value || addressDetail.value.length < 2) {
    return '请输入详细地址，至少2个字符'
  }
  if (!receiverName.value || receiverName.value.trim() === '') {
    return '请输入收货人姓名'
  }
  if (!phoneNumber.value || !/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    return '请输入正确的手机号码'
  }
  return ''
})

// 初始化获取省份列表
onMounted(() => {
  getProvinceList()
})

// 扩展emit事件
const emit = defineEmits(['success', 'error'])
</script>

<style scoped>
.address-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.form-header {
  margin-bottom: 24px;
}

.location-bar {
  background: #f5f5f5;
  padding: 12px;
  margin-top: 12px;
  border-radius: 4px;
}

.switch-btn {
  color: #1890ff;
  cursor: pointer;
  margin-left: 12px;
}

.form-item {
  margin-bottom: 20px;
  position: relative;
}

.required {
  color: #ff4400;
  margin-right: 4px;
}

label {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 12px;
}

.address-select {
  display: flex;
  gap: 12px;
}

select {
  flex: 1;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 12px;
  outline: none;
  cursor: pointer;
}

select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 12px;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

input[type="text"],
input[type="tel"] {
  width: 100%;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 12px;
  outline: none;
}

.phone-input {
  display: flex;
  gap: 12px;
}

.prefix-select {
  width: 140px;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #f5f5f5;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.word-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 12px;
  color: #999;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.submit-btn {
  width: 120px;
  height: 40px;
  background: #ff4400;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #ff5500;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 输入框焦点状态 */
input:focus,
textarea:focus,
select:focus {
  border-color: #ff4400;
  box-shadow: 0 0 0 2px rgba(255, 68, 0, 0.1);
}

/* 错误状态 */
.error input,
.error textarea,
.error select {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .address-select {
    flex-direction: column;
  }
  
  label {
    width: auto;
    text-align: left;
    margin-bottom: 8px;
  }
  
  .phone-input {
    flex-direction: column;
  }
  
  .prefix-select {
    width: 100%;
  }
}

.validation-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 添加输入验证状态样式 */
input:invalid,
textarea:invalid,
select:invalid {
  border-color: #ff4d4f;
}

.error-tip {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}
</style>