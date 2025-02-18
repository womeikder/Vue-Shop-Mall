<template>
    <div class="user-management">
        <h1>账户设置</h1>
        <!-- 用户信息展示 -->
        <div v-if="userInfo" class="user-info">
            <p><strong>昵称:</strong> {{ userInfo.name }}</p>
            <p><strong>邮箱:</strong> {{ userInfo.email }}</p>
            <button class="action-button" @click="showUpdateInfoModal = true">更新用户信息</button>
            <button class="action-button" @click="showUpdatePasswordModal = true">更新用户密码</button>
            <button class="action-button" @click="showUpdateEmailModal = true">更新用户邮箱</button>
        </div>
        <!-- 更新用户信息模态框 -->
        <div v-if="showUpdateInfoModal" class="modal">
            <div class="modal-content">
                <h2>更新用户信息</h2>
                <p>姓名</p>
                <input v-model="updateInfoData.name" placeholder="姓名" required />
                <p>电话</p>
                <input v-model="updateInfoData.phone" placeholder="电话" />
                <p>头像</p>
                <ImgUpload @upload-success="updateUser" :imgList="[updateInfoData.avatar]" :showSize="1" />
                <p>性别</p>
                <select v-model="updateInfoData.gender">
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
                <p>生日</p>
                <input v-model="updateInfoData.birthday" type="date" placeholder="生日" />
                <div class="button-group">
                    <button class="save-button" @click="updateUserInfo">保存</button>
                    <button class="cancel-button" @click="showUpdateInfoModal = false">取消</button>
                </div>
            </div>
        </div>
        <!-- 更新用户密码模态框 -->
        <div v-if="showUpdatePasswordModal" class="modal">
            <div class="modal-content">
                <h2>更新用户密码</h2>
                <input v-model="updatePasswordData.oldPassword" type="password" placeholder="旧密码" />
                <input v-model="updatePasswordData.password" type="password" placeholder="新密码" />
                <input v-model="updatePasswordData.password_confirmation" type="password" placeholder="确认新密码" />
                <div class="button-group">
                    <button class="save-button" @click="updateUserPassword">保存</button>
                    <button class="cancel-button" @click="showUpdatePasswordModal = false">取消</button>
                </div>
            </div>
        </div>
        <!-- 更新用户邮箱模态框 -->
        <div v-if="showUpdateEmailModal" class="modal">
            <div class="modal-content">
                <h2>更新用户邮箱</h2>
                <input v-model="updateEmailData.email" type="email" placeholder="新邮箱" />
                <input v-model="updateEmailData.code" placeholder="验证码" />
                <button class="send-code-button" @click="sendCode" :disabled="countdown > 0">{{ countdown > 0 ? `${countdown}s` : '发送验证码' }}</button>
                <div class="button-group">
                    <button class="save-button" @click="updateUserEmail">保存</button>
                    <button class="cancel-button" @click="showUpdateEmailModal = false">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
    useUserInfo,
    useUpdateUserInfo,
    useUpdateUserPassword,
    useSendCode,
    useUpdateUserEmail
} from '@/api/web/user';
import ImgUpload from '@/components/global/ImgUpload.vue';
import pMessage from '@/components/global/message';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
// 用户信息
const userInfo = ref(null);
// 更新用户信息模态框显示状态
const showUpdateInfoModal = ref(false);
// 更新用户信息数据
const updateInfoData = ref({
    name: '',
    phone: '',
    avatar: '',
    gender: '',
    birthday: ''
});
// 更新用户密码模态框显示状态
const showUpdatePasswordModal = ref(false);
// 更新用户密码数据
const updatePasswordData = ref({
    oldPassword: '',
    password: '',
    password_confirmation: ''
});
// 更新用户邮箱模态框显示状态
const showUpdateEmailModal = ref(false);
// 更新用户邮箱数据
const updateEmailData = ref({
    email: '',
    code: ''
});
// 倒计时
const countdown = ref(0);
let timer = null;

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const response = await useUserInfo();
        userInfo.value = response.data;
        updateInfoData.value.name = userInfo.value.name;
        updateInfoData.value.email = userInfo.value.email;
        updateInfoData.value.phone = userInfo.value.phone;
        updateInfoData.value.avatar = userInfo.value.avatar;
        updateInfoData.value.gender = userInfo.value.gender;
        updateInfoData.value.birthday = userInfo.value.birthday.split(' ')[0]; // 提取日期部分
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

// 更新用户信息
const updateUserInfo = async () => {
    try {
        await useUpdateUserInfo(updateInfoData.value);
        showUpdateInfoModal.value = false;
        fetchUserInfo();
        pMessage.success('用户信息更新成功');
        userStore.currentUserInfo.value = userInfo.value;

    } catch (error) {
        console.error('更新用户信息失败:', error);
        pMessage.error('更新用户信息失败，请稍后重试');
    }
};

const updateUser = (item) => {
    console.log(item);
    updateInfoData.value.avatar = item;
}

// 更新用户密码
const updateUserPassword = async () => {
    if (updatePasswordData.value.password !== updatePasswordData.value.password_confirmation) {
        pMessage.error('新密码和确认密码不一致，请重新输入');
        return;
    }
    try {
        await useUpdateUserPassword(updatePasswordData.value);
        showUpdatePasswordModal.value = false;
        pMessage.success('用户密码更新成功');
    } catch (error) {
        pMessage.error('更新用户密码失败，请稍后重试');
    }
};

// 发送验证码
const sendCode = async () => {
    if (countdown.value > 0) return;
    try {
        await useSendCode();
        pMessage.success('验证码已发送，请查收邮箱');
        countdown.value = 60;
        timer = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    } catch (error) {
        pMessage.error('发送验证码失败，请稍后重试');
    }
};

// 更新用户邮箱
const updateUserEmail = async () => {
    try {
        await useUpdateUserEmail(updateEmailData.value);
        showUpdateEmailModal.value = false;
        fetchUserInfo();
        pMessage.success('用户邮箱更新成功');
    } catch (error) {
        pMessage.error('更新用户邮箱失败，请稍后重试');
    }
};

// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
});

// 组件卸载时清除定时器
onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});
</script>


<style lang="scss" scoped>
.user-management {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;

  h1 {
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .user-info {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    p {
      color: #555;
      margin: 0.8rem 0;
      font-size: 1rem;

      strong {
        color: #333;
        margin-right: 0.5rem;
      }
    }

    .action-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 4px;
      margin: 0.5rem 0.5rem 0 0;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #0056b3;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    &-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      h2 {
        color: #333;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      input,
      select {
        width: 100%;
        padding: 0.8rem;
        margin: 0.5rem 0 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s ease;

        &:focus {
          border-color: #007bff;
          outline: none;
        }
      }

      .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;

        button {
          flex: 1;
          padding: 0.8rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;

          &.save-button {
            background: #28a745;
            color: white;

            &:hover {
              background: #218838;
            }
          }

          &.cancel-button {
            background: #6c757d;
            color: white;

            &:hover {
              background: #5a6268;
            }
          }
        }
      }

      .send-code-button {
        width: 100%;
        padding: 0.8rem;
        background: #17a2b8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
          background: #138496;
        }
      }
    }
  }
}
</style>