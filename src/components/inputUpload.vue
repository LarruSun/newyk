<template>
  <div class="container">
    <slot name="label"></slot>
    <div class="wei-wrap">
      <div class="wei-upload-wrap" :style="{ 'border': imgUrl ? 'none' : '1px dashed #d9d9d9','min-width':inputWidth + 'px', 'min-height' : inputHeight + 'px'}">
        <i class="el-icon-plus" v-if="!imgUrl"></i>
        <label for="wei">
          <img v-if="imgUrl" :src="imgUrl">
        </label>
        <input v-if="isUpload" type="file" class="wei-upload-file" @change="weiUpload" accept="image/png,image/jpg,image/jpeg,image/bmp">
      </div>
      <slot name="tips"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'inputUpload',
  props: {
    imgUrl: {
      default: ''
    },
    inputWidth: {
      default: 150
    },
    inputHeight: {
      default: 150
    },
    isUpload: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    weiUpload(val) {
      let reader = new FileReader();
      let files = val.target.files
      if(files[0]) {
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
          let imgUrl = reader.result;
          this.$emit('weiUpload', files[0],imgUrl);
        };
      }
    }
  }
}
</script>

<style lang="scss">
.wei-wrap{
  display:flex;
  margin-top:10px;
  align-items: center;
  overflow: hidden;
}
.wei-upload-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  margin-right: 20px;
  &:hover{
    border-color: #e6a23c;
  }
  label{
    position: absolute;
    z-index: 2;
    height:100%;
    img{
      width: initial;
      height: 100%;
    }
  }
  .el-icon-plus{
    font-size: 26px;
    color: #909399;
  }
}
.wei-upload-file{
  opacity: 0;
  position: absolute;
  width: 100%;
  height:100%;
  z-index: 2;
  cursor: pointer;
}
</style>
