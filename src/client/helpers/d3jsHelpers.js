import _ from 'lodash';

export const saveDatum = (container) => {
  _domTraversal(container, (node) => {
    if (node.__data__) {
      let text = JSON.stringify(node.__data__);
      node.setAttribute('data-datum', text);
    }
  });
};

export const restoreDatum = (container = document.body) => {
  let walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, null, false);
  let node;
  let text;
  let data;
  while (node = walker.nextNode()) {
    if (node.getAttribute('data-datum')) {
      text = node.getAttribute('data-datum');
      data = JSON.parse(text);
      node.__data__ = data;
      node.removeAttribute('data-datum');
    }
  }
};

/* eslint-disable no-labels */
function _domTraversal(root, enter, exit = _.noop) {
  let node = root;
  start: while (node) {
    enter(node);
    if (node.firstChild) {
      node = node.firstChild;
      continue start;
    }
    while (node) {
      exit(node);
      if (node === root) {
        node = null;
      }
      else if (node.nextSibling) {
        node = node.nextSibling;
        continue start;
      }
      else {
        node = node.parentNode;
      }
    }
  }
}
/* eslint-enable no-labels */
