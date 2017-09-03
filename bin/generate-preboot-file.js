const {getInlineCode} = require('preboot');
const fs = require('fs');
const path  = require('path');

const prebootOptions = {
  appRoot: 'body',
  freeze: false,
  focus: true,
  buffer: true,
  keyPress: true,
  buttonPress: true
};

const fileData = `
/* DO NOT MODIFY AUTO GENERATED FILE */
/* for details see also generate-preboot-file.js */
/* eslint-disable */
${getInlineCode(prebootOptions)}
/* eslint-enable */
`;

fs.writeFileSync(
  path.resolve(__dirname, '../src/client/prebootInit.js'),
  fileData
);
