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

/***/ "./guessing/static/utils.js":
/*!**********************************!*\
  !*** ./guessing/static/utils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var emojisplosion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! emojisplosion */ \"./node_modules/emojisplosion/src/index.js\");\n/* harmony import */ var emojisplosion__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(emojisplosion__WEBPACK_IMPORTED_MODULE_0__);\n// main.js\nvar selectcarmodel;\nvar searchedcarmodel;\nvar selectcarbrand;\nvar searchedcarbrand;\nvar selectcarfuel;\nvar searchedcarfuel;\nvar selectcartype;\nvar searchedcartype;\nvar selectcarengine;\nvar searchedcarengine;\nvar selectcarwheel;\nvar searchedcarwheel;\nvar selectcaryear;\nvar searchedcaryear;\nvar selectcarpicture;\n\n$(document).ready(function() {\n    // Make an AJAX request to get a random car\n    $.ajax({\n        url: '/get_random_car/',\n        method: 'GET',\n        dataType: 'json',\n        success: function(data) { \n            selectcarmodel = data.car_details.Model;\n            selectcarbrand = data.car_details.Brand;\n            selectcarfuel = data.car_details.Fuel;\n            selectcartype = data.car_details['Car Type'];\n            selectcarengine = data.car_details['Engine conf'];\n            selectcarwheel= data.car_details['Drive wheel'];\n            selectcaryear = data.car_details.Year;\n            selectcarpicture =  data.car_details.Picture;\n        },\n        error: function(xhr, status, error) {\n            console.error(error);\n        }\n    });\nvar nb_guess = 0;\n    $('#car-search-form').on('submit', function(event) {\n        event.preventDefault();\n        var carModel = $('#car-model-input').val();\n        \n        $.ajax({\n            url: '/get_car_details/',\n            method: 'GET',\n            data: { car_model: carModel, csrfmiddlewaretoken: '{{ csrf_token }}' },\n            success: function(data) {\n                searchedcarmodel = data.car_details.Model;\n                searchedcarbrand = data.car_details.Brand;\n                searchedcarfuel = data.car_details.Fuel;\n                searchedcartype = data.car_details['Car Type'];\n                searchedcarengine =  data.car_details['Engine conf'];\n                searchedcarwheel = data.car_details['Drive wheel'] ;\n                searchedcaryear = data.car_details.Year;\n                if (typeof searchedcarmodel !== 'undefined'){ \n                    if (nb_guess === 0){\n                        $('#name-placement').prepend('<div class=\"all-infos\">' +\n                        '<div class=\"name-column\">Model</div>' +\n                        '<div class=\"name-column\">Brand</div>' +\n                        '<div class=\"name-column\">Fuel</div>' +\n                        '<div class=\"name-column\">Car type</div>' +\n                        '<div class=\"name-column\">Engine conf.</div>' +\n                        '<div class=\"name-column\">Drive wheel</div>' +\n                        '<div class=\"name-column\">Release Year</div>' +\n                        '</div>');\n                    }\n                    var container = $('<div class=\"guessing-car\"></div>');\n                    var text = '';\n                    if (data.car_details.Picture) {\n                        text += '<img src=\"' + data.car_details.Picture + '\" alt=\"Car Image\" class=\"square-image\"><div class=\"car-name\" style=\"display:none;\">' + data.car_details.Model+'</div>';\n                    } else {\n                        text += '<img src=\"/media/car_pics/no_image.jpg\" alt=\"Default Car Image\"  class=\"square-image\">';\n                    }\n\n                    text += compareCarAttribute(selectcarbrand, searchedcarbrand, 'Brand');\n                    text += compareCarAttribute(selectcarfuel, searchedcarfuel, 'Fuel');\n                    text += compareCarAttribute(selectcartype, searchedcartype, 'CarType');\n                    text += compareCarAttribute(selectcarengine, searchedcarengine, 'EngineConf');\n                    text += compareCarAttribute(selectcarwheel, searchedcarwheel, 'DriveWheel');\n                    \n                    \n                    \n                    if (selectcaryear === searchedcaryear){\n                        text += '<div class=\"square-info-green Year\" data-car-detail=\"Year\">' + data.car_details.Year + '</div></div>';\n                    } else if (selectcaryear > searchedcaryear){\n                        text += '<div class=\"square-year-up Year\" data-car-detail=\"Year\">' + data.car_details.Year + '</div></div>';\n                    }else {\n                        text += '<div class=\"square-year-down Year\" data-car-detail=\"Year\">' + data.car_details.Year + '</div></div>';\n                    }\n\n                    var fadeInDuration = 1800;\n                    var fadeInDelay = 600;\n\n                    container.prepend(text);\n\n                    $('#selected-car-details').prepend(container);\n\n                    container.find('.Brand').hide().delay((10)).fadeIn(fadeInDuration);\n                    container.find('.Fuel').hide().delay((1 * fadeInDelay)).fadeIn(fadeInDuration);\n                    container.find('.CarType').hide().delay((2 * fadeInDelay)).fadeIn(fadeInDuration);\n                    container.find('.EngineConf').hide().delay((3 * fadeInDelay)).fadeIn(fadeInDuration);\n                    container.find('.DriveWheel').hide().delay((4 * fadeInDelay)).fadeIn(fadeInDuration);\n                    container.find('.Year').hide().delay((5 * fadeInDelay)).fadeIn(fadeInDuration);\n                    nb_guess++;\n                    if (searchedcarmodel === selectcarmodel){\n                        winmessage(nb_guess);\n                    }\n                    $('#car-model-input').val('');\n                }\n            },\n            error: function(xhr, status, error) {\n                console.error(error);\n            }\n        });\n    });\n});\n\nfunction compareCarAttribute(selectedAttribute, searchedAttribute, attributeName) {\n    var selectedOptions = selectedAttribute.split(',').map(option => option.trim());\n    var searchedOptions = searchedAttribute.split(',').map(option => option.trim());\n    var result;\n\n    if (\n        selectedOptions.every(option => searchedOptions.includes(option)) &&\n        searchedOptions.every(option => selectedOptions.includes(option))\n    ) {\n        // All selected options are present in the searched car's options\n        result = `<div class=\"square-info-green ${attributeName}\" data-car-detail=\"${attributeName}\">${searchedAttribute}</div>`;\n    } else if (selectedOptions.some(option => searchedOptions.includes(option))) {\n        // Partial match, some selected options are present in the searched car's options\n        result = `<div class=\"square-info-orange ${attributeName}\" data-car-detail=\"${attributeName}\">${searchedAttribute}</div>`;\n    } else {\n        // No match\n        result = `<div class=\"square-info-red ${attributeName}\" data-car-detail=\"${attributeName}\">${searchedAttribute}</div>`;\n    }\n\n    return result;\n}\n\n\n\n\nfunction winmessage(nb_guess) {\n    // Display the winning message with the guessed car image\n    var winMessageDiv = $('#win-message');\n    var winCarImage = $('#win-car-image');\n    var winMessageText = $('#win-message-text');\n\n    if (selectcarpicture) {\n        winCarImage.attr('src', selectcarpicture);\n    } else {\n        winCarImage.attr('src', '/media/car_pics/no_image.jpg');\n    }\n\n    winMessageText.text('Congratulations! You guessed the car in ' + nb_guess + ' attempts.');\n\n    // Delay the appearance of the win message and image\n    setTimeout(function() {\n        winMessageDiv.width($('#selected-car-details').width());\n\n        winMessageDiv.show();\n        $('#car-search-form').hide();\n        $('#pannel-suggestions').hide();\n        (0,emojisplosion__WEBPACK_IMPORTED_MODULE_0__.emojisplosion)({\n            emojis: [\"🚘\", \"🚙\", \"🚗\", \"🏎️\", \"🎉\", \"🎊\", \"⛽\"],\n        });\n\n    }, 4400); // Adjust the delay time as needed\n}\n\n//# sourceURL=webpack:///./guessing/static/utils.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/actor.js":
