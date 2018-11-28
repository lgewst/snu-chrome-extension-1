window.addEventListener ?
  window.addEventListener('blur', blurHappened, true)
  : window.attachEvent('onfocusout', blurHappened);

function blurHappened() {
    chrome.runtime.sendMessage({
        request: 'reload'
      });
}