function createFinalText(links, linkTextType) {
  let textBlock = document.createElement('ul');
  for (let linkId = 0; linkId < links.length; linkId++) {
    let row = document.createElement('li');

    row.appendChild(createTextLinkElement(links[linkId], linkTextType));
    textBlock.appendChild(row);
  }
  return textBlock;
}

const bitbucketProjectPrefixRegex = /https:\/\/bitbucket.org\/[^/]+\//;

function createTextLinkElement(link, linkTextType) {
  let linkElement = document.createElement('a');
  if (linkTextType === 'pullRequestName') {
    linkElement.innerText = link.title;
  } else if (linkTextType === 'repositoryName') {
    linkElement.innerText = buildRepositoryName(link.link);
  } else if (linkTextType === 'repositoryAndPullRequest') {
    linkElement.innerText = buildRepositoryName(link.link) + ': ' + link.title;
  } else {
    linkElement.innerText = link.innerText;
  }
  linkElement.href = link.link;
  return linkElement;
}

function buildRepositoryName(url) {
  return url.replace(bitbucketProjectPrefixRegex, '').replace(/\/.+$/, '');
}