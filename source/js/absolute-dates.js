(() => {
  const formatDate = date => new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date).replaceAll('/', '-');

  const showAbsoluteDates = () => {
    document.querySelectorAll('#post-meta time[datetime]').forEach(time => {
      const date = new Date(time.dateTime);
      if (!Number.isNaN(date.getTime())) {
        const formatted = formatDate(date);
        if (time.textContent !== formatted) time.textContent = formatted;
      }
    });
  };

  const main = document.getElementById('main');
  const observer = new MutationObserver(() => showAbsoluteDates());
  if (main) observer.observe(main, { childList: true, subtree: true });
  document.addEventListener('stellar:navigation-complete', showAbsoluteDates);

  const start = () => showAbsoluteDates();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
