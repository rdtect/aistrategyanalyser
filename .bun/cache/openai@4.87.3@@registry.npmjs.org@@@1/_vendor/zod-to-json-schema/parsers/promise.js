"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePromiseDef = void 0;
const parseDef_1 = require("../parseDef.js");
function parsePromiseDef(def, refs) {
    return (0, parseDef_1.parseDef)(def.type._def, refs);
}
exports.parsePromiseDef = parsePromiseDef;
//# sourceMappingURL=promise.js.map