<template>
  <div id="font">
    <!-- 字体筛选 -->
    <div class="font-box">
      <div class="font-top">
        <ul class="btn">
          <li>
            <el-button :style="{color:fontObj.fill}" type="text" @click="colorOpen = !colorOpen;bgColorOpen=false">A</el-button>
          </li>
          <li>
            <el-button :class="{'is_check':fontObj.fontWeight == 'bold'}" type="text" @click="updateCanvas('fontWeight', 'bold')">B</el-button>
          </li>
          <li>
            <el-button :class="{'is_check':fontObj.fontStyle == 'italic'}" type="text" style="font-style: italic" @click="updateCanvas('fontStyle', 'italic')">I</el-button>
          </li>
          <li>
            <el-button :class="{'is_check':fontObj.underline == 'underline',underline:fontObj.underline == 'underline'}" type="text" @click="updateCanvas('underline', 'underline')">U</el-button>
          </li>
          <li>
            <el-button class="bgcolor-btn" :style="{backgroundColor:fontObj.bgColor,color:'#000000'}" type="text" @click="bgColorOpen = !bgColorOpen;colorOpen = false">A</el-button>
            <!-- <i class="coloe-btn" :style="{backgroundColor:fontObj.bgColor,color:'#000000'}" @click="bgColorOpen = !bgColorOpen;colorOpen = false">A</i> -->
          </li>
          <li>
            <el-select v-model="fontObj.fontSize" style="top:0px" :clearable="false" size="mini" @change="updateCanvas(fontObj.fontSize)">
              <el-option
                v-for="item in fontSizes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </li>
        </ul>
      </div>
      <div v-if="bgColorOpen" class="font-bottom">
        <ul>
          <li
            v-for="(color, index) in bgcolorList"
            :key="index"
            :class="{'active':color==fontObj.bgColor}"
            @click="updateCanvas('bgColor', color)"
          >
            <template v-if="color==='transparent'"><p style="position:relative;display:inline-block;width:12px;height:12px;margin-right:10px"><span style="position:absolute;top:-9px;border:0 none;color:#ffffff;font-size:12px;"><svg-icon icon-class="wuyanse" /></span></p></template>
            <template v-else><span :style="{background:color}" /></template>
          </li>
        </ul>
      </div>
      <div v-if="colorOpen" class="font-bottom">
        <ul>
          <li
            v-for="(color, index) in colorList"
            :key="index"
            :class="{'active':color==fontObj.fill}"
            @click="updateCanvas('fill', color)"
          >
            <span :style="{background:color}" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Dont',
  data() {
    return {
      // fontObj: {
      //   fontWeight: '',
      //   fontStyle: '',
      //   underline: false,
      //   fontSize: '24',
      //   fill: '#000000'
      // },
      fontSizes: [
        {
          value: '12',
          label: '12'
        },
        {
          value: '14',
          label: '14'
        },
        {
          value: '18',
          label: '18'
        },
        {
          value: '24',
          label: '24'
        },
        {
          value: '36',
          label: '36'
        },
        {
          value: '48',
          label: '48'
        },
        {
          value: '64',
          label: '64'
        },
        {
          value: '72',
          label: '72'
        },
        {
          value: '96',
          label: '96'
        }
      ],
      colorList: [
        '#F80000',
        '#00C1FF',
        '#6FEB00',
        '#FFEC00',
        '#7A7A7A',
        '#000000'
      ],
      bgcolorList: [
        'transparent',
        '#ffffff',
        '#F80000',
        '#00C1FF',
        '#6FEB00',
        '#FFEC00',
        '#7A7A7A'
      ],
      colorOpen: false,
      bgColorOpen: false
      // default_color: '#F80000',
      // child: null,
      // underline: false,

    }
  },
  computed: {
    ...mapState({
      fontObj: state => state.fontObj
    })
  },
  watch: {
  },
  created() {},
  mounted() {},
  methods: {
    updateCanvas(type, mes) {
      if (type === 'fontWeight') { // 字体加粗
        if (this.fontObj.fontWeight) {
          this.fontObj.fontWeight = ''
        } else {
          this.fontObj.fontWeight = mes
        }
      }
      if (type === 'fontStyle') {
        if (this.fontObj.fontStyle) {
          this.fontObj.fontStyle = ''
        } else {
          this.fontObj.fontStyle = mes
        }
      }
      if (type === 'underline') {
        if (this.fontObj.underline) {
          this.fontObj.underline = ''
        } else {
          this.fontObj.underline = mes
        }
      }
      if (type === 'fontSize') { // 字号
        this.fontObj.fontSize = mes
      }
      if (type === 'fill') { // 字体颜色
        this.fontObj.fill = mes
        this.colorOpen = !this.colorOpen
      }
      if (type === 'bgColor') { // 字体颜色
        this.fontObj.bgColor = mes
        this.bgColorOpen = !this.bgColorOpen
      }
      this.$store.dispatch('fontObj', this.fontObj)
    }
  }
}
</script>

<style scoped lang='scss'>
  .font-box {
    /*background:rgba(255,255,255,0.12);*/
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
    }
    .font-top {
      height: 34px;
      margin-left: 10px;
      margin-right: 10px;
      .btn {
        // height: 34px;
        line-height: 39px;
        button {
          color:rgba(255,255,255,1);
          font-size: 14px;
          margin-right: 14px;
        }
        .bgcolor-btn{
          line-height: 1px;
          width: 14px;
          border-radius: unset;
        }
      }
      /deep/ .el-input__inner {
        width:57px;
        height:20px;
        background:rgba(255,255,255,0.24);
        border-radius:1px;
        font-weight:500;
        color:rgba(255,255,255,1);
        border: 0 none;
      }
      .underline {
        /deep/ span {
          border-bottom: 1px solid #333333;
          display: inline-block;
        }
      }
      /deep/ .is_check {
        span {
          color: #009AFF;
        }
        &.underline {
          span {
            border-bottom: 1px solid #009AFF;
          }
        }
      }
    }
    .font-bottom {
      height: 34px;
      line-height: 34px;
      margin-left: 10px;
      margin-right: 10px;
      span {
        display: inline-block;
        margin-right: 10px;
        width: 12px;
        height: 12px;
        padding: 0;
        border-radius: 0;
      }
      .active {
        span {
          border: 1px solid rgba(51, 51, 51, 1);
        }
      }
    }
  }
</style>
