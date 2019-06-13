<!--增加商品路由出口 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">增加商品</a></el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:20px;">
      <el-form ref="addGoodsData" :model="addGoodsData" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="addGoodsData.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="upload-demo"
            action=""
            :auto-upload=false
            :before-remove="beforeRemove"
            :on-change="onchange" 
            :on-exceed="handleExceed"
            :limit="1"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="addGoodsData.productPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input v-model="addGoodsData.limitNum"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="addGoodsData.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div> 
</template>


<script>
import axios from 'axios';
var _ = require('lodash');
  export default {
    name:'addGoods',
    data() {
      return {
        addGoodsData: {
          productName: '',
          productPrice: null,
          limitNum: null,
          desc: ''
        },
        param: "", // 表单要提交的参数
        // src:"",
        fileList: []
      };
    },
    methods: {
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleExceed(files, fileList) {
         this.$message.warning(`只能选择一张图片！`)
      },
      onchange(file,filesList) {
        console.log(file);
        //重新写一个表单上传的方法
        this.param = new FormData();
        this.param.append('file', file.raw, file.name);
      },
      onSubmit() {
         var message = this.addGoodsData;
         //下面append的东西就会到form表单数据的fields中；
         console.log(message)
        this.param.append('productName', message.productName);
        this.param.append('productPrice', message.productPrice);
        this.param.append('limitNum', message.limitNum);
        this.param.append('desc', message.desc);
        let config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          };
        console.log('this.param： '+ this.param)
         axios.post("/api/admin/upLoad", this.param, config).then(function(result) {
            console.log(result);
          })  
      }
    },
    computed: {
    },
    mounted() {
    
    }
  }
</script>
<style lang="stylus" scoped>

</style>