/*!*************************************************!*\
  !*** ./node_modules/emojisplosion/src/actor.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.EmojiActor = void 0;\r\nconst range_1 = __webpack_require__(/*! ./range */ \"./node_modules/emojisplosion/src/range.js\");\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./node_modules/emojisplosion/src/utils.js\");\r\n/**\r\n * Pixel distance out of the screen bounds to treat actors as out-of-bounds.\r\n */\r\nconst outOfBounds = 350;\r\n/**\r\n * Contains the position state and DOM element for a single displayed emoji.\r\n *\r\n * @remarks\r\n * This creates and keeps a single DOM element span in the DOM.\r\n * Text content for the span is determined by the provided actors.\r\n *\r\n * On each game tick, this actor will:\r\n *  1. Dispose itself if it's moved past out of the game screen\r\n *  2. Reduce opacity a little bit\r\n *  3. Dispose itself if it's no longer visible at all\r\n *  4. Adjust position and velocity as per its physics constants\r\n *  5. Update the DOM element's opacity and position to reflect those changes\r\n *\r\n * \"Disposing\" an actor means removing its element from the document.\r\n */\r\nclass EmojiActor {\r\n    constructor(settings) {\r\n        /**\r\n         * CSS opacity style, starting at 1 for fully visible.\r\n         */\r\n        this.opacity = 1;\r\n        this.element = document.createElement(settings.tagName);\r\n        this.element.className = settings.className;\r\n        this.element.style.transition = \"16ms opacity, 16ms transform\";\r\n        this.element.textContent = utils_1.randomArrayMember(settings.emojis);\r\n        // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/accessible-emoji.md\r\n        this.element.setAttribute(\"aria-label\", \"Random emoji\");\r\n        this.element.setAttribute(\"role\", \"img\");\r\n        this.element.style.fontSize = `${range_1.randomInRange(settings.physics.fontSize)}px`;\r\n        this.physics = settings.physics;\r\n        this.position = {\r\n            rotation: range_1.randomInRange(settings.physics.rotation),\r\n            x: settings.position.x,\r\n            y: settings.position.y,\r\n        };\r\n        this.velocity = {\r\n            rotation: range_1.randomInRange(settings.physics.initialVelocities.rotation),\r\n            x: range_1.randomInRange(settings.physics.initialVelocities.x),\r\n            y: range_1.randomInRange(settings.physics.initialVelocities.y),\r\n        };\r\n        this.updateElement();\r\n        settings.process(this.element);\r\n        settings.container.appendChild(this.element);\r\n    }\r\n    /**\r\n     * Moves the actor forward one tick.\r\n     *\r\n     * @param timeElapsed   How many milliseconds have passed since the last action.\r\n     * @returns Whether this is now dead.\r\n     */\r\n    act(timeElapsed) {\r\n        if (this.physics.opacityDecay) {\r\n            this.opacity -= timeElapsed / (this.physics.opacityDecay * this.physics.framerate);\r\n            if (this.opacity <= 0) {\r\n                return true;\r\n            }\r\n        }\r\n        this.velocity.rotation *= this.physics.rotationDeceleration;\r\n        this.velocity.y += this.physics.gravity;\r\n        this.position.rotation += this.velocity.rotation;\r\n        this.position.x += this.velocity.x * timeElapsed / this.physics.framerate;\r\n        this.position.y += this.velocity.y * timeElapsed / this.physics.framerate;\r\n        const windowHeight = window.outerHeight || document.documentElement.clientHeight;\r\n        const windowWidth = window.outerWidth || document.documentElement.clientWidth;\r\n        if (!this.physics.preserveOutOfBounds) {\r\n            if (this.position.y - this.element.clientHeight >\r\n                windowHeight + outOfBounds) {\r\n                return true;\r\n            }\r\n            if (this.position.y + this.element.clientHeight < -outOfBounds) {\r\n                return true;\r\n            }\r\n            if (this.position.x - this.element.clientWidth >\r\n                windowWidth + outOfBounds) {\r\n                return true;\r\n            }\r\n            if (this.position.x + this.element.clientWidth < -outOfBounds) {\r\n                return true;\r\n            }\r\n        }\r\n        this.updateElement();\r\n        return false;\r\n    }\r\n    /**\r\n     * Disposes of the attached DOM element upon actor death.\r\n     */\r\n    dispose() {\r\n        if (this.element.parentElement !== null) {\r\n            this.element.parentElement.removeChild(this.element);\r\n        }\r\n    }\r\n    /**\r\n     * Updates the attached DOM element to match tracking position.\r\n     */\r\n    updateElement() {\r\n        this.element.style.opacity = `${this.opacity}`;\r\n        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${Math.round(this.position.rotation)}deg)`;\r\n    }\r\n}\r\nexports.EmojiActor = EmojiActor;\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/actor.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/animator.js":
