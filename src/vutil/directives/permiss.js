export default {
  inserted(el, binding) {
    !binding.value && el.parentNode && el.parentNode.removeChild(el);
  }
};
