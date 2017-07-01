module.exports = {
  plugins: [
    require('postcss-easy-import')({prefix: '_'}), // keep this first
    require('autoprefixer')({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ]
    }) // so imports are auto-prefixed too
  ]
};
