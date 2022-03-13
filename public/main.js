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

eval("__webpack_require__.r(__webpack_exports__);\nconst $ = (id) => document.getElementById(id)\n\nconst canvas = $('game')\nconst ctx = canvas.getContext('2d')\n\nctx.mozImageSmoothingEnabled = false\nctx.webkitImageSmoothingEnabled = false\nctx.msImageSmoothingEnabled = false\nctx.imageSmoothingEnabled = false\n\nconst setDefaultLine = () => {\n  ctx.lineWidth = 5\n  ctx.lineCap = 'round'\n}\n\nsetDefaultLine()\n\nconst inputForm = $('input-form')\n\ninputForm.addEventListener('onsubmit', e => {\n  e.preventDefault()\n})\n\nconst backgroundImageInput = $('background-image')\nlet backgroundImage = null\n\nbackgroundImageInput.addEventListener('change', () => {\n  if (backgroundImageInput.files && backgroundImageInput.files[0]) {\n    const img = new Image()\n    img.onload = () => {\n      canvas.setAttribute('width', `${img.width}px`)\n      canvas.setAttribute('height', `${img.height}px`)\n      ctx.drawImage(img, 0, 0, img.width, img.height)\n      setDefaultLine()\n    }\n\n    img.src = URL.createObjectURL(backgroundImageInput.files[0]) // set src to blob url\n    backgroundImage = img\n  }\n})\n\nconst iconImagesInput = $('icon-images')\nconst iconImagesContainer = $('icon-images-container')\nconst iconImages = []\nconst TOOL_TYPE = {\n  PENCIL: 'pencil',\n  STAMP: 'stamp',\n}\nlet stamp = null\nlet currentTool = TOOL_TYPE.PENCIL\n\niconImagesInput.addEventListener('change', () => {\n  if (iconImagesInput.files) {\n    const images = [...iconImagesInput.files]\n    images.forEach(iconImage => {\n      const img = new Image()\n      img.onload = () => {\n        iconImages.push(img)\n        const imageButton = document.createElement('button')\n        imageButton.addEventListener('click', e => {\n          e.preventDefault()\n          currentTool = TOOL_TYPE.STAMP\n          stamp = img\n        })\n        const newImage = document.createElement('img')\n        newImage.src = img.src\n        imageButton.appendChild(newImage)\n        iconImagesContainer.appendChild(imageButton)\n      }\n\n      img.src = URL.createObjectURL(iconImage)\n    })\n  }\n})\n\nconst pencilButton = $('pencil-button')\n\npencilButton.addEventListener('click', e => {\n  e.preventDefault()\n  stamp = null\n  currentTool = TOOL_TYPE.PENCIL\n})\n\nconst downloadButton = $('download-button')\ndownloadButton.addEventListener('click', () => {\n  const image = canvas.toDataURL('image/png')\n    .replace('image/png', 'image/octet-stream')\n  downloadButton.setAttribute('href', image)\n})\n\nconst brushColorPicker = $('brush-color')\n\nbrushColorPicker.addEventListener('change', (e) => {\n  setBrushColor(e.target.value)\n})\n\nlet brushColor = '#000000'\nlet isPainting = false\nlet startX, startY\n\nconst getOffsetPosition = () => {\n  const boundingClientRect = canvas.getBoundingClientRect()\n  return { x: boundingClientRect.left, y: boundingClientRect.top }\n}\n\nconst getMousePosition = (e) => {\n  const offset = getOffsetPosition()\n  return {\n    x: e.clientX - offset.x,\n    y: e.clientY - offset.y,\n  }\n}\n\nconst setBrushColor = color => {\n  brushColor = color\n  ctx.strokeStyle = brushColor\n}\n\nconst draw = e => {\n  if (!isPainting) return\n  const mouse = getMousePosition(e)\n  ctx.lineTo(mouse.x, mouse.y)\n  ctx.stroke()\n}\n\ncanvas.addEventListener('mousedown', e => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    isPainting = true\n    const mouse = getMousePosition(e)\n    startX = mouse.x\n    startY = mouse.y\n  } else if (currentTool === TOOL_TYPE.STAMP && stamp) {\n    const mouse = getMousePosition(e)\n    ctx.drawImage(stamp, mouse.x - stamp.width * 0.5, mouse.y - stamp.height * 0.5, stamp.width, stamp.height)\n  }\n})\n\ncanvas.addEventListener('mousemove', e => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    draw(e)\n  }\n})\n\ncanvas.addEventListener('mouseup', () => {\n  if (currentTool === TOOL_TYPE.PENCIL) {\n    isPainting = false\n    ctx.stroke()\n    ctx.beginPath()\n  }\n})\n\n\n//# sourceURL=webpack://game-server/./src/index.mjs?");

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