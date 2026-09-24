'use strict';

const labels = {
  github: 'Github Pages',
  Vercel: 'Vercel Pages',
  vercel: 'Vercel Pages',
  huggingface: 'HuggingFace Spaces',
  tencent: 'Tencent Pages',
  cloudflare: 'Cloudflare Pages',
  netlify: 'Netlify Pages',
};
const origin = process.env.BLOG_DEPLOY_ORIGIN;
const label = Object.hasOwn(labels, origin) ? labels[origin] : '未知';

hexo.extend.filter.register('after_render:html', function (html) {
  if (typeof html !== 'string' || !html.includes('data-deployment-origin')) return html;
  return html.replace(/(<span data-deployment-origin(?:="")?>)未知(<\/span>)/g, (_, open, close) =>
    `${open}${label}${close}`);
}, 900);
