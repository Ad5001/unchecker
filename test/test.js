/**
 * Unchecker - Simple extension letting you uncheck all checkboxes on a page
 * Copyright (c) Ad5001 2021
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public License, 
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can 
 * obtain one at http://mozilla.org/MPL/2.0/.
 **/
window.addEventListener("load", () => {
    document.querySelectorAll("button[role=toggle]").forEach(button => {
        button.addEventListener("click", () => {
            Array.from(document.querySelectorAll("button[role=toggle]")).filter(btn => btn.name == button.name).forEach(btn => {
                btn.classList.remove("toggled")
            })
            button.classList.add("toggled")
        })
    })
})
