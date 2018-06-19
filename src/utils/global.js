export default {
  install(Vue) {
    Vue.prototype.yfAlert = function (title, type, options = {}) {
      this.$message({
        type: type || 'info',
        duration: options.duration || 3000,
        message: title
      });
    };
  }
}