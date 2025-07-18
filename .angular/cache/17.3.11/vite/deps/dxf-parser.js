import {
  __commonJS,
  __toESM
} from "./chunk-ASLTLD6L.js";

// node_modules/loglevel/lib/loglevel.js
var require_loglevel = __commonJS({
  "node_modules/loglevel/lib/loglevel.js"(exports, module) {
    (function(root, definition) {
      "use strict";
      if (typeof define === "function" && define.amd) {
        define(definition);
      } else if (typeof module === "object" && module.exports) {
        module.exports = definition();
      } else {
        root.log = definition();
      }
    })(exports, function() {
      "use strict";
      var noop = function() {
      };
      var undefinedType = "undefined";
      var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
      var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
      ];
      var _loggersByName = {};
      var defaultLogger = null;
      function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === "function") {
          return method.bind(obj);
        } else {
          try {
            return Function.prototype.bind.call(method, obj);
          } catch (e) {
            return function() {
              return Function.prototype.apply.apply(method, [obj, arguments]);
            };
          }
        }
      }
      function traceForIE() {
        if (console.log) {
          if (console.log.apply) {
            console.log.apply(console, arguments);
          } else {
            Function.prototype.apply.apply(console.log, [console, arguments]);
          }
        }
        if (console.trace)
          console.trace();
      }
      function realMethod(methodName) {
        if (methodName === "debug") {
          methodName = "log";
        }
        if (typeof console === undefinedType) {
          return false;
        } else if (methodName === "trace" && isIE) {
          return traceForIE;
        } else if (console[methodName] !== void 0) {
          return bindMethod(console, methodName);
        } else if (console.log !== void 0) {
          return bindMethod(console, "log");
        } else {
          return noop;
        }
      }
      function replaceLoggingMethods() {
        var level = this.getLevel();
        for (var i = 0; i < logMethods.length; i++) {
          var methodName = logMethods[i];
          this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
        }
        this.log = this.debug;
        if (typeof console === undefinedType && level < this.levels.SILENT) {
          return "No console available for logging";
        }
      }
      function enableLoggingWhenConsoleArrives(methodName) {
        return function() {
          if (typeof console !== undefinedType) {
            replaceLoggingMethods.call(this);
            this[methodName].apply(this, arguments);
          }
        };
      }
      function defaultMethodFactory(methodName, _level, _loggerName) {
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
      }
      function Logger(name, factory) {
        var self = this;
        var inheritedLevel;
        var defaultLevel;
        var userLevel;
        var storageKey = "loglevel";
        if (typeof name === "string") {
          storageKey += ":" + name;
        } else if (typeof name === "symbol") {
          storageKey = void 0;
        }
        function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || "silent").toUpperCase();
          if (typeof window === undefinedType || !storageKey)
            return;
          try {
            window.localStorage[storageKey] = levelName;
            return;
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {
          }
        }
        function getPersistedLevel() {
          var storedLevel;
          if (typeof window === undefinedType || !storageKey)
            return;
          try {
            storedLevel = window.localStorage[storageKey];
          } catch (ignore) {
          }
          if (typeof storedLevel === undefinedType) {
            try {
              var cookie = window.document.cookie;
              var cookieName = encodeURIComponent(storageKey);
              var location = cookie.indexOf(cookieName + "=");
              if (location !== -1) {
                storedLevel = /^([^;]+)/.exec(
                  cookie.slice(location + cookieName.length + 1)
                )[1];
              }
            } catch (ignore) {
            }
          }
          if (self.levels[storedLevel] === void 0) {
            storedLevel = void 0;
          }
          return storedLevel;
        }
        function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey)
            return;
          try {
            window.localStorage.removeItem(storageKey);
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch (ignore) {
          }
        }
        function normalizeLevel(input) {
          var level = input;
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== void 0) {
            level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
            return level;
          } else {
            throw new TypeError("log.setLevel() called with invalid level: " + input);
          }
        }
        self.name = name;
        self.levels = {
          "TRACE": 0,
          "DEBUG": 1,
          "INFO": 2,
          "WARN": 3,
          "ERROR": 4,
          "SILENT": 5
        };
        self.methodFactory = factory || defaultMethodFactory;
        self.getLevel = function() {
          if (userLevel != null) {
            return userLevel;
          } else if (defaultLevel != null) {
            return defaultLevel;
          } else {
            return inheritedLevel;
          }
        };
        self.setLevel = function(level, persist) {
          userLevel = normalizeLevel(level);
          if (persist !== false) {
            persistLevelIfPossible(userLevel);
          }
          return replaceLoggingMethods.call(self);
        };
        self.setDefaultLevel = function(level) {
          defaultLevel = normalizeLevel(level);
          if (!getPersistedLevel()) {
            self.setLevel(level, false);
          }
        };
        self.resetLevel = function() {
          userLevel = null;
          clearPersistedLevel();
          replaceLoggingMethods.call(self);
        };
        self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
        };
        self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
        };
        self.rebuild = function() {
          if (defaultLogger !== self) {
            inheritedLevel = normalizeLevel(defaultLogger.getLevel());
          }
          replaceLoggingMethods.call(self);
          if (defaultLogger === self) {
            for (var childName in _loggersByName) {
              _loggersByName[childName].rebuild();
            }
          }
        };
        inheritedLevel = normalizeLevel(
          defaultLogger ? defaultLogger.getLevel() : "WARN"
        );
        var initialLevel = getPersistedLevel();
        if (initialLevel != null) {
          userLevel = normalizeLevel(initialLevel);
        }
        replaceLoggingMethods.call(self);
      }
      defaultLogger = new Logger();
      defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }
        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name,
            defaultLogger.methodFactory
          );
        }
        return logger;
      };
      var _log = typeof window !== undefinedType ? window.log : void 0;
      defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
          window.log = _log;
        }
        return defaultLogger;
      };
      defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
      };
      defaultLogger["default"] = defaultLogger;
      return defaultLogger;
    });
  }
});

