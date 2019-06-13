<!--商品列表路由出口 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:20px;">
      <template>
        <el-table
          :data="goodsListData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="productImg"
            label="图片"
            width="180">
            <template slot-scope="scope">
  <!--             <img :src="`static/${scope.row.productImg}`" style="width: 36px;height:36px"> -->
              <img :src="`http://localhost:8080/${scope.row.productImg}`" style="width: 36px;height:36px">
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="productPrice"
            label="价格">
          </el-table-column>
          <el-table-column
            prop="limitNum"
            label="库存">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div> 
</template>


<script>
import axios from 'axios';
var _ = require('lodash');
  export default {
    name:'goodsList',
    data() {
      return {
        goodsListData: []
      };
    },
    methods: {

    },
    computed: {
    },
    mounted() {
      axios.get('/api/admin/getList').then(data => {
        console.log(data)
        if (_.has(data), 'data.data.list') {
          _.forEach(data.data.data.list, (item) => {
            var tempObj = {}
            tempObj.productImg = item.productImg
            tempObj.productName = item.productName
            tempObj.productPrice = item.productPrice
            tempObj.limitNum = item.limit_num
            this.goodsListData.push(tempObj)
          })
        // console.log(this.goodsListData)
        }
      }).catch(r => {
        console.log(r)
      })
    }
  }
</script>
<style lang="stylus" scoped>

</style>

