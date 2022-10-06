function addConsole() {
    let consoleEl = document.querySelector('#console')
    if (!consoleEl) {
        consoleEl = document.createElement('div')
        consoleEl.id = 'console'
        consoleEl.innerHTML = `
           <div class="wrapper">
               <button id="clear">Clear</button>
               <button id="save">Save</button>
           </div>
           <style>
               #clear{
                   position:absolute;
                   top:1rem;
                   right:1rem;
               }
               #save{
                   position:absolute;
                   bottom:1rem;
                   right:1rem;
               }
               #console{
                   position:absolute;
                   bottom:60px;
                   width:100vw;
                   max-height:30vh;
                   border-top:1px solid darkgray;
                   background-color:#2f4f4fa3;
               }
               #console .wrapper{
                   position:relative;
                   max-height:inherit;
                   padding:2.4rem;
                   overflow-y:scroll;
                   flex-flow: unset;
                   flex-wrap:wrap;
                   align-content: flex-start;
                   display: flex;
               }
               #console .wrapper > p{
                   border-radius:4px 0 0 4px;
                   padding:4px 10px 4px 8px;
                   background: black;
                   color:white;
                   margin: .5rem;
                   white-space:nowrap;
               }
           </style>
           `
        document.body.appendChild(consoleEl)
    }
    return consoleEl.firstElementChild
}

function setupHandlers(consoleEl, coordinatesEl) {
    let area = []
    let isAreaToggled = false
    let isNameToggled = false

    const addData = (data) => {
        const p = document.createElement('p')
        p.innerHTML = `"${data.name || consoleEl.children.length - 1}" saved: ${
            data.x
        },${data.y}`
        consoleEl.appendChild(p)
    }
    const addArea = (area) => {
        const p = document.createElement('p')
        p.innerHTML = `Area "${
            area.name || consoleEl.children.length - 1
        }" saved: TopLeft ${area.x0},${area.y0} - BottomRight ${area.x1},${
            area.y1
        }`
        consoleEl.appendChild(p)
    }

    const updateTitles = (reset) => {
        const titlePrefix = reset
            ? ''
            : area.length === 0
            ? 'TopLeft '
            : 'BottomRight '
        coordinatesEl.querySelector('.xTitle').innerText = `${titlePrefix}x`
        coordinatesEl.querySelector('.yTitle').innerText = `${titlePrefix}y`
    }

    const clearData = () => {
        ;[...consoleEl.querySelectorAll('p')].forEach((p) =>
            consoleEl.removeChild(p)
        )
    }

    const saveData = () => {}

    const areaToggle = coordinatesEl.querySelector('.areaToggle')
    const nameToggle = coordinatesEl.querySelector('.nameToggle')
    const clearBtn = consoleEl.querySelector('#clear')
    const saveBtn = consoleEl.querySelector('#save')

    clearBtn.onclick = () => clearData()
    saveBtn.onclick = () => exportData()
    areaToggle.onchange = (evt) => {
        isAreaToggled = evt.target.checked
        updateTitles(!isAreaToggled)
    }
    nameToggle.onchange = (evt) => (isNameToggled = evt.target.checked)

    document.onkeydown = (evt) => {
        const { x, y } = game.getMyPlayer()

        if (evt.code.toLowerCase() === 'keyl') {
            if (isAreaToggled) {
                area.push({ x, y })
                updateTitles()
                if (area[1]) {
                    const name = isNameToggled
                        ? undefined
                        : prompt('Area name:')
                    const x0 = area[0].x
                    const y0 = area[0].y
                    const x1 = area[1].x
                    const y1 = area[1].y
                    addArea({ x0, y0, x1, y1, name })
                    area = []
                    updateTitles()
                }
            } else {
                const name = isNameToggled
                    ? undefined
                    : prompt('Position name:')
                addData({ x, y, name })
            }
        }
    }
}

function updateCoordinates(mapId, x, y) {
    let ui = document.querySelector('#pos-monitor')
    if (!ui) {
        ui = document.createElement('div')
        ui.id = 'pos-monitor'
        ui.innerHTML = `
       <div class="wrapper">
           <div>
               <p>map:</p>
                <input class="map" type="text"></input>
           </div>
           <div>
               <p class="xTitle">x:</p>
               <input class="x" type="number"></input>
           </div>
            <div>
                <p class="yTitle">y:</p>
               <input class="y" type="number"></input>
           </div>
           <div id="area-wrapper">
               <p>Capture Area?</p>
               <input class="areaToggle" type="checkbox"></input>
           </div>
           <div>
               <p>Skip name?</p>
               <input class="nameToggle" type="checkbox"></input>
           </div>
       </div>
       <style>
           #pos-monitor{
               position:absolute;
               top:4rem;
               left:4rem;
           }
           .wrapper{
               align-items: flex-end;
               display: flex;
               flex-flow: column;
           }
           .wrapper > div{
               display:flex
           }
           .map{
               width:100%
           }
           input{
               width:fit-content;
           }
           p{
               border-radius:4px 0 0 4px;
               padding:4px 10px 4px 8px;
               background: black;
               color:white;
               white-space:nowrap;
           }
           h3{
               color:white
           }
       </style>
       `
        document.body.appendChild(ui)
    }

    ui.querySelector('.x').value = x
    ui.querySelector('.y').value = y
    ui.querySelector('.map').value = mapId
    return ui
}

game.subscribeToEvent('playerMoves', (data, ctx) => {
    if (ctx.playerId !== gameSpace.id) return
    updateCoordinates(ctx.player.map, ctx.player.x, ctx.player.y)
})

setupHandlers(addConsole(), updateCoordinates('', 0, 0))
