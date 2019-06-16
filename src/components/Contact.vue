<!--联系我们-->
<template>
  <div>
    <div class="contain">
        <div class="head">
            <h1>反馈留言</h1>
            <p>好购公司创办于2018年</p>
        </div>
        <div class="content">
            <div class="table-left">
                <div class="public phone">
                    <img class="table-img" src="../../static/phone.png">
                    <span class="table-span">联系电话</span>
                    <p class="table-p1">联系电话：15076002736</p>
                    <p class="table-p2">周一到周五9:00-18:00</p>
                </div>
                <div class="public email">
                    <img class="table-img" src="../../static/email.png">
                    <span class="table-span">联系邮箱</span>
                    <p class="table-p1">414844730@qq.com</p>
                    <p class="table-p2">期待您的来信</p>
                </div>
                <div class="public address">
                    <img class="table-img" src="../../static/address.png">
                    <span class="table-span">联系地址</span>
                    <p class="table-p1">河北省秦皇岛市海港区东北大学</p>
                </div>
            </div>
            <div class="table-right">
                <span class="table-right-span">留言表单</span>
                <el-form class="table-right-form" ref="form" :model="form" label-width="80px">
                  <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="form.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="建议">
                    <el-input type="textarea" :rows="10" v-model="form.suggest"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                  </el-form-item>
                </el-form>
            </div>
        </div>
    </div> 
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    name:'About',
    data () {
      return {
        form: {
          name:'',
          email:'',
          phone:'',
          suggest:''
        }
      }
    },
    computed: {
    },
    mounted() {
     
    },
    methods: {
      onSubmit() {
        var params = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          suggest: this.form.suggest
        }
        axios.post('/api/leaveMsg', params).then(res => {
          alert(res.data.msg)
        }).catch(r => {
          console.log(r)
        })  
      }  
    }
  
  }
</script>
<style lang="stylus" scoped>
.contain
  max-width :1280px
  background :white
  margin:0 auto
.head
  text-align :center
  margin-bottom :30px
  padding:10px 0
  h1
    margin:20px
.content
  display :flex
  // @media screen and (max-width :1023px){
  flex-direction :column 
  // }
.table-left
  // max-width:500px
  width:100vw
  // margin:4px 20px 0 100px
  // @media screen and (max-width :1023px){
  margin:0 auto
  // }
  .public
    max-width:520px
    height :230px
    position :relative
    margin:0 auto
    @media screen and (max-width :1023px){
      width:100vw
    }
    .table-p1
      position :absolute
      left 160px
      top:60px
    .table-p2
      position :absolute
      left 160px
      top:90px
    .table-img
      width:100px
      height:100px
      margin:30px
    .table-span
      position :absolute
      top:20px
      left:160px
      font-size :20px
      font-weight:700
.table-right
  width:100vw
  flex:1
  position :relative
  @media screen and (min-width :1023px){
    padding-left:60px
  }
  // @media screen and (max-width :1023px){
  min-height :660px
  margin:0 auto
  // }
  .table-right-span
    position :absolute
    top:20px
    left:10px
    @media screen and (min-width :1023px){
      left:100px
    }
    font-size :20px
    font-weight:700
  .table-right-form
    position :absolute
    top:65px
    width:70%
    // @media screen and (max-width :360px){
    //   width:50%
    // }
    height:100%
    @media screen and (max-width :1023px){
      display :flex
      flex-direction:column
    }
    input
      float :left
      margin:10px
      height :50px
      width :280px
    textarea
      float :left
      margin:10px
      @media screen and (max-width :1023px){
        display :block
        width:90vw
      }      
    .submit
      float :left
      width:70px
      height :30px
      margin-top:10px 
</style>

