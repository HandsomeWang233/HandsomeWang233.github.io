(() => {
  const sdkUrl = 'https://sdk.jinrishici.com/v2/browser/jinrishici.js';
  const storageKey = 'footer-poem:current-tab:v1';
  const loadingText = '诗句暂加载中...';
  const errorText = '诗句暂不可用';
  let sentence;
  let failed = false;
  let loading;
  let timer;

  try {
    if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
      sessionStorage.removeItem(storageKey);
    } else {
      const cached = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (cached?.status === 'success' && typeof cached.content === 'string' && cached.content.trim()) {
        sentence = cached.content;
      } else if (cached?.status === 'error') {
        failed = true;
      }
    }
  } catch {
    // Storage may be disabled; within-document navigation still reuses this instance.
  }

  const remember = () => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(sentence
        ? { status: 'success', content: sentence }
        : { status: 'error' }));
    } catch {
      // Storage is optional.
    }
  };

  const show = () => {
    const text = sentence || (failed ? errorText : loadingText);
    document.querySelectorAll('[data-footer-poem]').forEach(element => {
      if (element.textContent !== text) element.textContent = text;
    });
  };

  const finish = content => {
    if (sentence || failed) return;
    clearTimeout(timer);
    sentence = typeof content === 'string' && content.trim() ? content.trim() : null;
    failed = !sentence;
    remember();
    show();
  };

  const load = () => {
    if (sentence || failed || loading) return;
    timer = setTimeout(() => finish(null), 10000);
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
      if (failed) return;
      if (!window.jinrishici?.load) throw new Error('今日诗词 SDK 未就绪');
      window.jinrishici.load(result => finish(result?.data?.content), () => finish(null));
    }).catch(() => finish(null));
  };

  const start = () => {
    if (!document.querySelector('[data-footer-poem]')) return;
    show();
    load();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  document.addEventListener('stellar:navigation-complete', start);
})();
