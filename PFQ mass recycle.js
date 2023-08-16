// ==UserScript==
// @name         Pokefarm Mass Recycle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mass recycle Pokémon from a field
// @author       TotoGPT
// @match        https://pokefarm.com/deltahunt
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isScriptActive = true;

    // Toggle button to enable or disable the script
    let toggleButton = document.createElement('button');
    toggleButton.innerText = 'Stop Recycling';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '60px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.fontSize = '20px'; // Larger font
    toggleButton.style.padding = '10px 20px'; // Larger padding
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', function() {
        isScriptActive = !isScriptActive;
        toggleButton.innerText = isScriptActive ? 'Stop Recycling' : 'Start Recycling';
    });

    // Add a new button to the page for mass recycling
    let massRecycleButton = document.createElement('button');
    massRecycleButton.innerText = 'Start Recycling';
    massRecycleButton.style.position = 'fixed';
    massRecycleButton.style.bottom = '10px';
    massRecycleButton.style.right = '10px';
    massRecycleButton.style.zIndex = '9999';
    massRecycleButton.style.fontSize = '20px'; // Larger font
    massRecycleButton.style.padding = '10px 20px'; // Larger padding
    document.body.appendChild(massRecycleButton);


    function clickSelectPokemonButton(attempt = 1) {
        if (attempt > 3) {  // After 3 failed attempts, restart the entire process
            console.error("Failed to click 'Select Pokémon...' button after 3 attempts. Restarting...");
            startRecyclingProcess();
            return;
        }

        let selectPokemonButton = document.getElementById('hvartrade');
        if (selectPokemonButton && isScriptActive) {
            console.log("Clicking 'Select Pokémon...' button. Attempt:", attempt);
            selectPokemonButton.click();

            setTimeout(() => {
                selectPokemonButton = document.getElementById('hvartrade');
                if (selectPokemonButton && isScriptActive) {
                    console.log("'Select Pokémon...' button still present. Retrying...");
                    clickSelectPokemonButton(attempt + 1);
                }
            }, 300);
        } else {
            console.log("'Select Pokémon...' button not found. Attempt:", attempt);
        }
    }

    function startRecyclingProcess() {
        let allPokemon = document.querySelectorAll('.fieldmon');
        console.log("Total Pokémon found:", allPokemon.length);

        allPokemon.forEach((pokemon, index) => {
            setTimeout(() => {
                if (!isScriptActive) return;

                try {
                    console.log("Trying to click Pokémon:", index);
                    pokemon.click();

                    setTimeout(() => {
                        let selectButton = document.querySelector('.ttfield_commands button');
                        if (selectButton && isScriptActive) {
                            console.log("Clicking select button for Pokémon:", index);
                            selectButton.click();
                        } else {
                            console.log("Select button not found for Pokémon:", index);
                            return;
                        }

                        setTimeout(() => {
                            let acceptButton = document.querySelector('button[type="button"]');
                            if (acceptButton && isScriptActive) {
                                console.log("Clicking accept button for Pokémon:", index);
                                acceptButton.click();
                            } else {
                                console.log("Accept button not found for Pokémon:", index);
                                return;
                            }

                            setTimeout(() => {
                                clickSelectPokemonButton();
                            }, 500);
                        }, 300);
                    }, 300);
                } catch (error) {
                    console.error("Error encountered for Pokémon:", index, error);
                }
            }, index * 300);
        });
    }

    massRecycleButton.addEventListener('click', function() {
        if (!isScriptActive) return;
        startRecyclingProcess();
    });
})();
