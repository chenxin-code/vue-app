const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

//生产打包删除console.log
const plugins = [];
if (IS_PROD) {
  plugins.push('transform-remove-console');
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins
};
