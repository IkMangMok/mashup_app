<template>
    <div class="sidebar-container">
        <div class="action-box" @click="toggleDropdown('导航')">
            <div class="header-text">导航</div>
            <div v-if="currentDropdown === '导航'" class="dropdown">
                <div class="dropdown-item" @click="sendInfo('在上海，从同济大学嘉定校区导航到同济大学四平路校区')">在上海，从同济大学嘉定校区导航到同济大学四平路校区</div>
                <div class="dropdown-item" @click="sendInfo('在南京，从夫子庙导航到高淳')">在南京，从夫子庙导航到高淳</div>
            </div>
        </div>
        <div class="action-box" @click="toggleDropdown('火车票查询')">
            <div class="header-text">火车票查询</div>
            <div v-if="currentDropdown === '火车票查询'" class="dropdown">
                <div class="dropdown-item" @click="sendInfo('查询2023-10-28，从北京到上海的火车票')">🚄 查询2023-10-28，从北京到上海的火车票</div>
                <div class="dropdown-item" @click="sendInfo('在2023-10-29，从上海坐高铁到郑州')">🚄 在2023-10-29，从上海坐高铁到郑州</div>
            </div>
        </div>
        <div class="action-box" @click="toggleDropdown('景点查询')">
            <div class="header-text">景点查询</div>
            <div v-if="currentDropdown === '景点查询'" class="dropdown">
                <div class="dropdown-item" @click="sendInfo('查询北京的热门景点')">🏯 查询北京的热门景点</div>
                <div class="dropdown-item" @click="sendInfo('查询上海的旅游攻略')">🌆 查询上海的旅游攻略</div>
            </div>
        </div>

        <div class="action-box" @click="toggleDropdown('天气查询')">
            <div class="header-text">天气查询</div>
            <div v-if="currentDropdown === '天气查询'" class="dropdown">
                <div class="dropdown-item" @click="sendInfo('查询北京的天气')">☀️ 查询北京的天气</div>
                <div class="dropdown-item" @click="sendInfo('查询上海的天气')">⛈️ 查询上海的天气</div>
            </div>
        </div>
        <div class="action-box" @click="toggleDropdown('自定义语句')">
            <div class="header-text">自定义语句</div>
            <div v-if="currentDropdown === '自定义语句'" class="dropdown">
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/services/emitter';
export default {
    data() {
        return {
            currentDropdown: false, // 当前展开的下拉框
        };
    },
    methods: {
        toggleDropdown(name) {
            console.log(name)
            if (this.currentDropdown === name) {
                this.currentDropdown = null;
            } else {
                this.currentDropdown = name;
            }
        },
        sendInfo(info) {
            // 根据info的值执行相应的操作
            console.log(info);
            this.currentDropdown = null; // 关闭下拉框
            EventBus.emit('triggerHandleUserInput', info);
        }
    }
}



</script>

<style>

.sidebar-container {
    background-color: rgba(255, 255, 255, 0.8);  /* 将背景色调为半透明的白色 */
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    width: 250px;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column; /* 这将帮助确保内容按预期的顺序排列 */
}

.action-box {
    background-color: #FFFFFF;
    margin-bottom: 10px;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.action-box:hover {
    background-color: #f0f0f0;
}

.dropdown {
  
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.header-text {
    color: #333;   /* 调整标题文本颜色为深灰色 */
    font-weight: bold;  /* 加粗文本 */
    padding-bottom: 5px; /* 与下面的内容添加间距 */
    border-bottom: 1px solid #e0e0e0; /* 为文本添加底部边框，这样可以更清晰地区分标题和内容 */
    margin-bottom: 5px; /* 为文本底部添加间距 */
}

.dropdown-item {
    color: #666;   /* 调整下拉菜单项文本颜色为中灰色 */
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.dropdown-item:hover {
    background-color: #f0f0f0;
}

</style>