// node_modules/dxf-parser/dist/DxfArrayScanner.js
var DxfArrayScanner = class {
  constructor(data) {
    this._pointer = 0;
    this._eof = false;
    this._data = data;
  }
  /**
   * Gets the next group (code, value) from the array. A group is two consecutive elements
   * in the array. The first is the code, the second is the value.
   * @returns {{code: Number}|*}
   */
  next() {
    if (!this.hasNext()) {
      if (!this._eof)
        throw new Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
      else
        throw new Error("Cannot call 'next' after EOF group has been read");
    }
    const group = {
      code: parseInt(this._data[this._pointer])
    };
    this._pointer++;
    group.value = parseGroupValue(group.code, this._data[this._pointer].trim());
    this._pointer++;
    if (group.code === 0 && group.value === "EOF")
      this._eof = true;
    this.lastReadGroup = group;
    return group;
  }
  peek() {
    if (!this.hasNext()) {
      if (!this._eof)
        throw new Error("Unexpected end of input: EOF group not read before end of file. Ended on code " + this._data[this._pointer]);
      else
        throw new Error("Cannot call 'next' after EOF group has been read");
    }
    const group = {
      code: parseInt(this._data[this._pointer])
    };
    group.value = parseGroupValue(group.code, this._data[this._pointer + 1].trim());
    return group;
  }
  rewind(numberOfGroups = 1) {
    this._pointer = this._pointer - numberOfGroups * 2;
  }
  /**
   * Returns true if there is another code/value pair (2 elements in the array).
   * @returns {boolean}
   */
  hasNext() {
    if (this._eof) {
      return false;
    }
    if (this._pointer > this._data.length - 2) {
      return false;
    }
    return true;
  }
  /**
   * Returns true if the scanner is at the end of the array
   * @returns {boolean}
   */
  isEOF() {
    return this._eof;
  }
};
function parseGroupValue(code, value) {
  if (code <= 9)
    return value;
  if (code >= 10 && code <= 59)
    return parseFloat(value);
  if (code >= 60 && code <= 99)
    return parseInt(value);
  if (code >= 100 && code <= 109)
    return value;
  if (code >= 110 && code <= 149)
    return parseFloat(value);
  if (code >= 160 && code <= 179)
    return parseInt(value);
  if (code >= 210 && code <= 239)
    return parseFloat(value);
  if (code >= 270 && code <= 289)
    return parseInt(value);
  if (code >= 290 && code <= 299)
    return parseBoolean(value);
  if (code >= 300 && code <= 369)
    return value;
  if (code >= 370 && code <= 389)
    return parseInt(value);
  if (code >= 390 && code <= 399)
    return value;
  if (code >= 400 && code <= 409)
    return parseInt(value);
  if (code >= 410 && code <= 419)
    return value;
  if (code >= 420 && code <= 429)
    return parseInt(value);
  if (code >= 430 && code <= 439)
    return value;
  if (code >= 440 && code <= 459)
    return parseInt(value);
  if (code >= 460 && code <= 469)
    return parseFloat(value);
  if (code >= 470 && code <= 481)
    return value;
  if (code === 999)
    return value;
  if (code >= 1e3 && code <= 1009)
    return value;
  if (code >= 1010 && code <= 1059)
    return parseFloat(value);
  if (code >= 1060 && code <= 1071)
    return parseInt(value);
  console.log("WARNING: Group code does not have a defined type: %j", { code, value });
  return value;
}
function parseBoolean(str) {
  if (str === "0")
    return false;
  if (str === "1")
    return true;
  throw TypeError("String '" + str + "' cannot be cast to Boolean type");
}

// node_modules/dxf-parser/dist/AutoCadColorIndex.js
var AutoCadColorIndex_default = [
  0,
  16711680,
  16776960,
  65280,
  65535,
  255,
  16711935,
  16777215,
  8421504,
  12632256,
  16711680,
  16744319,
  13369344,
  13395558,
  10027008,
  10046540,
  8323072,
  8339263,
  4980736,
  4990502,
  16727808,
  16752511,
  13382400,
  13401958,
  10036736,
  10051404,
  8331008,
  8343359,
  4985600,
  4992806,
  16744192,
  16760703,
  13395456,
  13408614,
  10046464,
  10056268,
  8339200,
  8347455,
  4990464,
  4995366,
  16760576,
  16768895,
  13408512,
  13415014,
  10056192,
  10061132,
  8347392,
  8351551,
  4995328,
  4997670,
  16776960,
  16777087,
  13421568,
  13421670,
  10000384,
  10000460,
  8355584,
  8355647,
  5000192,
  5000230,
  12582656,
  14679935,
  10079232,
  11717734,
  7510016,
  8755276,
  6258432,
  7307071,
  3755008,
  4344870,
  8388352,
  12582783,
  6736896,
  10079334,
  5019648,
  7510092,
  4161280,
  6258495,
  2509824,
  3755046,
  4194048,
  10485631,
  3394560,
  8375398,
  2529280,
  6264908,
  2064128,
  5209919,
  1264640,
  3099686,
  65280,
  8388479,
  52224,
  6736998,
  38912,
  5019724,
  32512,
  4161343,
  19456,
  2509862,
  65343,
  8388511,
  52275,
  6737023,
  38950,
  5019743,
  32543,
  4161359,
  19475,
  2509871,
  65407,
  8388543,
  52326,
  6737049,
  38988,
  5019762,
  32575,
  4161375,
  19494,
  2509881,
  65471,
  8388575,
  52377,
  6737074,
  39026,
  5019781,
  32607,
  4161391,
  19513,
  2509890,
  65535,
  8388607,
  52428,
  6737100,
  39064,
  5019800,
  32639,
  4161407,
  19532,
  2509900,
  49151,
  8380415,
  39372,
  6730444,
  29336,
  5014936,
  24447,
  4157311,
  14668,
  2507340,
  32767,
  8372223,
  26316,
  6724044,
  19608,
  5010072,
  16255,
  4153215,
  9804,
  2505036,
  16383,
  8364031,
  13260,
  6717388,
  9880,
  5005208,
  8063,
  4149119,
  4940,
  2502476,
  255,
  8355839,
  204,
  6710988,
  152,
  5000344,
  127,
  4145023,
  76,
  2500172,
  4129023,
  10452991,
  3342540,
  8349388,
  2490520,
  6245528,
  2031743,
  5193599,
  1245260,
  3089996,
  8323327,
  12550143,
  6684876,
  10053324,
  4980888,
  7490712,
  4128895,
  6242175,
  2490444,
  3745356,
  12517631,
  14647295,
  10027212,
  11691724,
  7471256,
  8735896,
  6226047,
  7290751,
  3735628,
  4335180,
  16711935,
  16744447,
  13369548,
  13395660,
  9961624,
  9981080,
  8323199,
  8339327,
  4980812,
  4990540,
  16711871,
  16744415,
  13369497,
  13395634,
  9961586,
  9981061,
  8323167,
  8339311,
  4980793,
  4990530,
  16711807,
  16744383,
  13369446,
  13395609,
  9961548,
  9981042,
  8323135,
  8339295,
  4980774,
  4990521,
  16711743,
  16744351,
  13369395,
  13395583,
  9961510,
  9981023,
  8323103,
  8339279,
  4980755,
  4990511,
  3355443,
  5987163,
  8684676,
  11382189,
  14079702,
  16777215
];

