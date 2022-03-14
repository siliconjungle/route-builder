/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.mjs":
/*!***********************!*\
  !*** ./src/index.mjs ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst $ = (id) => document.getElementById(id)\n\nconst canvas = $('game')\nconst ctx = canvas.getContext('2d')\n\nctx.mozImageSmoothingEnabled = false\nctx.webkitImageSmoothingEnabled = false\nctx.msImageSmoothingEnabled = false\nctx.imageSmoothingEnabled = false\n\nconst setDefaultLine = () => {\n  ctx.lineWidth = 5\n  ctx.lineCap = 'round'\n}\n\nsetDefaultLine()\n\nconst getStateFromCanvas = () => {\n  // Likely doesn't need to check if canvas exists since the ctx is coming from canvas.\n  return canvas && ctx ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null\n}\n\nconst updateUndoRedoActions = () => {\n  const canUndo = currentStateIndex > 0\n  undoButton.disabled = !canUndo\n  const canRedo = currentStateIndex < history.length - 1\n  redoButton.disabled = !canRedo\n}\n\n// It would be more efficient to store the actions rather than the state -> then every x actions we could take snapshots\n// This would balance the memory v.s the replays.\nconst saveCanvasToHistory = () => {\n  const canvasState = getStateFromCanvas()\n  // If the currentStateIndex is not the last element, then you cut off that branch of history\n  // Then regardless you push the new state to the end\n  if (currentStateIndex !== history.length -1) {\n    history = history.slice(0, currentStateIndex + 1)\n  }\n  history.push(canvasState)\n  currentStateIndex = history.length - 1\n\n  updateUndoRedoActions()\n}\n\nconst undoButton = $('undo-button')\nconst redoButton = $('redo-button')\nlet history = []\nlet currentStateIndex = history.length - 1\nsaveCanvasToHistory()\n\nundoButton.addEventListener('click', (e) => {\n  e.preventDefault()\n\n  const previousStateIndex = currentStateIndex - 1\n\n  if (previousStateIndex >= 0) {\n    currentStateIndex = previousStateIndex\n    ctx.putImageData(history[currentStateIndex], 0, 0)\n    updateUndoRedoActions()\n  }\n})\n\nredoButton.addEventListener('click', (e) => {\n  e.preventDefault()\n\n  const nextStateIndex = currentStateIndex + 1\n\n  if (nextStateIndex <= history.length - 1) {\n    currentStateIndex = nextStateIndex\n    ctx.putImageData(history[currentStateIndex], 0, 0)\n    updateUndoRedoActions()\n  }\n})\n\nconst inputForm = $('input-form')\n\ninputForm.addEventListener('onsubmit', e => {\n  e.preventDefault()\n})\n\nconst canvasWidth = $('canvas-width')\nconst canvasHeight = $('canvas-height')\n\ncanvasWidth.addEventListener('change', (e) => {\n  canvas.setAttribute('width', `${e.target.value}px`)\n})\n\ncanvasHeight.addEventListener('change', (e) => {\n  canvas.setAttribute('height', `${e.target.value}px`)\n})\n\nconst backgroundImageInput = $('background-image')\nlet backgroundImage = null\n\nbackgroundImageInput.addEventListener('change', () => {\n  if (backgroundImageInput.files && backgroundImageInput.files[0]) {\n    const img = new Image()\n    img.onload = () => {\n      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)\n      canvasWidth.disabled = true\n      canvasHeight.disabled = true\n      setDefaultLine()\n      saveCanvasToHistory()\n    }\n\n    img.src = URL.createObjectURL(backgroundImageInput.files[0]) // set src to blob url\n    backgroundImage = img\n  }\n})\n\nconst iconImagesInput = $('icon-images')\nconst iconImagesContainer = $('icon-images-container')\nconst iconImages = []\nconst TOOL_TYPE = {\n  PENCIL: 'pencil',\n  STAMP: 'stamp',\n}\nlet stamp = null\nlet currentTool = TOOL_TYPE.PENCIL\n\niconImagesInput.addEventListener('change', () => {\n  if (iconImagesInput.files) {\n    const images = [...iconImagesInput.files]\n    images.forEach(iconImage => {\n      const img = new Image()\n      img.onload = () => {\n        iconImages.push(img)\n        const imageButton = document.createElement('button')\n        imageButton.addEventListener('click', e => {\n          e.preventDefault()\n          currentTool = TOOL_TYPE.STAMP\n          stamp = img\n        })\n        const newImage = document.createElement('img')\n        newImage.src = img.src\n        imageButton.appendChild(newImage)\n        iconImagesContainer.appendChild(imageButton)\n      }\n\n      img.src = URL.createObjectURL(iconImage)\n    })\n  }\n})\n\nconst pencilButton = $('pencil-button')\n\npencilButton.addEventListener('click', e => {\n  e.preventDefault()\n  stamp = null\n  currentTool = TOOL_TYPE.PENCIL\n})\n\nconst downloadButton = $('download-button')\ndownloadButton.addEventListener('click', () => {\n  const image = canvas.toDataURL('image/png')\n    .replace('image/png', 'image/octet-stream')\n  downloadButton.setAttribute('href', image)\n})\n\nconst brushColorPicker = $('brush-color')\n\nbrushColorPicker.addEventListener('change', (e) => {\n  setBrushColor(e.target.value)\n})\n\nlet brushColor = '#000000'\nlet isPainting = false\nlet startX, startY\n\nconst getOffsetPosition = () => {\n  const boundingClientRect = canvas.getBoundingClientRect()\n  return { x: boundingClientRect.left, y: boundingClientRect.top }\n}\n\nconst getMousePosition = (e) => {\n  const offset = getOffsetPosition()\n  return {\n    x: e.clientX - offset.x,\n    y: e.clientY - offset.y,\n  }\n}\n\nconst setBrushColor = color => {\n  brushColor = color\n  ctx.strokeStyle = brushColor\n}\n\nconst draw = e => {\n  if (!isPainting) return\n  const mouse = getMousePosition(e)\n  ctx.lineTo(mouse.x, mouse.y)\n  ctx.stroke()\n}\n\ncanvas.addEventListener('mousedown', e => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    // I could also add a circle here when you click so you don't need to move the mouse to begin drawing.\n    isPainting = true\n    const mouse = getMousePosition(e)\n    startX = mouse.x\n    startY = mouse.y\n  } else if (currentTool === TOOL_TYPE.STAMP && stamp) {\n    const mouse = getMousePosition(e)\n    ctx.drawImage(stamp, mouse.x - stamp.width * 0.5, mouse.y - stamp.height * 0.5, stamp.width, stamp.height)\n    saveCanvasToHistory()\n  }\n})\n\ncanvas.addEventListener('mousemove', e => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    draw(e)\n  }\n})\n\n// Some work could be done to allow it to paint to the edge\ncanvas.addEventListener('mouseout', () => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    ctx.stroke()\n    ctx.beginPath()\n    if (isPainting) {\n      saveCanvasToHistory()\n      isPainting = false\n    }\n  }\n})\n\ncanvas.addEventListener('mouseup', () => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    isPainting = false\n    ctx.stroke()\n    ctx.beginPath()\n    saveCanvasToHistory()\n  }\n})\n\nwindow.addEventListener('pageshow', () => {\n  // Re draw the state of the window\n  if (canvas && ctx && history.length > 0) {\n    ctx.putImageData(history[currentStateIndex], 0, 0)\n  }\n})\n\nwindow.addEventListener('visibilitychange', (e) => {\n  if (canvas && ctx && history.length > 1 && document.visibilityState === 'visible') {\n    ctx.putImageData(history[currentStateIndex], 0, 0)\n  }\n})\n\n\n//# sourceURL=webpack://route-builder/./src/index.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.mjs"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;