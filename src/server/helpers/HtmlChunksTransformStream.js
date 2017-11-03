import {Transform} from 'stream';

export default class HtmlChunksTransformStream extends Transform {
  constructor({transformers}) {
    super();
    this.transformers = transformers;
  }

  _transform(chunk, encoding, callback) {
    const htmlChunk = chunk.toString('utf8');

    const transformedHtmlChunk = this.transformers.reduce(
      (htmlBuffer, transformer) => transformer(htmlBuffer),
      htmlChunk
    );

    if (transformedHtmlChunk !== htmlChunk) {
      chunk = Buffer.from(transformedHtmlChunk, 'utf8');
    }

    this.push(chunk);
    callback();
  };
}