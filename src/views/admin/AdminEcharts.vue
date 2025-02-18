<script setup>
import { ref, onMounted } from 'vue'
import { getNowUserInfo } from '@/api/admin/user'
import BaseUrl from "@/utils/BaseUrl.js";
import Icon from '@/components/global/Icon.vue';
import * as echarts from 'echarts';
import { useGetNoticeList } from '@/api/admin/inform'
import { formatTime } from '@/utils/timeUtils';

const CurrentUserInfo = ref({})
const infoData = ref([])
// 获取用户信息
const getUserInfo = async () => {
  const res = await getNowUserInfo()
  CurrentUserInfo.value = res.data

}

// 获取通知列表
const getInfoData = async () => {
  const res = await useGetNoticeList()
  infoData.value = res.data
  console.log(infoData.value);

}
getInfoData()
getUserInfo()
// 饼图
const setPie = () => {

  let chartDom = document.querySelector('#pie');
  let myChart = echarts.init(chartDom);
  let option;

  option = {
    legend: {
      top: 'bottom'
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 250],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' }
        ]
      }
    ]
  };

  option && myChart.setOption(option);

}

// 折线图
const setLine = () => {

  let chartDom = document.querySelector('#line');
  let myChart = echarts.init(chartDom);
  let option;

  option = {
    color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
    title: {
      text: 'Gradient Stacked Area Chart'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Line 1',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [140, 232, 101, 264, 90, 340, 250]
      },
      {
        name: 'Line 2',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(0, 221, 255)'
            },
            {
              offset: 1,
              color: 'rgb(77, 119, 255)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [120, 282, 111, 234, 220, 340, 310]
      },
      {
        name: 'Line 3',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)'
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [320, 132, 201, 334, 190, 130, 220]
      },
      {
        name: 'Line 4',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 0, 135)'
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [220, 402, 231, 134, 190, 230, 120]
      },
      {
        name: 'Line 5',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 191, 0)'
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [220, 302, 181, 234, 210, 290, 150]
      }
    ]
  };

  option && myChart.setOption(option);

}

// 柱状图
const setBar = () => {

  let chartDom = document.querySelector('#bar');
  let myChart = echarts.init(chartDom);
  let option;

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['Evaporation', 'Precipitation', 'Temperature']
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Precipitation',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml'
        }
      },
      {
        type: 'value',
        name: 'Temperature',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} °C'
        }
      }
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          }
        },
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
        ]
      },
      {
        name: 'Precipitation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          }
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
        ]
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' °C';
          }
        },
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      }
    ]
  };

  option && myChart.setOption(option);

}

onMounted(() => {
  setPie()
  setLine()
  setBar()
})
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="introduce">
        <div class="introduce-left">
          <img class="introduce-img" :src="BaseUrl + CurrentUserInfo.avatar" alt="">
          <div class="introduce-text">
            <h1>{{ CurrentUserInfo.name }}, 今天又是充满活力的一天!</h1>
            <h5>Womeik商城欢迎您!</h5>
            <span></span>
          </div>
        </div>
        <div class="introduce-right">
          <div class="introduce-right-item">
            <p>今日订单</p>
            <p>0</p>
          </div>
          <div class="introduce-right-item">
            <p>待办事务</p>
            <p>0</p>
          </div>
          <div class="introduce-right-item">
            <p>未读消息</p>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="color-card">
        <div class="color-card-item" style="background-image: linear-gradient(to bottom right, #F44886, #C7509F);">
          <div>
            <p>访问量</p>
            <p>
              <Icon name="view" size="50"></Icon>
            </p>
          </div>
          <div>0</div>
        </div>
        <div class="color-card-item" style="background-image: linear-gradient(to bottom right, #8C53BA, #5F37AF);">
          <div>
            <p>成交额</p>
            <p>
              <Icon name="money3" size="50"></Icon>
            </p>
          </div>

          <div>0</div>
        </div>
        <div class="color-card-item" style="background-image: linear-gradient(to bottom right, #43C7EF, #6F9CE0);">
          <div>
            <p>用户数</p>
            <p>
              <Icon name="users-three" size="50"></Icon>
            </p>
          </div>

          <div>0</div>
        </div>
        <div class="color-card-item" style="background-image: linear-gradient(to bottom right, #FFBE47, #FF895C);">
          <div>
            <p>商品数</p>
            <p>
              <Icon name="goods-train" size="50"></Icon>
            </p>
          </div>
          <div>0</div>
        </div>
      </div>
    </div>
    <div class="echarts">
      <div class="card echart" id="pie" style="width: 98%;"></div>
      <div class="card echart" id="line" style="width: 98%;"></div>
    </div>
    <div class="echarts" style="margin-bottom: 50px;">
      <div class="card echart" id="bar" style="width: 98%;"></div>
      <div class="card echart" style="width: 98%;">
        <header class="notice-header">最近通知</header>
        <div class="notice-list">
          <div class="notice-item" v-for="(item, index) in infoData" :key="item.id">
            <div>
              <img :src="BaseUrl + item.user.avatar" alt="">
            </div>
            <div>
              <div class="notice-item-title">{{ item.title }}</div>
              <div class="author">{{ item.user.name }}</div>
              <div class="time">{{ formatTime(item.time) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  // 隐藏滚动条
  &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Edge
    }

  & {
    -ms-overflow-style: none; // IE, Edge
    scrollbar-width: none; // Firefox
  }
}



.card {
  width: 97%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ffffff;
  border-radius: 10px;
  background: white;
  margin: 0 auto;
  box-shadow: 0 0 5px #dadada;
  margin-bottom: 10px;
}

.introduce {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .introduce-left {
    display: flex;
    justify-content: space-around;

    .introduce-text {
      text-align: left;
      margin-left: 20px;

      h1 {
        font-size: 30px;
      }

      h5 {
        color: gray;
      }

    }

    .introduce-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-top: 15px;
    }
  }

  .introduce-right {
    display: flex;
    text-align: center;

    .introduce-right-item {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #f5f5f5;
      margin-left: 10px;

      p {
        margin: 0;
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}

.color-card {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;

  .color-card-item {
    height: 100px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;

    div:nth-child(1) {
      color: #ffffff;
      font-size: large;
      margin-left: 10px;
      margin-top: -8px;
      text-align: center;
    }

    div:nth-child(2) {
      color: #ffffff;
      font-size: 50px;
      margin: 20px 20px;
      text-align: center;
    }
  }

}

.echarts {
  width: 97%;
  padding: 10px 0;
  margin: 10px 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 27px;

  .echart {
    height: 500px;
  }

}

.notice-header {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #dadada;
  padding-bottom: 10px;

}

.notice-list {
  width: 90%;
  height: calc(100% - 100px);
  margin-top: 20px;

  .notice-item {
    display: flex;
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100px;
    border-bottom: 1px solid #dadada;
    position: relative;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
      margin-left: 10px;
      object-fit: cover;
    }

    .time {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: gray;
      font-size: 12px;
    }

    .author {
      font-size: 14px;
      color: gray;
      margin-left: 20px;
    }

    .notice-item-title {
      font-size: 16px;
      font-weight: bold;
      color: #000000;
      line-height: 30px;
      font-size: large;
      margin-left: 20px;
    }
  }
}
</style>
