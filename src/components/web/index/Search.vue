<script setup>
import { ref,onMounted,onUnmounted,watch } from 'vue'
import { useHistorySearchStore } from '@/stores';
import Icon from '@/components/global/Icon.vue';
import { useGetTenRecommendGoods } from '@/api/web/goods';

const history = useHistorySearchStore();
const searchHistory = ref([])
const recommend = ref([])
const removeButton = ref(true)
const input = ref()
const emit = defineEmits(['search'])

const changeSearch = () => {
    document.querySelector('.search-recommend').style.display = 'block'
}

// 获取推荐
const getRecommend = async () => {
    const res = await useGetTenRecommendGoods()
    recommend.value = res.data.map(item => item.goods_name)
    searchHistory.value = history.getHistorySearch()
}
getRecommend()

// 清除全部
const clearAllhistory = () => {
    history.clearHistorySearch()
    getRecommend()
}
// 删除单个
const removeHistory = (item) => {
    history.removeHistorySearch(item)
    getRecommend()
}

// 搜索
const toSearch = (item) => {
    if (item) {
        input.value = item
    }
    history.addHistorySearch(input.value)
    if (input.value) {
        emit('search', input.value)
    }
    
}


onMounted(() => {
    document.querySelector('.search-box').addEventListener('mouseleave', (e) => {
        document.querySelector('.search-recommend').style.display = 'none'
    })
})

// onUnmounted(() => {
//     document.querySelector('.search-box').removeEventListener('mouseleave', (e) => {
//         document.querySelector('.search-recommend').style.display = 'none'
//     })
// })

const reload = () => {
    window.location.reload()
}


window.addEventListener('scroll', () => {
    let pageYOffset = document.documentElement.scrollTop
    if (pageYOffset > 500) {
        document.querySelector('.search-container').style.background = 'rgba(255,255,255,0.8)'
    } else {
        document.querySelector('.search-container').style.background = 'none'
    }   
});




</script>
    
<template>
    <div class="search-container">
        <div class="search-icon" @click="reload">
            <img src="../../../assets/no_bg_logo.png" alt="">
        </div>
        <div class="search-box">
            <div class="search-input">
                <input v-model="input" type="text" @click="changeSearch" placeholder="输入宝贝名称" />
                <button type="button" @click="toSearch(null)">搜索</button>
            </div>
            <div class="search-recommend">
                <div v-if="searchHistory.length > 0" class="history">
                    <p>历史搜索</p>
                    <p v-if="removeButton" @click="removeButton = false">
                        <Icon style="margin-right: 5px;" name="clear" size="18"></Icon>
                        清除
                    </p>
                    <p v-else>
                        <span @click="clearAllhistory">清除全部  / </span>
                        <span @click="removeButton = true">/ 完成</span>
                    </p>
                </div>
                <div class="history-list" v-if="searchHistory.length > 0">
                    <div v-for="(item, index) in searchHistory" :key="index" class="history-item">
                        <span>{{item}}</span>
                        <Icon v-if="!removeButton" @click="removeHistory(item)" style="margin-left: 10px;" name="remove" size="18"></Icon>
                    </div>
                </div>

                <div class="recommend">
                    <div>推荐</div>
                    <div class="recommend-list">
                        <div class="recommend-item" @click="toSearch(item)" v-for="item in recommend">{{item}}</div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
.search-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: none;

    .search-icon {
        width: 50px;
        height: 50%;
        border-radius: 50%;
        margin-right: 50px;
        margin-top: 10px;
        cursor: pointer;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .search-box {
        width: 60%;
    }
    .search-input {
        width: 100%;
        height: 50px;
        border: 5px solid #a3a1f1;
        border-radius: 20px;
        display: grid;
        grid-template-columns: 9fr 1fr;
        background: white;
        input {
            border: none;
            border-radius: 18px;
            text-align: left;
            text-indent: 50px;
            font-size: 18px;
        }
        input:focus {
            outline: none;
            border: none;
        }
        button {
            margin-top: 1px;
            margin-right: 1px;
            height: 95%;
            border: none;
            border-radius: 14px;
            background: #a3a1f1;
            font-size: 20px;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background: #8e8dff;
        }
    }
    .search-recommend {
        width: 100%;
        background: white;
        margin-top: -28px;
        border-bottom: 5px solid #a3a1f1;
        border-right: 5px solid #a3a1f1;
        border-left: 5px solid #a3a1f1;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        display: none;
    }
}

.history {
    color: gray;
    margin-left: 20px;
    font-size: medium;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    cursor: default;
    p:nth-child(2) {
        cursor: pointer;
        display: flex;
        margin-right: 10px;
    }
}
.history-list {
    width: 95%;
    display: flex;
    margin-left: 10px;
    flex-wrap: wrap;
}

.history-item {
    display: flex;
    justify-content: space-between;
    margin:2px 5px;
    cursor: pointer;
    border: 1px solid #e1e0f3;
    padding: 0 5px;
    border-radius: 5px;
    color: gray;
    text-wrap: nowrap;
    &:hover {
        color: #8e8dff;
        border: 1px solid #8e8dff;
    }
}

.recommend {
    margin: 10px;
}
.recommend-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
}
.recommend-item {
    margin: 5px;
    cursor: pointer;
    padding: -5px 5px;
    color: gray;
    text-align: center;
    transition: all 0.5s ease;
    &:hover {
        color: #8e8dff;
        background: #e1e0f3;
        border-radius: 5px;
    }

}
</style>