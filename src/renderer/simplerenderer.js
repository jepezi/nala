import { readFileSync } from 'fs';
import path from 'path';

function createSimpleRenderer(htmlFileName) {
  const html = readFileSync(path.resolve(__dirname, '..', '..', 'html', htmlFileName), 'utf-8');

  function SimpleRenderer(options) {
    this.html = html
      .replace('__CSS__', options.cssUrl)
      .replace('__VENDOR__', options.vendorUrl)
      .replace('__SCRIPT__', options.scriptUrl)
  }

  SimpleRenderer.prototype.render = function renderSimple(_req, callback) {
    callback(null, null, this.html);
  };

  return SimpleRenderer;
}

module.exports = createSimpleRenderer;
