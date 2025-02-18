<template>
    <div class="address-page">
        <div class="title">
            <h1 class="page-title">地址列表</h1>
            <button class="add-button" @click="addAddress">添加地址</button>
        </div>

        <table class="address-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>姓名</th>
                    <th>城市</th>
                    <th>详细地址</th>
                    <th>电话</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="address in addressList" :key="address.id">
                    <td :class="{ 'default-row': address.is_default === 1 }">{{ address.id }}</td>
                    <td :class="{ 'default-row': address.is_default === 1 }">{{ address.name }}</td>
                    <td :class="{ 'default-row': address.is_default === 1 }">{{ address.city }}</td>
                    <td :class="{ 'default-row': address.is_default === 1 }">{{ address.detail }}</td>
                    <td :class="{ 'default-row': address.is_default === 1 }">{{ address.phone }}</td>
                    <td :class="{ 'default-row': address.is_default === 1 }">
                        <button
                            class="action-button"
                            @click="setDefaultAddress(address.id)"
                            :disabled="address.is_default === 1"
                        >
                            设为默认
                        </button>
                        <button class="action-button" @click="updateAddress(address)">编辑</button>
                        <button class="action-button" @click="deleteAddress(address.id)">删除</button>
                        <span v-if="address.is_default === 1" class="default-label">默认</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Dialog ref="addAddressRef" title="添加地址">
        <PostAddressComponent @success="handleAddressSuccess" @error="handleAddressError" />
    </Dialog>
    <Drawer ref="updateAddressRef" title="编辑地址">
        <PostAddressComponent isEdit="true" :data="updateData" @success="handleAddressSuccess" @error="handleAddressError" />
    </Drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAddressList, useSetDefaultAddress, useDeleteAddress, useUpdateAddress, useAddAddress } from '@/api/web/address';
import PostAddressComponent from '@/components/web/address/PostAddressComponent.vue';
import Dialog from '@/components/global/Dialog.vue';
import Drawer from '@/components/global/Drawer.vue';
import pMessage from '@/components/global/message';

const addressList = ref([]);
const addAddressRef = ref(null);
const updateAddressRef = ref(null);
const updateData = ref({});
const fetchAddressList = async () => {
    try {
        const response = await useAddressList();
        // 将默认地址排到列表首位
        const defaultAddress = response.data.find(item => item.is_default === 1);
        const nonDefaultAddresses = response.data.filter(item => item.is_default === 0);
        if (defaultAddress) {
            addressList.value = [defaultAddress, ...nonDefaultAddresses];
        } else {
            addressList.value = response.data;
        }
        console.log('地址列表:', addressList.value);
    } catch (error) {
        console.error('获取地址列表失败:', error);
    }
};

const addAddress = () => {
    // 这里可以添加添加地址的逻辑
    addAddressRef.value.show();
};

const handleAddressSuccess = () => {
    // 处理添加地址成功的逻辑
   pMessage.success('添加地址成功');
   fetchAddressList();
};
const handleAddressError = () => {
    // 处理添加地址失败的逻辑
    pMessage.error('添加地址失败'); 
}

const setDefaultAddress = async (id) => {
    // 这里可以添加设置默认地址的逻辑
    const res = await useSetDefaultAddress(id);
    pMessage.success(res.msg);
    fetchAddressList();
};


const updateAddress = (item) => {
    // 这里可以添加更新地址的逻辑
    console.log('更新地址:', item);
    updateData.value = item;
    updateAddressRef.value.show();
    fetchAddressList()
    
};

const deleteAddress = async (id) => {
    const res = await useDeleteAddress(id);
    pMessage.success(res.msg);
    fetchAddressList();
};

onMounted(() => {
    fetchAddressList();
});
</script>

<style lang="scss" scoped>
.address-page {
    font-family: Arial, sans-serif;
    padding: 10px;
    max-width: 1200px;
    margin: 0 auto;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-title {
    color: #333;
    font-size: 24px;
    margin-bottom: 10px; // 减少标题与按钮之间的距离
}

.add-button {
    background-color: transparent; // 透明背景
    color: #007BFF; // 文字颜色
    border: 1px solid #007BFF; // 边框
    padding: 8px 16px; // 调整内边距
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px; // 减少按钮与表格之间的距离
}

.add-button:hover {
    background-color: #007BFF;
    color: white;
}

.address-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    position: relative;
}

.address-table th,
.address-table td {
    padding: 12px 15px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

.address-table th {
    background-color: #f4f4f4;
    color: #333;
}

.address-table tr:hover {
    background-color: #f9f9f9;
}

.action-button {
    background-color: transparent; // 透明背景
    border: 1px solid; // 边框
    padding: 6px 10px; // 调整内边距
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 5px;
}
.action-button:disabled {

    background-color: #ff498c;
    cursor: not-allowed; // 禁用状态下的光标样式 
}

.action-button:nth-child(1) {
    color: #28a745;
    border-color: #28a745;
}

.action-button:nth-child(1):hover {
    background-color: #28a745;
    color: white;
}

.action-button:nth-child(2) {
    color: #ffc107;
    border-color: #ffc107;
}

.action-button:nth-child(2):hover {
    background-color: #ffc107;
    color: #333;
}

.action-button:nth-child(3) {
    color: #dc3545;
    border-color: #dc3545;
}

.action-button:nth-child(3):hover {
    background-color: #dc3545;
    color: white;
}

/* 添加默认标记样式 */
.default-label {
    position: absolute;
    background-color: #28a745;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    margin-left: 10px;
}

/* 默认地址行样式 */
.default-row {
    background-color: #e6f7ff;
}
</style>  