/*!****************************************************!*\
  !*** ./node_modules/emojisplosion/src/animator.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Animator = void 0;\r\n/**\r\n * Runs the regular gameplay loop of telling actors to animate.\r\n *\r\n * Each game \"tick\" is scheduled using `requestAnimationFrame`.\r\n * During each tick, each actor is told to `act` with the time elapsed.\r\n * If it indicates that it's out of bounds, it's removed from the actors array.\r\n */\r\nclass Animator {\r\n    constructor() {\r\n        /**\r\n         * Actors that have been added and not yet marked themselves as out of bounds.\r\n         */\r\n        this.actors = [];\r\n        /**\r\n         * Runs game logic for one tick.\r\n         *\r\n         * @param currentTime   Current time, in milliseconds since page load.\r\n         */\r\n        this.tick = (currentTime) => {\r\n            const timeElapsed = currentTime - this.previousTime;\r\n            for (let i = 0; i < this.actors.length; i += 1) {\r\n                const actor = this.actors[i];\r\n                if (actor.act(timeElapsed)) {\r\n                    actor.dispose();\r\n                    this.actors.splice(i, 1);\r\n                    i -= 1;\r\n                    continue;\r\n                }\r\n            }\r\n            if (this.actors.length === 0) {\r\n                return;\r\n            }\r\n            this.previousTime = currentTime;\r\n            requestAnimationFrame(this.tick);\r\n        };\r\n    }\r\n    /**\r\n     * Adds a new actor to act on each tick.\r\n     *\r\n     * @param actor   Newly created actor to add.\r\n     */\r\n    add(actor) {\r\n        this.actors.push(actor);\r\n    }\r\n    /**\r\n     * Starts gameplay and requests the first tick.\r\n     */\r\n    start() {\r\n        this.previousTime = performance.now();\r\n        requestAnimationFrame(this.tick);\r\n        return this;\r\n    }\r\n}\r\nexports.Animator = Animator;\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/animator.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/emojis.js":
