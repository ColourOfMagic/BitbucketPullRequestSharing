function findLinks() {
  let overviewBlock = findOverviewPullRequestsBlock();
  if (overviewBlock) {
    let overviewPageLinks = getOverviewBlockLinks(overviewBlock);
    return convertLinksFromOverview(overviewPageLinks);
  } else {
    let pullRequestsPageLinks = findLinksFromPullRequestsPage();
    return convertLinksFromPullRequest(pullRequestsPageLinks);
  }
}

//  Get Links from "Overview" page
function findOverviewPullRequestsBlock() {
  let contentBlock = document.querySelector('div[data-testid="Content"]');
  let finalChildBlock = getFinalChildBlock(contentBlock);
  if (finalChildBlock) {
    return finalChildBlock.find(isPullRequestNode);
  } else {
    return null;
  }
}

function isPullRequestNode(element) {
  let block = getElementByXpath('div/table/thead/tr/th[1]/span', element);
  return block ? (block.innerText === 'Your pull requests' || block.innerText === 'Мои pull-запросы') : false;
}

function getFinalChildBlock(page) {
  let tempNode = page;
  while (tempNode.childNodes.length <= 2) {
    tempNode = tempNode.childNodes[0];
    if (tempNode === undefined) return null;
  }
  return Object.values(tempNode.childNodes);
}

function getOverviewBlockLinks(block) {
  let tbody = getElementByXpath('div/table/tbody', block);
  if (tbody) {
    let linksCount = tbody.childNodes.length;
    let links = [];
    for (let linkId = 0; linkId <= linksCount; linkId++) {
      let linkPath = `div/table/tbody/tr[${linkId}]/td[1]/div/div/div/div/div/a`;
      let link = getElementByXpath(linkPath, block);
      if (link) {
        links.push(link);
      }
    }
    return links;
  }
  return null;
}

function getElementByXpath(path, node) {
  return document.evaluate(path, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Get Links from "Pull Requests" page
function findLinksFromPullRequestsPage() {
  let tableBlock = getElementByXpath('div/table/tbody',
      document.getElementById('pullrequests'));
  return tableBlock.getElementsByClassName('execute');
}

// Create links
function convertLinksFromOverview(links) {
  return Array.from(links, link => createMessageLink(link.innerText, link.href));
}

function convertLinksFromPullRequest(links) {
  return Array.from(links, link => createMessageLink(link.title, link.href));
}

function createMessageLink(title, link) {
  return {
    title: title,
    link: link,
  };
}