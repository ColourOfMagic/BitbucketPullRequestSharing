// Set extension actions
setTimeout(
    function() {
      let block = findOverviewPullRequestsBlock();
      addFloatButton(block);
    }, 100);

chrome.runtime.onMessage.addListener(function(request) {
  if (request === 'copy_prs') {
    getLinkTextTypeAndCopyToClipboard();
  }
});

function getLinkTextTypeAndCopyToClipboard() {
  chrome.storage.sync.get({favoriteLinkTextType: 'pullRequestName'}, function(linkTextType) {
    copyToClipboard(linkTextType.favoriteLinkTextType + '');
  });
}

function copyToClipboard(linkTextType) {
  let links = findLinks();
  if (links !== undefined && links.length > 0) {
    let finalText = createFinalText(links, linkTextType).innerHTML;

    function listener(e) {
      e.clipboardData.setData('text/html', finalText);
      e.clipboardData.setData('text/plain', finalText);
      e.preventDefault();
    }

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }
}

// Add button
function addFloatButton(targetBlock) {
  if (targetBlock) {
    addTagToBaseElement(targetBlock);
    addButton(targetBlock);
  }
}

function addTagToBaseElement(targetBlock) {
  targetBlock.className += ' check-pr-container';
}

function addButton(targetBlock) {
  let input = document.createElement('input');
  input.src = chrome.runtime.getURL('check-pr-copy.png');
  input.type = 'image';
  input.className = 'btn check-pr-button';
  input.onclick = getLinkTextTypeAndCopyToClipboard;
  targetBlock.appendChild(input);
}