/*!**************************************************!*\
  !*** ./node_modules/emojisplosion/src/emojis.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.defaultEmojis = void 0;\r\n/**\r\n * Default list of supported emojis.\r\n */\r\nexports.defaultEmojis = [\r\n    \"😁\",\r\n    \"😂\",\r\n    \"🤣\",\r\n    \"😃\",\r\n    \"😅\",\r\n    \"😆\",\r\n    \"😍\",\r\n    \"🤩\",\r\n    \"😎\",\r\n    \"🤔\",\r\n    \"😒\",\r\n    \"😭\",\r\n    \"😱\",\r\n    \"🤖\",\r\n    \"😻\",\r\n    \"🙀\",\r\n    \"🙈\",\r\n    \"🙉\",\r\n    \"🙊\",\r\n    \"🏄\",\r\n    \"💪\",\r\n    \"👌\",\r\n    \"👋\",\r\n    \"🙌\",\r\n    \"💝\",\r\n    \"💖\",\r\n    \"💗\",\r\n    \"🧡\",\r\n    \"💛\",\r\n    \"💚\",\r\n    \"💙\",\r\n    \"💜\",\r\n    \"🚀\",\r\n    \"⛄\",\r\n    // These emoji are extra fun, so they get twice the inclusion!\r\n    \"🔥\",\r\n    \"🔥\",\r\n    \"✨\",\r\n    \"✨\",\r\n    \"🎉\",\r\n    \"🎉\",\r\n    \"💯\",\r\n    \"💯\",\r\n];\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/emojis.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/emojisplosion.js":
/*!*********************************************************!*\
  !*** ./node_modules/emojisplosion/src/emojisplosion.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.emojisplosion = exports.defaultTagName = exports.defaultPosition = exports.defaultPhysics = exports.defaultEmojiCount = exports.defaultCreateContainer = exports.defaultClassName = void 0;\r\nconst actor_1 = __webpack_require__(/*! ./actor */ \"./node_modules/emojisplosion/src/actor.js\");\r\nconst animator_1 = __webpack_require__(/*! ./animator */ \"./node_modules/emojisplosion/src/animator.js\");\r\nconst emojis_1 = __webpack_require__(/*! ./emojis */ \"./node_modules/emojisplosion/src/emojis.js\");\r\nconst styles_1 = __webpack_require__(/*! ./styles */ \"./node_modules/emojisplosion/src/styles.js\");\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./node_modules/emojisplosion/src/utils.js\");\r\n/**\r\n * Default class name to add to emoji elements.\r\n */\r\nexports.defaultClassName = \"emoji-styles\";\r\n/**\r\n * Default creator for a container element.\r\n *\r\n * @returns <div /> element prepended to document.body.\r\n */\r\nexports.defaultCreateContainer = (() => {\r\n    let container;\r\n    return () => {\r\n        if ((container === null || container === void 0 ? void 0 : container.parentNode) === document.body) {\r\n            return container;\r\n        }\r\n        container = document.createElement(\"div\");\r\n        document.body.prepend(container);\r\n        return container;\r\n    };\r\n})();\r\n/**\r\n * Default emojiCount to choose a random number of emoji per blast.\r\n *\r\n * @returns Random integer within 14 to 28.\r\n */\r\nexports.defaultEmojiCount = () => Math.floor(Math.random() * 14) + 14;\r\n/**\r\n * Default runtime change constants for actor movements.\r\n */\r\nexports.defaultPhysics = {\r\n    fontSize: {\r\n        max: 28,\r\n        min: 14,\r\n    },\r\n    framerate: 60,\r\n    gravity: 0.35,\r\n    initialVelocities: {\r\n        rotation: {\r\n            max: 7,\r\n            min: -7,\r\n        },\r\n        x: {\r\n            max: 7,\r\n            min: -7,\r\n        },\r\n        y: {\r\n            max: -7,\r\n            min: -21,\r\n        },\r\n    },\r\n    preserveOutOfBounds: false,\r\n    rotation: {\r\n        max: 45,\r\n        min: -45,\r\n    },\r\n    rotationDeceleration: 0.98,\r\n};\r\n/**\r\n * Default position to choose random locations within the page.\r\n *\r\n * @returns Random { left, top } integers within the page.\r\n */\r\nexports.defaultPosition = () => ({\r\n    x: Math.random() * innerWidth,\r\n    y: Math.random() * innerHeight,\r\n});\r\n/**\r\n * Default emoji processor, which does nothing.\r\n */\r\nconst defaultProcess = () => { };\r\n/**\r\n * Default HTML tag name to create elements as.\r\n */\r\nexports.defaultTagName = \"span\";\r\n/**\r\n * Launches an emojisplosion across the page! 🎆\r\n *\r\n * @param settings   Settings to emojisplode.\r\n */\r\nexports.emojisplosion = (settings = {}) => {\r\n    const { animator = new animator_1.Animator().start(), className = exports.defaultClassName, container = exports.defaultCreateContainer, emojiCount = exports.defaultEmojiCount, emojis = emojis_1.defaultEmojis, position = exports.defaultPosition, process = defaultProcess, tagName = exports.defaultTagName, uniqueness = Infinity, } = settings;\r\n    styles_1.createStyleElementAndClass(className);\r\n    const physics = Object.assign(Object.assign(Object.assign({}, exports.defaultPhysics), settings.physics), { initialVelocities: Object.assign(Object.assign({}, exports.defaultPhysics.initialVelocities), (settings.physics !== undefined ? settings.physics.initialVelocities : {})) });\r\n    const emojiSettings = {\r\n        className,\r\n        container: utils_1.obtainValue(container),\r\n        // Copy the input array to prevent modifications.\r\n        emojis: utils_1.shuffleArray(utils_1.obtainValue(emojis))\r\n            .slice(0, utils_1.obtainValue(uniqueness)),\r\n        physics,\r\n        position: utils_1.obtainValue(position),\r\n        process,\r\n        tagName: utils_1.obtainValue(tagName),\r\n    };\r\n    const blastEmojiCount = utils_1.obtainValue(emojiCount);\r\n    for (let i = 0; i < blastEmojiCount; i += 1) {\r\n        animator.add(new actor_1.EmojiActor(emojiSettings));\r\n    }\r\n    return animator;\r\n};\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/emojisplosion.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/emojisplosions.js":
/*!**********************************************************!*\
  !*** ./node_modules/emojisplosion/src/emojisplosions.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.emojisplosions = void 0;\r\nconst emojisplosion_1 = __webpack_require__(/*! ./emojisplosion */ \"./node_modules/emojisplosion/src/emojisplosion.js\");\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./node_modules/emojisplosion/src/utils.js\");\r\n/**\r\n * Default interval setting for fire delays.\r\n *\r\n * @returns Random number between 0 and 2100.\r\n */\r\nconst defaultInterval = () => 700 + Math.floor(Math.random() * 1401);\r\n/**\r\n * Periodically emojisplodes across the page! 🎆\r\n *\r\n * @param settings   Settings to emojisplode.\r\n * @returns Handler for the ongoing emojisplosions.\r\n */\r\nexports.emojisplosions = (settings = {}) => {\r\n    const { interval = defaultInterval, scheduler = setTimeout, } = settings;\r\n    let cancelled = false;\r\n    const blast = () => emojisplosion_1.emojisplosion(settings);\r\n    const blastAndSchedule = () => {\r\n        if (cancelled) {\r\n            return;\r\n        }\r\n        if (document.visibilityState === \"visible\") {\r\n            blast();\r\n        }\r\n        scheduler(blastAndSchedule, utils_1.obtainValue(interval));\r\n    };\r\n    scheduler(blastAndSchedule, 0);\r\n    return {\r\n        blast,\r\n        cancel() {\r\n            cancelled = true;\r\n        },\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/emojisplosions.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/index.js":
/*!*************************************************!*\
  !*** ./node_modules/emojisplosion/src/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\r\n}) : (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    o[k2] = m[k];\r\n}));\r\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\r\n    for (var p in m) if (p !== \"default\" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n__exportStar(__webpack_require__(/*! ./emojis */ \"./node_modules/emojisplosion/src/emojis.js\"), exports);\r\n__exportStar(__webpack_require__(/*! ./emojisplosion */ \"./node_modules/emojisplosion/src/emojisplosion.js\"), exports);\r\n__exportStar(__webpack_require__(/*! ./emojisplosions */ \"./node_modules/emojisplosion/src/emojisplosions.js\"), exports);\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/index.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/range.js":
/*!*************************************************!*\
  !*** ./node_modules/emojisplosion/src/range.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.randomInRange = void 0;\r\n/**\r\n * Creates a random number within a range.\r\n *\r\n * @param range   [Minimum, maximum] numbers in a range.\r\n * @returns Random number within the [minimum, maximum] range.\r\n */\r\nexports.randomInRange = (range) => typeof range === \"number\"\r\n    ? range\r\n    : Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/range.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/styles.js":
/*!**************************************************!*\
  !*** ./node_modules/emojisplosion/src/styles.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createStyleElementAndClass = void 0;\r\n/**\r\n * Register of created styles link their associated CSS style elements.\r\n */\r\nconst createdStyles = new Set();\r\n/**\r\n * Registers a class name for emojis, creating a style element for it if necessary.\r\n *\r\n * @param className   Potentially new CSS class name.\r\n */\r\nexports.createStyleElementAndClass = (className) => {\r\n    if (createdStyles.has(className)) {\r\n        return;\r\n    }\r\n    createdStyles.add(className);\r\n    const element = document.createElement(\"style\");\r\n    element.type = \"text/css\";\r\n    element.appendChild(document.createTextNode(`\r\n        .${className} {\r\n            cursor: default;\r\n            margin-left: -1em;\r\n            margin-top: -1em;\r\n            position: fixed;\r\n            user-select: none;\r\n            z-index: 2147483647;\r\n        }\r\n    `));\r\n    document.head.appendChild(element);\r\n};\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/styles.js?");

/***/ }),

