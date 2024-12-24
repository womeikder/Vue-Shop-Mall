import { createApp } from "vue";
import Loading from "./index.vue";

let instance;
let containerElement;

// 创建组件的初始化容器
const initInstance = () => {
    const messageInstance = createApp(Loading);
    const container = document.createElement("div");
    instance = messageInstance.mount(container);
    return container;
};

// 调用open方法
function pLoading() {
    if (!instance) {
        // 初始化一个组件添加到元素中
        containerElement = initInstance();
        document.body.appendChild(containerElement);
    }
}

// 关闭方法
pLoading.close = function () {
    if (containerElement) {
        // 移除这个元素
        document.body.removeChild(containerElement);
        containerElement = null;
        instance = null;
    }
};

export default pLoading;
