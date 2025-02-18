<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { useGetGoodsList } from '@/api/web/goods';
import baseUrl from '@/utils/BaseUrl';
import FloatCard from '@/components/web/index/FloatCard.vue';
import IndexHeader from '@/components/web/index/IndexHeader.vue';

const route = useRoute();
const router = useRouter();

// 表格数据
const tableData = ref([]);
// 当前页码
const currentPage = ref(1);
// 每页显示数量
const perPage = ref(12);
// 搜索关键词
const searchKeyword = ref(route.query.keyword || null);
// 分类 ID
const categoryId = ref(route.query.id || null);
// 排序字段
const sale = ref(false);
// 排序顺序
const price = ref(false);
const comments_count = ref(false);
// 最低价格
const lowPrice = ref(null);
// 最高价格
const highPrice = ref(null);
// 总页数
const totalPages = ref(1);

// 获取商品列表数据
const getData = async () => {
  const params = {
    page: currentPage.value,
    per_page: perPage.value,
    category: categoryId.value,
    goods_name: searchKeyword.value,
    sale: sale.value,
    price: price.value,
    comments_count: comments_count.value,
    low_price: lowPrice.value,
    high_price: highPrice.value
  };
  const res = await useGetGoodsList(params);
  tableData.value = res.data.data;
  totalPages.value = res.last_page;
  console.log(res.data);
};

// 监听路由变化，重新获取数据
watch([() => route.query.id, () => route.query.keyword], () => {
  categoryId.value = route.query.id || '';
  searchKeyword.value = route.query.keyword || '';
  currentPage.value = 1;
  getData();
});

// 搜索商品
const searchGoods = () => {
  currentPage.value = 1;
  getData();
};

// 排序商品
const sortGoods = (field) => {
  if (field === 'comments_count') {
    comments_count.value = true
    sale.value = false;
    price.value = false;
  } else if (field === 'price') {
    price.value = true
    sale.value = false;
    comments_count.value = false;
  } else if (field === 'sale') {
    sale.value = true
    price.value = false;
    comments_count.value = false;
  }

  currentPage.value = 1;
  getData();
};

// 切换页码
const changePage = (page) => {
  currentPage.value = page;
  getData();
};

// 初始化数据
getData();
</script>

<template>
  <IndexHeader />
  <div class="goods-list-container">
    <!-- 搜索框 -->
    <div class="search-section">
      <input v-model="searchKeyword" placeholder="请输入搜索关键词" />
      <button @click="searchGoods">搜索</button>
    </div>
    <!-- 排序按钮 -->
    <div class="sort-section">
      <button @click="sortGoods('comments_count')">按评论数排序</button>
      <button @click="sortGoods('price')">按价格排序</button>
      <button @click="sortGoods('sale')">按销量排序</button>
    </div>
    <!-- 价格区间输入框 -->
    <div class="price-section">
      <input v-model="lowPrice" placeholder="最低价格" />
      <span>-</span>
      <input v-model="highPrice" placeholder="最高价格" />
      <button @click="searchGoods">筛选</button>
    </div>
    <!-- 商品列表 -->
    <div class="goods-card-list">
      <div class="goods-card" v-for="item in tableData" :key="item.id" @click="router.push(`/goods/detail/${item.id}`)">
        <div class="goods-image">
          <img :src="baseUrl + item.cover" alt="商品封面" />
        </div>
        <div class="goods-details">
          <h3 class="goods-name">{{ item.goods_name }}</h3>
          <p class="goods-title">{{ item.title }}</p>
          <div class="goods-meta">
            <span class="goods-price">￥{{ item.price }}</span>
            <span class="goods-comments">评论数: {{ item.comments_count }}</span>
            <span class="goods-stock">库存: {{ item.stock }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <div class="pagination-section">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
    </div>
  </div>
  <FloatCard />
</template>

<style lang="scss" scoped>
.goods-list-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .search-section,
  .sort-section,
  .price-section {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 10px;
      flex: 1;
    }

    button {
      padding: 8px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    }
  }

  .sort-section button {
    margin-right: 10px;
  }

  .price-section span {
    margin: 0 5px;
  }

  .goods-card-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .goods-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .goods-image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .goods-details {
    padding: 15px;
  }

  .goods-name {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .goods-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }

  .goods-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #999;
  }

  .goods-price {
    color: #ff4400;
    font-weight: bold;
  }

  .pagination-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    button {
      padding: 8px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin: 0 5px;

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }
    }

    span {
      margin: 0 10px;
    }
  }
}
</style>