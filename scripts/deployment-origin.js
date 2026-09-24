'use strict';

const labels = {
  github: 'GithubPages',
  vercel: 'VercelPages',
};
const origin = process.env.BLOG_DEPLOY_ORIGIN || (process.env.VERCEL === '1' ? 'vercel' : null);
const label = labels[origin] || '未知';

hexo.extend.filter.register('after_render:html', function (html) {
  if (typeof html !== 'string' || !html.includes('data-deployment-origin')) return html;
  return html.replace(/(<span data-deployment-origin(?:="")?>)未知(<\/span>)/g, (_, open, close) =>
    `${open}${label}${close}`);
}, 900);
