import { createApp } from "vue";
import Message from "./index.vue";

let instance;

const initInstance = () => {
    const messageInstance = createApp(Message);
    // 需要一个容器
    const container = document.createElement("div");
    // 再进行挂载 - 挂载之后返回实例上下文
    instance = messageInstance.mount(container);
    document.body.appendChild(container);
};

function pMessage(option) {
    if (!instance) initInstance();
    if (!option) {
        option = {};
    }
    option = typeof option === "string" ? { content: option } : option;

    instance.state.content = option.content || "这是一个 message";
    instance.state.duration = option.duration || 2000;
    instance.state.type = option.type || "primary";
    instance.open();
}

// 抽象公共逻辑
const createMessageType = (type) => {
    return function (content, duration) {
        return pMessage({
            content,
            duration,
            type,
        });
    };
};

// 自动生成不同类型的消息方法
["success", "error", "warning", "info"].forEach((type) => {
    pMessage[type] = createMessageType(type);
});

pMessage.close = function () {
    if (instance && instance.close) {
        instance.close();
    }
};

export default pMessage;

