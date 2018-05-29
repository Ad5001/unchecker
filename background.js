const UNCHK_SCRIPT = `
function disable_checkboxes(element){
    document.body.querySelectorAll('input[type="checkbox"]').forEach(function(el){
        el.checked = false
    })
}
disable_checkboxes(document.body)
document.body.querySelectorAll('iframe').forEach(function(el){disable_checkboxes(el.contentDocument || el.contentWindow.document)})
`
const CHK_SCRIPT = `
function check_checkboxes(element){
    document.body.querySelectorAll('input[type="checkbox"]').forEach(function(el){
        el.checked = true
    })
}
check_checkboxes(document.body)
document.body.querySelectorAll('iframe').forEach(function(el){check_checkboxes(el.contentDocument || el.contentWindow.document)})
`
const TITLE_APPLY = "Uncheck all checkboxes";
const TITLE_REMOVE = "Check all checkboxes";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

/*
Toggle Script: based on the current title, insert or remove the Script.
Update the page action's title and icon to reflect its state.
*/
function toggleScript(tab) {

  function gotTitle(title) {
    if (title === TITLE_APPLY) {
      browser.browserAction.setIcon({tabId: tab.id, path: "icons/off.svg"});
      browser.browserAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
      browser.tabs.executeScript({
          code: UNCHK_SCRIPT
      });
    } else {
      browser.browserAction.setIcon({tabId: tab.id, path: "icons/on.svg"});
      browser.browserAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
      browser.tabs.executeScript({
          code: CHK_SCRIPT
      });
    }
  }

  var gettingTitle = browser.browserAction.getTitle({tabId: tab.id});
  gettingTitle.then(gotTitle);
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
function protocolIsApplicable(url) {
  var anchor =  document.createElement('a');
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializebrowserAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    browser.browserAction.setIcon({tabId: tab.id, path: "icons/on.svg"});
    browser.browserAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
    browser.browserAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializebrowserAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializebrowserAction(tab);
});

/*
Toggle Script when the page action is clicked.
*/
browser.browserAction.onClicked.addListener(toggleScript);
