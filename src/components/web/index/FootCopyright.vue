<script setup>

</script>

<template>
    <div class="footer">
        <div class="footer-content">
            <div>
                <ul>
                    <li>规则协议</li>
                    <li>平台服务协议</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>新手上路</li>
                    <li>商家服务</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>付款方式</li>
                    <li>快捷支付</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>商城特色</li>
                    <li>官方客服</li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            <p>Copyright © 2025 <span>www.mall.com</span> All Rights Reserved.</p>
        </div>
        <div class="about">
            <p>
                <span>关于我们</span>
                <span>招贤纳士</span>
                <span>商务合作</span>
                <span>寻求报道</span>
                <span>19812914156</span>
                <span>2184567623@qq.com</span>
                <span>在线客服</span>
                <span>工作时间8:30-22:00</span>

            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.footer {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    margin-top: 50px;
    padding: 20px 0;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.footer-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    ul {
        list-style: none;
        li {
            margin: 0 10px;
            line-height: 30px;
        }
    }
}
.about {
    margin-top: 20px;
    p {
        span {
            margin: 0 10px;
        }
    }
}
</style>