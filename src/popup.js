const copyCommand = 'copy_prs';

const copyBtn = document.getElementById('copy');
const linkTextTypeElement = document.getElementById('linkTextType');
const statusElement = document.getElementById('status');

// Saves options to chrome.storage
function save_options() {
  const linkTextType = linkTextTypeElement.value;
  chrome.storage.sync.set({favoriteLinkTextType: linkTextType}, () => setStatusMessage('Options saved.'));
}

// Restores select box and checkbox state using the preferences stored in chrome.storage
function restore_options() {
  // Use default value linkTextType = 'Pull Request Name'.
  chrome.storage.sync.get(
      {favoriteLinkTextType: 'pullRequestName'},
      function(items) {linkTextTypeElement.value = items.favoriteLinkTextType;},
  );
}

function setStatusMessage(message) {
  statusElement.innerText = message;
}

// Events
document.addEventListener('DOMContentLoaded', restore_options);
copyBtn.addEventListener('click', sendCopyEvent);
linkTextTypeElement.addEventListener('change', save_options);

function sendCopyEvent() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, copyCommand, () => setStatusMessage('Copied !'));
  });
}

chrome.commands.onCommand.addListener(function(command) {
  if (command === copyCommand) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, command);
    });
  }
});