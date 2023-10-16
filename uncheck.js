/**
 * Unchecker - Simple extension letting you uncheck all checkboxes on a page
 * Copyright (c) Ad5001 2021-2023
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public License, 
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can 
 * obtain one at http://mozilla.org/MPL/2.0/.
 **/

const CHECKBOX_QUERY = 'input[type="checkbox"]'

const uncheckAll = () => {
    document.body.querySelectorAll(CHECKBOX_QUERY).forEach(function(el){
        el.checked = false
    })
}

const checkAll = () => {
    document.body.querySelectorAll(CHECKBOX_QUERY).forEach(function(el){
        el.checked = true
    })
}
const TITLE_UNCHECK = "Uncheck all checkboxes"
const TITLE_CHECK = "Check all checkboxes"
const APPLICABLE_PROTOCOLS = ["http:", "https:"]
const MENU_CONTEXTS = ["all"]

/**
 * Toggle Script: based on the current title, insert or remove the Script.
 * Update the page actions title and icon, aswell as the context menu item to reflect its state.
 **/
function toggleScript(tab) {

    function gotTitle(title) {
        console.log(title === TITLE_UNCHECK ? "Unchecking all checkboxes..." : "Checking all checkboxes...")
        if(title === TITLE_UNCHECK) {
            browser.action.setIcon({tabId: tab.id, path: "icons/off.svg"})
            browser.action.setTitle({tabId: tab.id, title: TITLE_CHECK})
            browser.scripting.executeScript({
                func: uncheckAll,
                target: {
                    tabId: tab.id,
                    allFrames: true,
                }
            })
            if(browser.menus)
                browser.menus.update("unchecker-main", {
                    title: TITLE_CHECK,
                    icons: {
                        "16": "icons/off.svg"
                    }
                })
        } else {
            browser.action.setIcon({tabId: tab.id, path: "icons/on.svg"})
            browser.action.setTitle({tabId: tab.id, title: TITLE_UNCHECK})
            browser.scripting.executeScript({
                func: checkAll,
                target: {
                    tabId: tab.id,
                    allFrames: true,
                }
            })
            if(browser.menus)
                browser.menus.update("unchecker-main", {
                    title: TITLE_UNCHECK,
                    icons: {
                        "16": "icons/on.svg"
                    }
                })
        }
    }

    browser.action.getTitle({tabId: tab.id}).then(gotTitle)
}

/**
 * Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
 **/
function protocolIsApplicable(url) {
    let anchor =  document.createElement('a')
    anchor.href = url
    return APPLICABLE_PROTOCOLS.includes(anchor.protocol)
}

/**
 * Initialize the page action set icon and title, then show.
 * Only operates on tabs whose URL's protocol is applicable.
 **/
function initializebrowserAction(tab, createMenu) {
    // console.log("Initializing browser action for tab", tab, createMenu)
    if(protocolIsApplicable(tab.url)) {
        browser.action.setIcon({tabId: tab.id, path: "icons/on.svg"})
        browser.action.setTitle({tabId: tab.id, title: TITLE_UNCHECK})
    }
    if(createMenu && browser.menus) {
        browser.menus.remove("unchecker-main").then(function() {
            browser.menus.create({
                id: "unchecker-main",
                title: TITLE_UNCHECK,
                icons: {
                    "16": "icons/on.svg"
                },
                contexts: MENU_CONTEXTS
            })
        })
    }
}


/**
 * Create the default context menu for the main function.
 */
if(browser.menus) { // Not supported on Firefox for Android
    browser.menus.create({
        id: "unchecker-main",
        title: TITLE_UNCHECK,
        icons: {
            "16": "icons/on.svg"
        },
        contexts: MENU_CONTEXTS
    })
    browser.menus.onClicked.addListener((info, tab) => {
        if(info.menuItemId == "unchecker-main")
            toggleScript(tab)
    })
}

/**
 * When first loaded, initialize the page action for all tabs.
 **/

browser.tabs.query({}).then((tabs) => {
    for(let tab of tabs) {
        initializebrowserAction(tab, false)
    }
});

/**
 * Each time a tab is updated, reset the page browser.action.for that tab.
 **/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializebrowserAction(tab, true)
});

/** 
 * Toggle Script when the page browser.action.is clicked.
 **/
browser.action.onClicked.addListener(toggleScript)