// node_modules/dxf-parser/dist/ParseHelpers.js
function getAcadColor(index) {
  return AutoCadColorIndex_default[index];
}
function parsePoint(scanner) {
  const point = {};
  scanner.rewind();
  let curr = scanner.next();
  let code = curr.code;
  point.x = curr.value;
  code += 10;
  curr = scanner.next();
  if (curr.code != code)
    throw new Error("Expected code for point value to be " + code + " but got " + curr.code + ".");
  point.y = curr.value;
  code += 10;
  curr = scanner.next();
  if (curr.code != code) {
    scanner.rewind();
    return point;
  }
  point.z = curr.value;
  return point;
}
function checkCommonEntityProperties(entity, curr, scanner) {
  switch (curr.code) {
    case 0:
      entity.type = curr.value;
      break;
    case 5:
      entity.handle = curr.value;
      break;
    case 6:
      entity.lineType = curr.value;
      break;
    case 8:
      entity.layer = curr.value;
      break;
    case 48:
      entity.lineTypeScale = curr.value;
      break;
    case 60:
      entity.visible = curr.value === 0;
      break;
    case 62:
      entity.colorIndex = curr.value;
      entity.color = getAcadColor(Math.abs(curr.value));
      break;
    case 67:
      entity.inPaperSpace = curr.value !== 0;
      break;
    case 100:
      break;
    case 101:
      while (curr.code != 0) {
        curr = scanner.next();
      }
      scanner.rewind();
      break;
    case 330:
      entity.ownerHandle = curr.value;
      break;
    case 347:
      entity.materialObjectHandle = curr.value;
      break;
    case 370:
      entity.lineweight = curr.value;
      break;
    case 420:
      entity.color = curr.value;
      break;
    case 1e3:
      entity.extendedData = entity.extendedData || {};
      entity.extendedData.customStrings = entity.extendedData.customStrings || [];
      entity.extendedData.customStrings.push(curr.value);
      break;
    case 1001:
      entity.extendedData = entity.extendedData || {};
      entity.extendedData.applicationName = curr.value;
      break;
    default:
      return false;
  }
  return true;
}

// node_modules/dxf-parser/dist/entities/3dface.js
var ThreeDface = class {
  constructor() {
    this.ForEntityName = "3DFACE";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value, vertices: [] };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 70:
          entity.shape = (curr.value & 1) === 1;
          entity.hasContinuousLinetypePattern = (curr.value & 128) === 128;
          break;
        case 10:
          entity.vertices = parse3dFaceVertices(scanner, curr);
          curr = scanner.lastReadGroup;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};
function parse3dFaceVertices(scanner, curr) {
  var vertices = [];
  var vertexIsStarted = false;
  var vertexIsFinished = false;
  var verticesPer3dFace = 4;
  for (let i = 0; i <= verticesPer3dFace; i++) {
    var vertex = {};
    while (!scanner.isEOF()) {
      if (curr.code === 0 || vertexIsFinished)
        break;
      switch (curr.code) {
        case 10:
        case 11:
        case 12:
        case 13:
          if (vertexIsStarted) {
            vertexIsFinished = true;
            continue;
          }
          vertex.x = curr.value;
          vertexIsStarted = true;
          break;
        case 20:
        case 21:
        case 22:
        case 23:
          vertex.y = curr.value;
          break;
        case 30:
        case 31:
        case 32:
        case 33:
          vertex.z = curr.value;
          break;
        default:
          return vertices;
      }
      curr = scanner.next();
    }
    vertices.push(vertex);
    vertexIsStarted = false;
    vertexIsFinished = false;
  }
  scanner.rewind();
  return vertices;
}

