setTimeout(
    function () {
        let block = findPullRequestsBlock();
        addFloatButton(block);
    }, 100);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "copy_prs") {
        getLinkTextTypeAndCopyToClipboard();
    }
});

function findPullRequestsBlock() {
    let contentBlock = document.querySelector('div[data-testid="Content"]');
    if (contentBlock) {
        const blocks = getChildBlocks(contentBlock);
        return blocks.find(isPullRequestNode);
    } else {
        return null;
    }
}

function isPullRequestNode(element, index, array) {
    let block = getElementByXpath("div/table/thead/tr/th[1]/span", element);
    return block ? (block.innerText === "Your pull requests" || block.innerText === "Мои pull-запросы") : false;
}

function getElementByXpath(path, node) {
    return document.evaluate(path, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getChildBlocks(page) {
    let tempNode = page;
    while (tempNode.childNodes.length <= 2) {
        tempNode = tempNode.childNodes[0];
    }
    return Object.values(tempNode.childNodes);
}


function addFloatButton(targetBlock) {
    if (targetBlock) {
        addTagToBaseElement(targetBlock);
        addButton(targetBlock);
    }
}

function addTagToBaseElement(targetBlock) {
    targetBlock.className += " check-pr-container";
}

function addButton(targetBlock) {
    let input = document.createElement("input");
    input.src = chrome.runtime.getURL("check-pr-copy.png");
    input.type = "image";
    input.className = "btn check-pr-button"
    input.onclick = getLinkTextTypeAndCopyToClipboard;
    targetBlock.appendChild(input);
}

function getLinkTextTypeAndCopyToClipboard() {
    chrome.storage.sync.get({favoriteLinkTextType: 'pullRequestName'}, function (linkTextType) {
        copyToClipboard(linkTextType.favoriteLinkTextType + '');
    });
}

function copyToClipboard(linkTextType) {
    let block = findPullRequestsBlock();
    if (block) {
        let links = getLinks(block);
        let finalText = createFinalText(links, linkTextType).innerHTML;

        function listener(e) {
            e.clipboardData.setData("text/html", finalText);
            e.clipboardData.setData("text/plain", finalText);
            e.preventDefault();
        }

        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
    }
}

function getLinks(block) {
    let tbody = getElementByXpath("div/table/tbody", block);
    if (tbody) {
        let linksCount = tbody.childNodes.length
        let links = [];
        for (let linkId = 0; linkId <= linksCount; linkId++) {
            let linkPath = "div/table/tbody/tr[" + linkId + "]/td[1]/div/div/div/div/div/a";
            let link = getElementByXpath(linkPath, block);
            if (link) {
                links.push(link);
            }
        }
        return links;
    }
    return null
}

function createFinalText(links, linkTextType) {
    let textBlock = document.createElement("ul");
    for (let linkId = 0; linkId < links.length; linkId++) {
        let row = document.createElement("li");

        row.appendChild(createTextLinkElement(links[linkId], linkTextType));
        textBlock.appendChild(row);
    }
    return textBlock;
}

const bitbucketProjectPrefixRegex = /https:\/\/bitbucket.org\/[^/]+\//

function createTextLinkElement(link, linkTextType) {
    let linkElement = document.createElement("a");
    if (linkTextType == 'pullRequestName') {
        linkElement.innerText = link.innerText;
    } else if (linkTextType == 'repositoryName') {
        linkElement.innerText = buildRepositoryName(link.href);
    } else if (linkTextType == 'repositoryAndPullRequest') {
        linkElement.innerText = buildRepositoryName(link.href) + ': ' + link.innerText;
    } else {
        linkElement.innerText = link.innerText;
    }
    linkElement.href = link.href;
    return linkElement
}

function buildRepositoryName(url) {
    return url.replace(bitbucketProjectPrefixRegex, '').replace(/\/.+$/, '');
}

