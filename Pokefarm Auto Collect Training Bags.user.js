// ==UserScript==
// @name         Pokefarm Auto Collect Training Bags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically collect training bags every 20 seconds
// @author       han
// @match        https://pokefarm.com/dojo/training
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function collectBags() {
        let collectButton = document.querySelector('#collectall button');
        if (collectButton) {
            collectButton.click();
        }
    }

    function getRandomWaitTime(min, max) {
        return Math.random() * (max - min) + min;
    }

    setInterval(() => {
        location.reload();
    }, getRandomWaitTime(10000, 15000));  // Random time between 10 and 15 seconds

    setTimeout(collectBags, 1000);
})();