// node_modules/dxf-parser/dist/entities/arc.js
var Arc = class {
  constructor() {
    this.ForEntityName = "ARC";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.center = parsePoint(scanner);
          break;
        case 40:
          entity.radius = curr.value;
          break;
        case 50:
          entity.startAngle = Math.PI / 180 * curr.value;
          break;
        case 51:
          entity.endAngle = Math.PI / 180 * curr.value;
          entity.angleLength = entity.endAngle - entity.startAngle;
          break;
        case 210:
          entity.extrusionDirectionX = curr.value;
          break;
        case 220:
          entity.extrusionDirectionY = curr.value;
          break;
        case 230:
          entity.extrusionDirectionZ = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/attdef.js
var Attdef = class {
  constructor() {
    this.ForEntityName = "ATTDEF";
  }
  parseEntity(scanner, curr) {
    var entity = {
      type: curr.value,
      scale: 1,
      textStyle: "STANDARD"
    };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0) {
        break;
      }
      switch (curr.code) {
        case 1:
          entity.text = curr.value;
          break;
        case 2:
          entity.tag = curr.value;
          break;
        case 3:
          entity.prompt = curr.value;
          break;
        case 7:
          entity.textStyle = curr.value;
          break;
        case 10:
          entity.startPoint = parsePoint(scanner);
          break;
        case 11:
          entity.endPoint = parsePoint(scanner);
          break;
        case 39:
          entity.thickness = curr.value;
          break;
        case 40:
          entity.textHeight = curr.value;
          break;
        case 41:
          entity.scale = curr.value;
          break;
        case 50:
          entity.rotation = curr.value;
          break;
        case 51:
          entity.obliqueAngle = curr.value;
          break;
        case 70:
          entity.invisible = !!(curr.value & 1);
          entity.constant = !!(curr.value & 2);
          entity.verificationRequired = !!(curr.value & 4);
          entity.preset = !!(curr.value & 8);
          break;
        case 71:
          entity.backwards = !!(curr.value & 2);
          entity.mirrored = !!(curr.value & 4);
          break;
        case 72:
          entity.horizontalJustification = curr.value;
          break;
        case 73:
          entity.fieldLength = curr.value;
          break;
        case 74:
          entity.verticalJustification = curr.value;
          break;
        case 100:
          break;
        case 210:
          entity.extrusionDirectionX = curr.value;
          break;
        case 220:
          entity.extrusionDirectionY = curr.value;
          break;
        case 230:
          entity.extrusionDirectionZ = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/circle.js
var Circle = class {
  constructor() {
    this.ForEntityName = "CIRCLE";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.center = parsePoint(scanner);
          break;
        case 40:
          entity.radius = curr.value;
          break;
        case 50:
          entity.startAngle = Math.PI / 180 * curr.value;
          break;
        case 51:
          const endAngle = Math.PI / 180 * curr.value;
          if (endAngle < entity.startAngle)
            entity.angleLength = endAngle + 2 * Math.PI - entity.startAngle;
          else
            entity.angleLength = endAngle - entity.startAngle;
          entity.endAngle = endAngle;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/dimension.js
var Dimension = class {
  constructor() {
    this.ForEntityName = "DIMENSION";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 2:
          entity.block = curr.value;
          break;
        case 10:
          entity.anchorPoint = parsePoint(scanner);
          break;
        case 11:
          entity.middleOfText = parsePoint(scanner);
          break;
        case 12:
          entity.insertionPoint = parsePoint(scanner);
          break;
        case 13:
          entity.linearOrAngularPoint1 = parsePoint(scanner);
          break;
        case 14:
          entity.linearOrAngularPoint2 = parsePoint(scanner);
          break;
        case 15:
          entity.diameterOrRadiusPoint = parsePoint(scanner);
          break;
        case 16:
          entity.arcPoint = parsePoint(scanner);
          break;
        case 70:
          entity.dimensionType = curr.value;
          break;
        case 71:
          entity.attachmentPoint = curr.value;
          break;
        case 42:
          entity.actualMeasurement = curr.value;
          break;
        case 1:
          entity.text = curr.value;
          break;
        case 50:
          entity.angle = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/ellipse.js
var Ellipse = class {
  constructor() {
    this.ForEntityName = "ELLIPSE";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.center = parsePoint(scanner);
          break;
        case 11:
          entity.majorAxisEndPoint = parsePoint(scanner);
          break;
        case 40:
          entity.axisRatio = curr.value;
          break;
        case 41:
          entity.startAngle = curr.value;
          break;
        case 42:
          entity.endAngle = curr.value;
          break;
        case 2:
          entity.name = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/insert.js
var Insert = class {
  constructor() {
    this.ForEntityName = "INSERT";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 2:
          entity.name = curr.value;
          break;
        case 41:
          entity.xScale = curr.value;
          break;
        case 42:
          entity.yScale = curr.value;
          break;
        case 43:
          entity.zScale = curr.value;
          break;
        case 10:
          entity.position = parsePoint(scanner);
          break;
        case 50:
          entity.rotation = curr.value;
          break;
        case 70:
          entity.columnCount = curr.value;
          break;
        case 71:
          entity.rowCount = curr.value;
          break;
        case 44:
          entity.columnSpacing = curr.value;
          break;
        case 45:
          entity.rowSpacing = curr.value;
          break;
        case 210:
          entity.extrusionDirection = parsePoint(scanner);
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/line.js
var Line = class {
  constructor() {
    this.ForEntityName = "LINE";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value, vertices: [] };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.vertices.unshift(parsePoint(scanner));
          break;
        case 11:
          entity.vertices.push(parsePoint(scanner));
          break;
        case 210:
          entity.extrusionDirection = parsePoint(scanner);
          break;
        case 100:
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/lwpolyline.js
var Lwpolyline = class {
  constructor() {
    this.ForEntityName = "LWPOLYLINE";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value, vertices: [] };
    let numberOfVertices = 0;
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 38:
          entity.elevation = curr.value;
          break;
        case 39:
          entity.depth = curr.value;
          break;
        case 70:
          entity.shape = (curr.value & 1) === 1;
          entity.hasContinuousLinetypePattern = (curr.value & 128) === 128;
          break;
        case 90:
          numberOfVertices = curr.value;
          break;
        case 10:
          entity.vertices = parseLWPolylineVertices(numberOfVertices, scanner);
          break;
        case 43:
          if (curr.value !== 0)
            entity.width = curr.value;
          break;
        case 210:
          entity.extrusionDirectionX = curr.value;
          break;
        case 220:
          entity.extrusionDirectionY = curr.value;
          break;
        case 230:
          entity.extrusionDirectionZ = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};
function parseLWPolylineVertices(n, scanner) {
  if (!n || n <= 0)
    throw Error("n must be greater than 0 verticies");
  const vertices = [];
  let vertexIsStarted = false;
  let vertexIsFinished = false;
  let curr = scanner.lastReadGroup;
  for (let i = 0; i < n; i++) {
    const vertex = {};
    while (!scanner.isEOF()) {
      if (curr.code === 0 || vertexIsFinished)
        break;
      switch (curr.code) {
        case 10:
          if (vertexIsStarted) {
            vertexIsFinished = true;
            continue;
          }
          vertex.x = curr.value;
          vertexIsStarted = true;
          break;
        case 20:
          vertex.y = curr.value;
          break;
        case 30:
          vertex.z = curr.value;
          break;
        case 40:
          vertex.startWidth = curr.value;
          break;
        case 41:
          vertex.endWidth = curr.value;
          break;
        case 42:
          if (curr.value != 0)
            vertex.bulge = curr.value;
          break;
        default:
          scanner.rewind();
          if (vertexIsStarted) {
            vertices.push(vertex);
          }
          scanner.rewind();
          return vertices;
      }
      curr = scanner.next();
    }
    vertices.push(vertex);
    vertexIsStarted = false;
    vertexIsFinished = false;
  }
  scanner.rewind();
  return vertices;
}

// node_modules/dxf-parser/dist/entities/mtext.js
var Mtext = class {
  constructor() {
    this.ForEntityName = "MTEXT";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 3:
          entity.text ? entity.text += curr.value : entity.text = curr.value;
          break;
        case 1:
          entity.text ? entity.text += curr.value : entity.text = curr.value;
          break;
        case 10:
          entity.position = parsePoint(scanner);
          break;
        case 11:
          entity.directionVector = parsePoint(scanner);
          break;
        case 40:
          entity.height = curr.value;
          break;
        case 41:
          entity.width = curr.value;
          break;
        case 50:
          entity.rotation = curr.value;
          break;
        case 71:
          entity.attachmentPoint = curr.value;
          break;
        case 72:
          entity.drawingDirection = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/point.js
var Point = class {
  constructor() {
    this.ForEntityName = "POINT";
  }
  parseEntity(scanner, curr) {
    const type = curr.value;
    const entity = { type };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.position = parsePoint(scanner);
          break;
        case 39:
          entity.thickness = curr.value;
          break;
        case 210:
          entity.extrusionDirection = parsePoint(scanner);
          break;
        case 100:
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/vertex.js
var Vertex = class {
  constructor() {
    this.ForEntityName = "VERTEX";
  }
  parseEntity(scanner, curr) {
    var entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.x = curr.value;
          break;
        case 20:
          entity.y = curr.value;
          break;
        case 30:
          entity.z = curr.value;
          break;
        case 40:
          break;
        case 41:
          break;
        case 42:
          if (curr.value != 0)
            entity.bulge = curr.value;
          break;
        case 70:
          entity.curveFittingVertex = (curr.value & 1) !== 0;
          entity.curveFitTangent = (curr.value & 2) !== 0;
          entity.splineVertex = (curr.value & 8) !== 0;
          entity.splineControlPoint = (curr.value & 16) !== 0;
          entity.threeDPolylineVertex = (curr.value & 32) !== 0;
          entity.threeDPolylineMesh = (curr.value & 64) !== 0;
          entity.polyfaceMeshVertex = (curr.value & 128) !== 0;
          break;
        case 50:
          break;
        case 71:
          entity.faceA = curr.value;
          break;
        case 72:
          entity.faceB = curr.value;
          break;
        case 73:
          entity.faceC = curr.value;
          break;
        case 74:
          entity.faceD = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/polyline.js
var Polyline = class {
  constructor() {
    this.ForEntityName = "POLYLINE";
  }
  parseEntity(scanner, curr) {
    var entity = { type: curr.value, vertices: [] };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          break;
        case 20:
          break;
        case 30:
          break;
        case 39:
          entity.thickness = curr.value;
          break;
        case 40:
          break;
        case 41:
          break;
        case 70:
          entity.shape = (curr.value & 1) !== 0;
          entity.includesCurveFitVertices = (curr.value & 2) !== 0;
          entity.includesSplineFitVertices = (curr.value & 4) !== 0;
          entity.is3dPolyline = (curr.value & 8) !== 0;
          entity.is3dPolygonMesh = (curr.value & 16) !== 0;
          entity.is3dPolygonMeshClosed = (curr.value & 32) !== 0;
          entity.isPolyfaceMesh = (curr.value & 64) !== 0;
          entity.hasContinuousLinetypePattern = (curr.value & 128) !== 0;
          break;
        case 71:
          break;
        case 72:
          break;
        case 73:
          break;
        case 74:
          break;
        case 75:
          break;
        case 210:
          entity.extrusionDirection = parsePoint(scanner);
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    entity.vertices = parsePolylineVertices(scanner, curr);
    return entity;
  }
};
function parsePolylineVertices(scanner, curr) {
  const vertexParser = new Vertex();
  const vertices = [];
  while (!scanner.isEOF()) {
    if (curr.code === 0) {
      if (curr.value === "VERTEX") {
        vertices.push(vertexParser.parseEntity(scanner, curr));
        curr = scanner.lastReadGroup;
      } else if (curr.value === "SEQEND") {
        parseSeqEnd(scanner, curr);
        break;
      }
    }
  }
  return vertices;
}
function parseSeqEnd(scanner, curr) {
  const entity = { type: curr.value };
  curr = scanner.next();
  while (!scanner.isEOF()) {
    if (curr.code == 0)
      break;
    checkCommonEntityProperties(entity, curr, scanner);
    curr = scanner.next();
  }
  return entity;
}

// node_modules/dxf-parser/dist/entities/solid.js
var Solid = class {
  constructor() {
    this.ForEntityName = "SOLID";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value, points: [] };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.points[0] = parsePoint(scanner);
          break;
        case 11:
          entity.points[1] = parsePoint(scanner);
          break;
        case 12:
          entity.points[2] = parsePoint(scanner);
          break;
        case 13:
          entity.points[3] = parsePoint(scanner);
          break;
        case 210:
          entity.extrusionDirection = parsePoint(scanner);
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/spline.js
var Spline = class {
  constructor() {
    this.ForEntityName = "SPLINE";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          if (!entity.controlPoints)
            entity.controlPoints = [];
          entity.controlPoints.push(parsePoint(scanner));
          break;
        case 11:
          if (!entity.fitPoints)
            entity.fitPoints = [];
          entity.fitPoints.push(parsePoint(scanner));
          break;
        case 12:
          entity.startTangent = parsePoint(scanner);
          break;
        case 13:
          entity.endTangent = parsePoint(scanner);
          break;
        case 40:
          if (!entity.knotValues)
            entity.knotValues = [];
          entity.knotValues.push(curr.value);
          break;
        case 70:
          if ((curr.value & 1) != 0)
            entity.closed = true;
          if ((curr.value & 2) != 0)
            entity.periodic = true;
          if ((curr.value & 4) != 0)
            entity.rational = true;
          if ((curr.value & 8) != 0)
            entity.planar = true;
          if ((curr.value & 16) != 0) {
            entity.planar = true;
            entity.linear = true;
          }
          break;
        case 71:
          entity.degreeOfSplineCurve = curr.value;
          break;
        case 72:
          entity.numberOfKnots = curr.value;
          break;
        case 73:
          entity.numberOfControlPoints = curr.value;
          break;
        case 74:
          entity.numberOfFitPoints = curr.value;
          break;
        case 210:
          entity.normalVector = parsePoint(scanner);
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/entities/text.js
var Text = class {
  constructor() {
    this.ForEntityName = "TEXT";
  }
  parseEntity(scanner, curr) {
    const entity = { type: curr.value };
    curr = scanner.next();
    while (!scanner.isEOF()) {
      if (curr.code === 0)
        break;
      switch (curr.code) {
        case 10:
          entity.startPoint = parsePoint(scanner);
          break;
        case 11:
          entity.endPoint = parsePoint(scanner);
          break;
        case 40:
          entity.textHeight = curr.value;
          break;
        case 41:
          entity.xScale = curr.value;
          break;
        case 50:
          entity.rotation = curr.value;
          break;
        case 1:
          entity.text = curr.value;
          break;
        case 72:
          entity.halign = curr.value;
          break;
        case 73:
          entity.valign = curr.value;
          break;
        default:
          checkCommonEntityProperties(entity, curr, scanner);
          break;
      }
      curr = scanner.next();
    }
    return entity;
  }
};

// node_modules/dxf-parser/dist/DxfParser.js
var import_loglevel = __toESM(require_loglevel());
import_loglevel.default.setLevel("error");
function registerDefaultEntityHandlers(dxfParser) {
  dxfParser.registerEntityHandler(ThreeDface);
  dxfParser.registerEntityHandler(Arc);
  dxfParser.registerEntityHandler(Attdef);
  dxfParser.registerEntityHandler(Circle);
  dxfParser.registerEntityHandler(Dimension);
  dxfParser.registerEntityHandler(Ellipse);
  dxfParser.registerEntityHandler(Insert);
  dxfParser.registerEntityHandler(Line);
  dxfParser.registerEntityHandler(Lwpolyline);
  dxfParser.registerEntityHandler(Mtext);
  dxfParser.registerEntityHandler(Point);
  dxfParser.registerEntityHandler(Polyline);
  dxfParser.registerEntityHandler(Solid);
  dxfParser.registerEntityHandler(Spline);
  dxfParser.registerEntityHandler(Text);
}
var DxfParser = class {
  constructor() {
    this._entityHandlers = {};
    registerDefaultEntityHandlers(this);
  }
  parse(source) {
    if (typeof source === "string") {
      return this._parse(source);
    } else {
      console.error("Cannot read dxf source of type `" + typeof source);
      return null;
    }
  }
  registerEntityHandler(handlerType) {
    const instance = new handlerType();
    this._entityHandlers[instance.ForEntityName] = instance;
  }
  parseSync(source) {
    return this.parse(source);
  }
  parseStream(stream) {
    let dxfString = "";
    const self = this;
    return new Promise((res, rej) => {
      stream.on("data", (chunk) => {
        dxfString += chunk;
      });
      stream.on("end", () => {
        try {
          res(self._parse(dxfString));
        } catch (err) {
          rej(err);
        }
      });
      stream.on("error", (err) => {
        rej(err);
      });
    });
  }
  _parse(dxfString) {
    const dxf = {};
    let lastHandle = 0;
    const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
    const scanner = new DxfArrayScanner(dxfLinesArray);
    if (!scanner.hasNext())
      throw Error("Empty file");
    const self = this;
    let curr;
    function parseAll() {
      curr = scanner.next();
      while (!scanner.isEOF()) {
        if (curr.code === 0 && curr.value === "SECTION") {
          curr = scanner.next();
          if (curr.code !== 2) {
            console.error("Unexpected code %s after 0:SECTION", debugCode(curr));
            curr = scanner.next();
            continue;
          }
          if (curr.value === "HEADER") {
            import_loglevel.default.debug("> HEADER");
            dxf.header = parseHeader();
            import_loglevel.default.debug("<");
          } else if (curr.value === "BLOCKS") {
            import_loglevel.default.debug("> BLOCKS");
            dxf.blocks = parseBlocks();
            import_loglevel.default.debug("<");
          } else if (curr.value === "ENTITIES") {
            import_loglevel.default.debug("> ENTITIES");
            dxf.entities = parseEntities(false);
            import_loglevel.default.debug("<");
          } else if (curr.value === "TABLES") {
            import_loglevel.default.debug("> TABLES");
            dxf.tables = parseTables();
            import_loglevel.default.debug("<");
          } else if (curr.value === "EOF") {
            import_loglevel.default.debug("EOF");
          } else {
            import_loglevel.default.warn("Skipping section '%s'", curr.value);
          }
        } else {
          curr = scanner.next();
        }
      }
    }
    function parseHeader() {
      let currVarName = null;
      let currVarValue = null;
      const header = {};
      curr = scanner.next();
      while (true) {
        if (groupIs(curr, 0, "ENDSEC")) {
          if (currVarName)
            header[currVarName] = currVarValue;
          break;
        } else if (curr.code === 9) {
          if (currVarName)
            header[currVarName] = currVarValue;
          currVarName = curr.value;
        } else {
          if (curr.code === 10) {
            currVarValue = { x: curr.value };
          } else if (curr.code === 20) {
            currVarValue.y = curr.value;
          } else if (curr.code === 30) {
            currVarValue.z = curr.value;
          } else {
            currVarValue = curr.value;
          }
        }
        curr = scanner.next();
      }
      curr = scanner.next();
      return header;
    }
    function parseBlocks() {
      const blocks = {};
      curr = scanner.next();
      while (curr.value !== "EOF") {
        if (groupIs(curr, 0, "ENDSEC")) {
          break;
        }
        if (groupIs(curr, 0, "BLOCK")) {
          import_loglevel.default.debug("block {");
          const block = parseBlock();
          import_loglevel.default.debug("}");
          ensureHandle(block);
          if (!block.name)
            import_loglevel.default.error('block with handle "' + block.handle + '" is missing a name.');
          else
            blocks[block.name] = block;
        } else {
          logUnhandledGroup(curr);
          curr = scanner.next();
        }
      }
      return blocks;
    }
    function parseBlock() {
      const block = {};
      curr = scanner.next();
      while (curr.value !== "EOF") {
        switch (curr.code) {
          case 1:
            block.xrefPath = curr.value;
            curr = scanner.next();
            break;
          case 2:
            block.name = curr.value;
            curr = scanner.next();
            break;
          case 3:
            block.name2 = curr.value;
            curr = scanner.next();
            break;
          case 5:
            block.handle = curr.value;
            curr = scanner.next();
            break;
          case 8:
            block.layer = curr.value;
            curr = scanner.next();
            break;
          case 10:
            block.position = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 67:
            block.paperSpace = curr.value && curr.value == 1 ? true : false;
            curr = scanner.next();
            break;
          case 70:
            if (curr.value != 0) {
              block.type = curr.value;
            }
            curr = scanner.next();
            break;
          case 100:
            curr = scanner.next();
            break;
          case 330:
            block.ownerHandle = curr.value;
            curr = scanner.next();
            break;
          case 0:
            if (curr.value == "ENDBLK")
              break;
            block.entities = parseEntities(true);
            break;
          default:
            logUnhandledGroup(curr);
            curr = scanner.next();
        }
        if (groupIs(curr, 0, "ENDBLK")) {
          curr = scanner.next();
          break;
        }
      }
      return block;
    }
    function parseTables() {
      const tables = {};
      curr = scanner.next();
      while (curr.value !== "EOF") {
        if (groupIs(curr, 0, "ENDSEC"))
          break;
        if (groupIs(curr, 0, "TABLE")) {
          curr = scanner.next();
          const tableDefinition = tableDefinitions[curr.value];
          if (tableDefinition) {
            import_loglevel.default.debug(curr.value + " Table {");
            tables[tableDefinitions[curr.value].tableName] = parseTable(curr);
            import_loglevel.default.debug("}");
          } else {
            import_loglevel.default.debug("Unhandled Table " + curr.value);
          }
        } else {
          curr = scanner.next();
        }
      }
      curr = scanner.next();
      return tables;
    }
    const END_OF_TABLE_VALUE = "ENDTAB";
    function parseTable(group) {
      const tableDefinition = tableDefinitions[group.value];
      const table = {};
      let expectedCount = 0;
      curr = scanner.next();
      while (!groupIs(curr, 0, END_OF_TABLE_VALUE)) {
        switch (curr.code) {
          case 5:
            table.handle = curr.value;
            curr = scanner.next();
            break;
          case 330:
            table.ownerHandle = curr.value;
            curr = scanner.next();
            break;
          case 100:
            if (curr.value === "AcDbSymbolTable") {
              curr = scanner.next();
            } else {
              logUnhandledGroup(curr);
              curr = scanner.next();
            }
            break;
          case 70:
            expectedCount = curr.value;
            curr = scanner.next();
            break;
          case 0:
            if (curr.value === tableDefinition.dxfSymbolName) {
              table[tableDefinition.tableRecordsProperty] = tableDefinition.parseTableRecords();
            } else {
              logUnhandledGroup(curr);
              curr = scanner.next();
            }
            break;
          default:
            logUnhandledGroup(curr);
            curr = scanner.next();
        }
      }
      const tableRecords = table[tableDefinition.tableRecordsProperty];
      if (tableRecords) {
        let actualCount = (() => {
          if (tableRecords.constructor === Array) {
            return tableRecords.length;
          } else if (typeof tableRecords === "object") {
            return Object.keys(tableRecords).length;
          }
          return void 0;
        })();
        if (expectedCount !== actualCount)
          import_loglevel.default.warn("Parsed " + actualCount + " " + tableDefinition.dxfSymbolName + "'s but expected " + expectedCount);
      }
      curr = scanner.next();
      return table;
    }
    function parseViewPortRecords() {
      const viewPorts = [];
      let viewPort = {};
      import_loglevel.default.debug("ViewPort {");
      curr = scanner.next();
      while (!groupIs(curr, 0, END_OF_TABLE_VALUE)) {
        switch (curr.code) {
          case 2:
            viewPort.name = curr.value;
            curr = scanner.next();
            break;
          case 10:
            viewPort.lowerLeftCorner = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 11:
            viewPort.upperRightCorner = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 12:
            viewPort.center = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 13:
            viewPort.snapBasePoint = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 14:
            viewPort.snapSpacing = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 15:
            viewPort.gridSpacing = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 16:
            viewPort.viewDirectionFromTarget = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 17:
            viewPort.viewTarget = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 42:
            viewPort.lensLength = curr.value;
            curr = scanner.next();
            break;
          case 43:
            viewPort.frontClippingPlane = curr.value;
            curr = scanner.next();
            break;
          case 44:
            viewPort.backClippingPlane = curr.value;
            curr = scanner.next();
            break;
          case 45:
            viewPort.viewHeight = curr.value;
            curr = scanner.next();
            break;
          case 50:
            viewPort.snapRotationAngle = curr.value;
            curr = scanner.next();
            break;
          case 51:
            viewPort.viewTwistAngle = curr.value;
            curr = scanner.next();
            break;
          case 79:
            viewPort.orthographicType = curr.value;
            curr = scanner.next();
            break;
          case 110:
            viewPort.ucsOrigin = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 111:
            viewPort.ucsXAxis = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 112:
            viewPort.ucsYAxis = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 110:
            viewPort.ucsOrigin = parsePoint2(curr);
            curr = scanner.next();
            break;
          case 281:
            viewPort.renderMode = curr.value;
            curr = scanner.next();
            break;
          case 281:
            viewPort.defaultLightingType = curr.value;
            curr = scanner.next();
            break;
          case 292:
            viewPort.defaultLightingOn = curr.value;
            curr = scanner.next();
            break;
          case 330:
            viewPort.ownerHandle = curr.value;
            curr = scanner.next();
            break;
          case 63:
          case 421:
          case 431:
            viewPort.ambientColor = curr.value;
            curr = scanner.next();
            break;
          case 0:
            if (curr.value === "VPORT") {
              import_loglevel.default.debug("}");
              viewPorts.push(viewPort);
              import_loglevel.default.debug("ViewPort {");
              viewPort = {};
              curr = scanner.next();
            }
            break;
          default:
            logUnhandledGroup(curr);
            curr = scanner.next();
            break;
        }
      }
      import_loglevel.default.debug("}");
      viewPorts.push(viewPort);
      return viewPorts;
    }
    function parseLineTypes() {
      const ltypes = {};
      let ltype = {};
      let length = 0;
      let ltypeName;
      import_loglevel.default.debug("LType {");
      curr = scanner.next();
      while (!groupIs(curr, 0, "ENDTAB")) {
        switch (curr.code) {
          case 2:
            ltype.name = curr.value;
            ltypeName = curr.value;
            curr = scanner.next();
            break;
          case 3:
            ltype.description = curr.value;
            curr = scanner.next();
            break;
          case 73:
            length = curr.value;
            if (length > 0)
              ltype.pattern = [];
            curr = scanner.next();
            break;
          case 40:
            ltype.patternLength = curr.value;
            curr = scanner.next();
            break;
          case 49:
            ltype.pattern.push(curr.value);
            curr = scanner.next();
            break;
          case 0:
            import_loglevel.default.debug("}");
            if (length > 0 && length !== ltype.pattern.length)
              import_loglevel.default.warn("lengths do not match on LTYPE pattern");
            ltypes[ltypeName] = ltype;
            ltype = {};
            import_loglevel.default.debug("LType {");
            curr = scanner.next();
            break;
          default:
            curr = scanner.next();
        }
      }
      import_loglevel.default.debug("}");
      ltypes[ltypeName] = ltype;
      return ltypes;
    }
    function parseLayers() {
      const layers = {};
      let layer = {};
      let layerName;
      import_loglevel.default.debug("Layer {");
      curr = scanner.next();
      while (!groupIs(curr, 0, "ENDTAB")) {
        switch (curr.code) {
          case 2:
            layer.name = curr.value;
            layerName = curr.value;
            curr = scanner.next();
            break;
          case 62:
            layer.visible = curr.value >= 0;
            layer.colorIndex = Math.abs(curr.value);
            layer.color = getAcadColor2(layer.colorIndex);
            curr = scanner.next();
            break;
          case 70:
            layer.frozen = (curr.value & 1) != 0 || (curr.value & 2) != 0;
            curr = scanner.next();
            break;
          case 0:
            if (curr.value === "LAYER") {
              import_loglevel.default.debug("}");
              layers[layerName] = layer;
              import_loglevel.default.debug("Layer {");
              layer = {};
              layerName = void 0;
              curr = scanner.next();
            }
            break;
          default:
            logUnhandledGroup(curr);
            curr = scanner.next();
            break;
        }
      }
      import_loglevel.default.debug("}");
      layers[layerName] = layer;
      return layers;
    }
    const tableDefinitions = {
      VPORT: {
        tableRecordsProperty: "viewPorts",
        tableName: "viewPort",
        dxfSymbolName: "VPORT",
        parseTableRecords: parseViewPortRecords
      },
      LTYPE: {
        tableRecordsProperty: "lineTypes",
        tableName: "lineType",
        dxfSymbolName: "LTYPE",
        parseTableRecords: parseLineTypes
      },
      LAYER: {
        tableRecordsProperty: "layers",
        tableName: "layer",
        dxfSymbolName: "LAYER",
        parseTableRecords: parseLayers
      }
    };
    function parseEntities(forBlock) {
      const entities = [];
      const endingOnValue = forBlock ? "ENDBLK" : "ENDSEC";
      if (!forBlock) {
        curr = scanner.next();
      }
      while (true) {
        if (curr.code === 0) {
          if (curr.value === endingOnValue) {
            break;
          }
          const handler = self._entityHandlers[curr.value];
          if (handler != null) {
            import_loglevel.default.debug(curr.value + " {");
            const entity = handler.parseEntity(scanner, curr);
            curr = scanner.lastReadGroup;
            import_loglevel.default.debug("}");
            ensureHandle(entity);
            entities.push(entity);
          } else {
            import_loglevel.default.warn("Unhandled entity " + curr.value);
            curr = scanner.next();
            continue;
          }
        } else {
          curr = scanner.next();
        }
      }
      if (endingOnValue == "ENDSEC")
        curr = scanner.next();
      return entities;
    }
    function parsePoint2(curr2) {
      const point = {};
      let code = curr2.code;
      point.x = curr2.value;
      code += 10;
      curr2 = scanner.next();
      if (curr2.code != code)
        throw new Error("Expected code for point value to be " + code + " but got " + curr2.code + ".");
      point.y = curr2.value;
      code += 10;
      curr2 = scanner.next();
      if (curr2.code != code) {
        scanner.rewind();
        return point;
      }
      point.z = curr2.value;
      return point;
    }
    function ensureHandle(entity) {
      if (!entity)
        throw new TypeError("entity cannot be undefined or null");
      if (!entity.handle)
        entity.handle = lastHandle++;
    }
    parseAll();
    return dxf;
  }
};
function groupIs(group, code, value) {
  return group.code === code && group.value === value;
}
function logUnhandledGroup(curr) {
  import_loglevel.default.debug("unhandled group " + debugCode(curr));
}
function debugCode(curr) {
  return curr.code + ":" + curr.value;
}
function getAcadColor2(index) {
  return AutoCadColorIndex_default[index];
}

// node_modules/dxf-parser/dist/index.js
var dist_default = DxfParser;
export {
  DxfParser,
  dist_default as default
};
//# sourceMappingURL=dxf-parser.js.map