/***/ "./node_modules/emojisplosion/src/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/emojisplosion/src/utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.shuffleArray = exports.randomArrayMember = exports.obtainValue = void 0;\r\n/**\r\n * Grabs the value of an item or item-returning function.\r\n *\r\n * @param value   Item or item-returning function.\r\n */\r\nexports.obtainValue = (value) => typeof value === \"function\" ? value() : value;\r\n/**\r\n * Grabs a random member of an array.\r\n *\r\n * @template T   Type of items in the array.\r\n * @param array   Array of items.\r\n * @returns Random member of the array.\r\n */\r\nexports.randomArrayMember = (array) => {\r\n    return array[Math.floor(Math.random() * array.length)];\r\n};\r\n/**\r\n * Creates a shuffled version of an array.\r\n *\r\n * @template T   Type of items in the array.\r\n * @param array   Array to copy.\r\n * @returns Shuffled version of the array.\r\n */\r\nexports.shuffleArray = (array) => {\r\n    // Copy the input array to preserve immutability elsewhere\r\n    const copiedArray = array.slice();\r\n    for (let i = copiedArray.length - 1; i > 0; i -= 1) {\r\n        const swappingIndex = Math.floor(Math.random() * (i + 1));\r\n        const swapper = copiedArray[i];\r\n        copiedArray[i] = copiedArray[swappingIndex];\r\n        copiedArray[swappingIndex] = swapper;\r\n    }\r\n    return copiedArray;\r\n};\r\n\n\n//# sourceURL=webpack:///./node_modules/emojisplosion/src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./guessing/static/utils.js");
/******/ 	
/******/ })()
;