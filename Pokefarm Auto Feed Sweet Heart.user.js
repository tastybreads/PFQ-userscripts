// ==UserScript==
// @name         Pokefarm Auto Feed Sweet Heart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically feed Sweet Heart to Pokémon in daycare
// @author       han
// @match        https://pokefarm.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const DAYCARE_URL = "https://pokefarm.com/daycare";
    const SUMMARY_URL_PREFIX = "https://pokefarm.com/summary/";

    function findElementByText(text, element = document) {
        return Array.from(element.querySelectorAll('label, span, button')).find(el => el.textContent.includes(text));
    }

    function clickUseAnotherIfRequired(pid) {
        let happinessElement = document.querySelector('.happy');
        if (happinessElement) {
            let happiness = parseInt(happinessElement.innerText.trim().replace('%', ''));
            if (happiness < 91) {
                let useAnotherButton = findElementByText("Use another");
                if (useAnotherButton) {
                    useAnotherButton.click();
                    console.log(`Clicked 'Use another' button for Pokémon ${pid}.`);
                }
            }
        }
    }

    if (window.location.href === DAYCARE_URL) {
        console.log("Script running on daycare page.");

        let pokemonElements = document.querySelectorAll('div[data-pid]');
        pokemonElements.forEach(pokemon => {
            let happinessElement = pokemon.querySelector('.happy');
            if (happinessElement) {
                let happiness = parseInt(happinessElement.innerText.trim().replace('%', ''));
                if (happiness < 91) {
                    let pid = pokemon.getAttribute('data-pid');
                    GM_setValue(pid, true); // Mark this Pokémon for feeding
                    console.log(`Marked Pokémon ${pid} for feeding.`);
                }
            }
        });
    } else if (window.location.href.startsWith(SUMMARY_URL_PREFIX)) {
        // On a Pokémon's summary page
        let pid = window.location.href.replace(SUMMARY_URL_PREFIX, '');
        console.log(`Checking if Pokémon ${pid} is marked for feeding...`);
        if (GM_getValue(pid, false)) {
            console.log(`Pokémon ${pid} is marked for feeding. Attempting to feed Sweet Heart.`);

            let useAnotherButton = findElementByText("Use another");
            if (useAnotherButton) {
                setInterval(() => clickUseAnotherIfRequired(pid), 4000); // Check every 4 seconds
            } else {
                // If "Use another" button is not present, go through the initial process
                // Open the inventory menu
                let menuIcon = document.querySelector('.menu_icon');
                if (menuIcon) {
                    menuIcon.click();

                    setTimeout(() => {
                        // Select "Give Item"
                        let giveItemLabel = document.querySelector('label[data-menu="giveitem"]');
                        if (giveItemLabel) {
                            giveItemLabel.click();

                            setTimeout(() => {
                                // Select "Consumables"
                                let consumablesLabel = findElementByText("Consumables");
                                if (consumablesLabel) {
                                    consumablesLabel.click();

                                    setTimeout(() => {
                                        // Click on the "Sweet Heart" item
                                        let giveButton = document.querySelector('button[data-selectitem="286"]');
                                        if (giveButton) {
                                            giveButton.click();

                                            setTimeout(() => {
                                                // Click the "Use the item" button
                                                let useItemButton = findElementByText("Use the item");
                                                if (useItemButton) {
                                                    useItemButton.click();
                                                    setInterval(() => clickUseAnotherIfRequired(pid), 4000); // Check every 4 seconds
                                                }
                                            }, 2000);
                                        }
                                    }, 2000);
                                }
                            }, 2000);
                        }
                    }, 2000);
                }
            }
        } else {
            console.log(`Pokémon ${pid} is not marked for feeding.`);
        }

        // Refresh the Pokémon's summary page every 60 seconds
        setTimeout(() => {
            location.reload();
        }, 60000);
    }
})();
