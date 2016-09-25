export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

export function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector);
}

export function parent(element, tagName) {
  if (!element.parentNode) {
    return;
  }

  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }

  return parent(element.parentNode, tagName);
}

export function on(target, type, cb, useCapture) {
  target.addEventListener(type, cb, !!useCapture);
}

export function delegate(target, selector, type, handler) {
  const dispatchEvent = event => {
    const targetElement = event.target;
    const potentialElements = qsa(selector, target);
    const hasMatch = Array.from(potentialElements).includes(targetElement);

    if (hasMatch) {
      handler.call(targetElement, event);
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/Events/blur
  const useCapture = type === 'blur' || type === 'focus';

  on(target, type, dispatchEvent, useCapture);
}

// export function _findID () => {
//
// }
