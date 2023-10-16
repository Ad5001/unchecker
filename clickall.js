/**
 * Unchecker - Simple extension letting you uncheck all checkboxes on a page
 * Copyright (c) Ad5001 2021-2023
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public License, 
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can 
 * obtain one at http://mozilla.org/MPL/2.0/.
 **/

// This file handles all clicking automaticly all similar buttons (e.g : same text & element name)

const clickAllScript = (targetElementId) => {
    let bound, selectedElements, clickedButton, buttonText, classes, query, sameElements
    // Get the potential selected button
    bound = browser.menus.getTargetElement(targetElementId).getBoundingClientRect()
    selectedElements = document.elementsFromPoint(bound.x+bound.width/2, bound.y+bound.height/2)

    // Leftover debug for positioning
    //console.log(bound, browser.menus.getTargetElement(targetElementId), selectedElements)
    //var div = document.createElement("div"); div.style.background = "black"; div.style.position = "absolute"; 
    //div.style.left = bound.x+bound.width/2-5 +"px"; div.style.top = bound.y+bound.height/2-5 + "px";
    //div.style.width = "10px"; div.style.height = "10px";
    //document.body.appendChild(div);

    selectedElements = selectedElements.filter(x => ["BUTTON","A","INPUT"].indexOf(x.tagName) > -1)
    // If a button is selected
    if(selectedElements.length > 0) {
        clickedButton = selectedElements[0]
        // Gather element that will be used in similar buttons (same text content).
        buttonText = clickedButton.textContent.trim()
        // Find the similar buttons
        query = clickedButton.localName + (clickedButton.tagName == "INPUT" ? "[type=" + clickedButton.type + "]" : "")
        sameElements = document.querySelectorAll(query)
        sameElements = Array.from(sameElements).filter(btn => btn.textContent.trim() == buttonText)
        // Click them automaticly.
        sameElements.forEach(btn => {
            btn.click()
        })
    }
}
// Requires targetElementId to be defined beforehands
const CLICK_ALL_TITLE = "Click all similar buttons"
const CLICK_ALL_MENU_CONTEXTS = ["all"]

function clickAllSimilarButtons(info, tab) {
    browser.scripting.executeScript({
        target: {
            tabId: tab.id,
            frameIds: [ info.frameId ],
        },
        func: clickAllScript,
        args: [ info.targetElementId ]
    })
}

/**
 * Creating menu.
 */

if(browser.menus) { // Not supported on Firefox for Android
    browser.menus.create({
        id: "unchecker-clickall",
        title: CLICK_ALL_TITLE,
        icons: {
            "16": "icons/click.svg",
            "32": "icons/click.svg"
        },
        contexts: CLICK_ALL_MENU_CONTEXTS,
    });

    browser.menus.onClicked.addListener((info, tab) => {
        if(info.menuItemId == "unchecker-clickall")
            clickAllSimilarButtons(info, tab)
    })
}
