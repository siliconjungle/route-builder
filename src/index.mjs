const $ = (id) => document.getElementById(id)

const canvas = $('game')
const ctx = canvas.getContext('2d')

ctx.mozImageSmoothingEnabled = false
ctx.webkitImageSmoothingEnabled = false
ctx.msImageSmoothingEnabled = false
ctx.imageSmoothingEnabled = false

const setDefaultLine = () => {
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
}

setDefaultLine()

const getStateFromCanvas = () => {
  // Likely doesn't need to check if canvas exists since the ctx is coming from canvas.
  return canvas && ctx ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null
}

const updateUndoRedoActions = () => {
  const canUndo = currentStateIndex > 0
  undoButton.disabled = !canUndo
  const canRedo = currentStateIndex < history.length - 1
  redoButton.disabled = !canRedo
}

// It would be more efficient to store the actions rather than the state -> then every x actions we could take snapshots
// This would balance the memory v.s the replays.
const saveCanvasToHistory = () => {
  const canvasState = getStateFromCanvas()
  // If the currentStateIndex is not the last element, then you cut off that branch of history
  // Then regardless you push the new state to the end
  if (currentStateIndex !== history.length -1) {
    history = history.slice(0, currentStateIndex + 1)
  }
  history.push(canvasState)
  currentStateIndex = history.length - 1

  updateUndoRedoActions()
}

const undoButton = $('undo-button')
const redoButton = $('redo-button')
let history = []
let currentStateIndex = history.length - 1
saveCanvasToHistory()

undoButton.addEventListener('click', (e) => {
  e.preventDefault()

  const previousStateIndex = currentStateIndex - 1

  if (previousStateIndex >= 0) {
    currentStateIndex = previousStateIndex
    ctx.putImageData(history[currentStateIndex], 0, 0)
    updateUndoRedoActions()
  }
})

redoButton.addEventListener('click', (e) => {
  e.preventDefault()

  const nextStateIndex = currentStateIndex + 1

  if (nextStateIndex <= history.length - 1) {
    currentStateIndex = nextStateIndex
    ctx.putImageData(history[currentStateIndex], 0, 0)
    updateUndoRedoActions()
  }
})

const inputForm = $('input-form')

inputForm.addEventListener('onsubmit', e => {
  e.preventDefault()
})

const canvasWidth = $('canvas-width')
const canvasHeight = $('canvas-height')

canvasWidth.addEventListener('change', (e) => {
  canvas.setAttribute('width', `${e.target.value}px`)
})

canvasHeight.addEventListener('change', (e) => {
  canvas.setAttribute('height', `${e.target.value}px`)
})

const backgroundImageInput = $('background-image')
let backgroundImage = null

backgroundImageInput.addEventListener('change', () => {
  if (backgroundImageInput.files && backgroundImageInput.files[0]) {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvasWidth.disabled = true
      canvasHeight.disabled = true
      setDefaultLine()
      saveCanvasToHistory()
    }

    img.src = URL.createObjectURL(backgroundImageInput.files[0]) // set src to blob url
    backgroundImage = img
  }
})

const iconImagesInput = $('icon-images')
const iconImagesContainer = $('icon-images-container')
const iconImages = []
const TOOL_TYPE = {
  PENCIL: 'pencil',
  STAMP: 'stamp',
}
let stamp = null
let currentTool = TOOL_TYPE.PENCIL

iconImagesInput.addEventListener('change', () => {
  if (iconImagesInput.files) {
    const images = [...iconImagesInput.files]
    images.forEach(iconImage => {
      const img = new Image()
      img.onload = () => {
        iconImages.push(img)
        const imageButton = document.createElement('button')
        imageButton.addEventListener('click', e => {
          e.preventDefault()
          currentTool = TOOL_TYPE.STAMP
          stamp = img
        })
        const newImage = document.createElement('img')
        newImage.src = img.src
        imageButton.appendChild(newImage)
        iconImagesContainer.appendChild(imageButton)
      }

      img.src = URL.createObjectURL(iconImage)
    })
  }
})

const pencilButton = $('pencil-button')

pencilButton.addEventListener('click', e => {
  e.preventDefault()
  stamp = null
  currentTool = TOOL_TYPE.PENCIL
})

const downloadButton = $('download-button')
downloadButton.addEventListener('click', () => {
  const image = canvas.toDataURL('image/png')
    .replace('image/png', 'image/octet-stream')
  downloadButton.setAttribute('href', image)
})

const brushColorPicker = $('brush-color')

brushColorPicker.addEventListener('change', (e) => {
  setBrushColor(e.target.value)
})

let brushColor = '#000000'
let isPainting = false
let startX, startY

const getOffsetPosition = () => {
  const boundingClientRect = canvas.getBoundingClientRect()
  return { x: boundingClientRect.left, y: boundingClientRect.top }
}

const getMousePosition = (e) => {
  const offset = getOffsetPosition()
  return {
    x: e.clientX - offset.x,
    y: e.clientY - offset.y,
  }
}

const setBrushColor = color => {
  brushColor = color
  ctx.strokeStyle = brushColor
}

const draw = e => {
  if (!isPainting) return
  const mouse = getMousePosition(e)
  ctx.lineTo(mouse.x, mouse.y)
  ctx.stroke()
}

canvas.addEventListener('mousedown', e => {
  if (currentTool === TOOL_TYPE.PENCIL) {
    // I could also add a circle here when you click so you don't need to move the mouse to begin drawing.
    isPainting = true
    const mouse = getMousePosition(e)
    startX = mouse.x
    startY = mouse.y
  } else if (currentTool === TOOL_TYPE.STAMP && stamp) {
    const mouse = getMousePosition(e)
    ctx.drawImage(stamp, mouse.x - stamp.width * 0.5, mouse.y - stamp.height * 0.5, stamp.width, stamp.height)
    saveCanvasToHistory()
  }
})

canvas.addEventListener('mousemove', e => {
  if (currentTool === TOOL_TYPE.PENCIL) {
    draw(e)
  }
})

// Some work could be done to allow it to paint to the edge
canvas.addEventListener('mouseout', () => {
  if (currentTool === TOOL_TYPE.PENCIL) {
    ctx.stroke()
    ctx.beginPath()
    if (isPainting) {
      saveCanvasToHistory()
      isPainting = false
    }
  }
})

canvas.addEventListener('mouseup', () => {
  if (currentTool === TOOL_TYPE.PENCIL) {
    isPainting = false
    ctx.stroke()
    ctx.beginPath()
    saveCanvasToHistory()
  }
})

window.addEventListener('pageshow', () => {
  // Re draw the state of the window
  if (canvas && ctx && history.length > 0) {
    ctx.putImageData(history[currentStateIndex], 0, 0)
  }
})

window.addEventListener('visibilitychange', (e) => {
  if (canvas && ctx && history.length > 1 && document.visibilityState === 'visible') {
    ctx.putImageData(history[currentStateIndex], 0, 0)
  }
})
