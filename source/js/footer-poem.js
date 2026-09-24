(() => {
  const sdkUrl = 'https://sdk.jinrishici.com/v2/browser/jinrishici.js';
  const fallback = '诗句暂加载中...';
  let loading;
  let sentence;

  const show = () => {
    document.querySelectorAll('[data-footer-poem]').forEach(element => {
      element.textContent = sentence || fallback;
    });
  };

  const load = () => {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      if (window.jinrishici?.load) return resolve();
      const script = document.createElement('script');
      script.src = sdkUrl;
      script.async = true;
      script.setAttribute('data-stellar-script', 'core');
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    }).then(() => {
      if (!window.jinrishici?.load) throw new Error('今日诗词 SDK 未就绪');
      window.jinrishici.load(result => {
        const content = result?.data?.content;
        sentence = typeof content === 'string' && content.trim() ? content.trim() : fallback;
        show();
      });
    }).catch(() => {
      sentence = fallback;
      show();
    });
    setTimeout(() => {
      if (!sentence) {
        sentence = fallback;
        show();
      }
    }, 10000);
    return loading;
  };

  const start = () => {
    if (!document.querySelector('[data-footer-poem]')) return;
    load();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  document.addEventListener('stellar:navigation-complete', () => {
    if (sentence || loading) show();
    else start();
  });
})();
