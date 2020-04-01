<template>
  <div id="MyBtn" :class="type==='btn'?'bgc':'text'" :style="{fontSize:fontSize}">
    <slot>
      按钮
    </slot>
  </div>
</template>

<script>
export default {
  name: 'MyBtn',
  props: {
    type: { // 按钮样式
      type: String,
      default: 'btn'
    },
    fontSize: { // 按钮字体大小
      type: String,
      default: '16px'
    }
  },
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style scoped>
  #MyBtn{
    padding: 8px 15px;
    color:rgba(255,255,255,0.7);
    border-radius:4px;
    font-weight:400;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .text:hover{
    background:rgba(255,255,255,0.20);
    cursor: pointer;
  }
  .text:active{
    background:rgba(255,255,255,0.30);
    cursor: pointer;
  }
  .bgc{
    background:rgba(255,255,255,0.15);
  }
  .bgc:hover{
    background:rgba(255,255,255,0.20);
    cursor: pointer;
  }
  .bgc:active{
    background:rgba(255,255,255,0.06);
  }
</style>
