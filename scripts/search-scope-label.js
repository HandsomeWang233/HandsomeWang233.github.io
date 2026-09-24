'use strict';

hexo.extend.filter.register('template_locals', function (locals) {
  const translate = locals.__;
  if (typeof translate !== 'function' || locals.page?.lang !== 'zh-CN') return;
  locals.__ = (key, ...args) => key === 'search.scope_blog' ? '文章' : translate(key, ...args);
}, 20);
