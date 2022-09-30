// ==UserScript==
// @name         Gather Teleport
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.gather.town/app/*
// @icon         https://www.google.com/s2/favicons?domain=gather.town
// @grant        none
// ==/UserScript==

;(function () {
    'use strict'

    // Modified from source: https://gist.github.com/silvester-pari/763efb2be9748d71a96d74d284604ced

    const teleportIcon =
        '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="people-arrows" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-people-arrows fa-w-18 fa-lg"><path fill="currentColor" d="M96,128A64,64,0,1,0,32,64,64,64,0,0,0,96,128Zm0,176.08a44.11,44.11,0,0,1,13.64-32L181.77,204c1.65-1.55,3.77-2.31,5.61-3.57A63.91,63.91,0,0,0,128,160H64A64,64,0,0,0,0,224v96a32,32,0,0,0,32,32V480a32,32,0,0,0,32,32h64a32,32,0,0,0,32-32V383.61l-50.36-47.53A44.08,44.08,0,0,1,96,304.08ZM480,128a64,64,0,1,0-64-64A64,64,0,0,0,480,128Zm32,32H448a63.91,63.91,0,0,0-59.38,40.42c1.84,1.27,4,2,5.62,3.59l72.12,68.06a44.37,44.37,0,0,1,0,64L416,383.62V480a32,32,0,0,0,32,32h64a32,32,0,0,0,32-32V352a32,32,0,0,0,32-32V224A64,64,0,0,0,512,160ZM444.4,295.34l-72.12-68.06A12,12,0,0,0,352,236v36H224V236a12,12,0,0,0-20.28-8.73L131.6,295.34a12.4,12.4,0,0,0,0,17.47l72.12,68.07A12,12,0,0,0,224,372.14V336H352v36.14a12,12,0,0,0,20.28,8.74l72.12-68.07A12.4,12.4,0,0,0,444.4,295.34Z" class=""></path></svg>'

    const searchIdRecursively = (obj) => {
        if (obj?.memoizedProps?.playerId) return obj.memoizedProps.playerId
        else {
            const val = obj?.return ? searchIdRecursively(obj.return) : false
            return val
        }
    }

    const findPlayerId = (element) => {
        const reactStateKey = Object.keys(element).find((key) =>
            key.toLowerCase().includes('reactfiber')
        )
        return searchIdRecursively(element[reactStateKey])
    }

    const findSelectedPlayer = () => {
        const playerUIButton = [
            ...document.querySelectorAll('div[tabIndex="0"]'),
        ].find((playerEl) => playerEl.selected)
        return findPlayerId(playerUIButton)
    }

    const addButton = (parentEl, icon, text = 'new button', callbackFn) => {
        const buttonRef = [...parentEl.querySelectorAll('span')].find((span) => span.innerText === 'Follow')?.parentElement
        if (!buttonRef) return

        const selectedPlayerId = findSelectedPlayer()
        if (!selectedPlayerId) return

        const newElement = buttonRef.cloneNode(true)

        newElement.querySelector('div').innerHTML = icon
        newElement.querySelector('span').innerHTML = text
        newElement.onclick = (e) => {
            e.preventDefault()
            callbackFn(selectedPlayerId)
        }
        parentEl.appendChild(newElement)
        console.log(`✨${text} button initialized`)
    }

    // The teleport magic
    const teleportToPlayer = (playerId) => {
        const player = game.players[playerId]
        game.teleport(player.map, player.x, player.y)
    }

    const teleportToMe = (playerId) => {
        const myPlayer = game.getMyPlayer()
        game.teleport(myPlayer.map, myPlayer.x, myPlayer.y, playerId)
    }

    const lookForPlayerUI = () => {
        return document.querySelector('[class*="GameComponent"]')
            ? document.querySelector('.center-y')
            : false
    }

    const initializeButtons = (parentEl) => {
        addButton(
            parentEl,
            teleportIcon,
            'Teleport to player',
            teleportToPlayer
        )
        addButton(parentEl, teleportIcon, 'Teleport to me', teleportToMe)
    }

    const isUIOpen = () => {
        // check for UI presence without setInterval
        const observer = new MutationObserver((mutations) => {
            const PLAYER_CARD_MODAL = lookForPlayerUI() //todo check if it makes sense to actually utilize mutations data
            if (PLAYER_CARD_MODAL) {
                observer.disconnect()
                initializeButtons(PLAYER_CARD_MODAL.firstElementChild)
                isUIClosed(PLAYER_CARD_MODAL)
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })
    }

    const isUIClosed = (element) => {
        // check for UI absence without setInterval
        const observer = new MutationObserver((mutations) => {
            if (!lookForPlayerUI()) {
                observer.disconnect()
                isUIOpen()
            }
        })

        observer.observe(element.parentElement, { childList: true })
    }

    isUIOpen()
})()
