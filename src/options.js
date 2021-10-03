// Saves options to chrome.storage
function save_options() {
  var linkTextType = document.getElementById('linkTextType').value;
  chrome.storage.sync.set({
    favoriteLinkTextType: linkTextType
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.TextTypeContent = 'Options saved.';
    //   setTimeout(function() {
    //     status.TextTypeContent = '';
    //   }, 2750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value linkTextType = 'Pull Request Name'.
  chrome.storage.sync.get({
    favoriteLinkTextType: 'pullRequestName'
  }, function (items) {
    document.getElementById('linkTextType').value = items.favoriteLinkTextType;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
