(() => {
  'use strict';
  const banks = Array.isArray(window.HACHI_VOICEBANKS) ? window.HACHI_VOICEBANKS : [];
  const list = document.querySelector('#voicebank-list');
  const empty = document.querySelector('#voicebank-empty');

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, document.baseURI);
      return ['https:', 'http:'].includes(url.protocol) ||
        (location.protocol === 'file:' && url.protocol === 'file:') ? url.href : '';
    } catch { return ''; }
  }

  function pending(text) {
    const button = element('button', 'voicebank-pending', text);
    button.type = 'button';
    button.disabled = true;
    return button;
  }

  banks.forEach(bank => {
    const row = element('article', 'voicebank-row');
    const artwork = element('div', 'voicebank-artwork');
    artwork.setAttribute('aria-hidden', 'true');
    artwork.append(element('span', 'voicebank-cover-placeholder', '♪'));
    const cover = safeUrl(bank.cover);
    if (cover) {
      const image = element('img', 'voicebank-cover');
      image.alt = '';
      image.loading = 'lazy';
      image.src = cover;
      image.addEventListener('error', () => image.remove());
      artwork.append(image);
    }
    const actions = element('div', 'voicebank-actions');
    const demo = safeUrl(bank.demo);
    if (demo) {
      const audio = element('audio', 'voicebank-audio');
      audio.controls = true;
      audio.preload = 'none';
      audio.src = demo;
      audio.setAttribute('aria-label', `${bank.name} 试听`);
      audio.addEventListener('play', () => {
        list.querySelectorAll('audio').forEach(other => { if (other !== audio) other.pause(); });
      });
      actions.append(audio);
    } else if (bank.placeholder) {
      actions.append(pending('试听待添加'));
    }
    const url = safeUrl(bank.url);
    if (url) {
      const link = element('a', 'voicebank-link', bank.download ? '下载音源 ↓' : '获取音源 ↗');
      link.href = url;
      if (bank.download) {
        link.download = bank.download;
        link.setAttribute('aria-label', `${bank.name}：下载音源压缩包`);
      } else {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${bank.name}：前往配布页面（新窗口）`);
      }
      actions.append(link);
    } else if (bank.placeholder) {
      actions.append(pending('配布待添加'));
    }
    row.append(artwork, element('h3', '', bank.name), actions);
    list.append(row);
  });
  empty.hidden = banks.length > 0;
})();
