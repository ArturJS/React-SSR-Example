const crypto = require('crypto');
const {OriginalSource} = require('webpack-sources');
const UglifyJS = require('uglify-js');
const Chunk = require('webpack/lib/Chunk');

class AdditionalAssetsWebpackPlugin {
  constructor(options) {
    this.assets = options.assets;
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('additional-assets', (doneCallback) => {
        this.assets.forEach(asset => {
          const sourceCode = _minifyIfNeeded(asset);
          const hashedFileName = _addHash(asset);

          compilation.assets[hashedFileName] = new OriginalSource(
            sourceCode,
            hashedFileName
          );

          // it's necessary to add generated asset into "compilation.getStats().toJson().assetsByChunkName"
          const chunk = new Chunk(asset.name);
          chunk.files = [hashedFileName];
          chunk.ids = [];

          compilation.chunks.push(chunk);
        });

        doneCallback();
      });
    });
  }
}

module.exports = AdditionalAssetsWebpackPlugin;


// private methods

function _addHash({filename, sourceCode}) {
  const hash = crypto.createHash('md5').update(sourceCode).digest('hex');
  return filename.replace('[hash]', hash);
}

function _minifyIfNeeded(asset) {
  let {sourceCode} = asset;

  if (asset.uglifyJs) {
    let options = {};

    if (typeof asset.uglifyJs === 'object') {
      options = asset.uglifyJs;
    }

    sourceCode = UglifyJS.minify(sourceCode, options).code;
  }

  return sourceCode;
}
