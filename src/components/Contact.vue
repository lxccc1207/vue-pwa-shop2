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
                <form class="table-right-form">
                    <input type="text" v-model="userName" placeholder="姓名">
                    <input type="text" v-model="email" placeholder="邮箱">
                    <input type="text" v-model="phone" placeholder="电话">
                    <input type="text" v-model="suggest" placeholder="建议">
                    <textarea v-model="content" cols="75" rows="10">写下你想说的...</textarea>
                    <input class="submit" type="submit" @click="submit" value="提交">
                </form>
            </div>
        </div>
    </div> 
  </div>
</template>

<script>
  export default {
    name:'About',
    data () {
      return {
      userName:'',
      email:'',
      phone:'',
      suggest:'',
      content:''
      }
    },
    computed: {
    },
    mounted() {
     
    },
    methods: {
      submit(){
        alert("感谢您的留言！")
        return
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
  @media screen and (max-width :1023px){
    flex-direction :column 
  }
.table-left
  width:500px
  margin:4px 20px 0 100px
  @media screen and (max-width :1023px){
    margin:0 auto
  }
  .public
    width:520px
    height :230px
    position :relative
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
  width:500px
  flex:1
  position :relative
  @media screen and (max-width :1023px){
    min-height :660px
    margin:0 auto
  }
  .table-right-span
    position :absolute
    top:20px
    left:10px
    font-size :20px
    font-weight:700
  .table-right-form
    position :absolute
    top:50px
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

