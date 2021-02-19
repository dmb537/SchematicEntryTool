module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: [
      'thebishopfamily.asuscomm.com',
    ],
  },
};
