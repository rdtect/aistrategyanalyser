var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { mockSnippet } from '../../internal/test-utils.js';
import { Progress } from '../../index.js';
describe('Progress', function () {
    var testIds = {
        root: 'progress',
        label: 'progress-label',
        track: 'progress-track',
        meter: 'progress-meter'
    };
    var commonProps = {
        value: 50,
        max: 100
    };
    it('Renders the component', function () {
        render(Progress, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Progress, __assign(__assign({}, commonProps), (_a = {}, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'height', 'width', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    var _loop_2 = function (prop) {
        it("Correctly applies the label `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Progress, __assign(__assign({}, commonProps), (_a = { children: mockSnippet('children') }, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.label);
            expect(component).toHaveClass(value);
        });
    };
    for (var _b = 0, _c = ['labelBase', 'labelText', 'labelClasses']; _b < _c.length; _b++) {
        var prop = _c[_b];
        _loop_2(prop);
    }
    var _loop_3 = function (prop) {
        it("Correctly applies the track `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Progress, __assign(__assign({}, commonProps), (_a = { children: mockSnippet('children') }, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.track);
            expect(component).toHaveClass(value);
        });
    };
    for (var _d = 0, _e = ['trackBase', 'trackBg', 'trackRounded', 'trackClasses']; _d < _e.length; _d++) {
        var prop = _e[_d];
        _loop_3(prop);
    }
    var _loop_4 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Progress, __assign(__assign({}, commonProps), (_a = { children: mockSnippet('children') }, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.meter);
            expect(component).toHaveClass(value);
        });
    };
    for (var _f = 0, _g = ['meterBase', 'meterBg', 'meterRounded', 'meterTransition', 'meterClasses']; _f < _g.length; _f++) {
        var prop = _g[_f];
        _loop_4(prop);
    }
    it('Applies the `meterAnimate` prop in indeterminate mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        var meterAnimate, component;
        return __generator(this, function (_a) {
            meterAnimate = 'meterAnimate';
            render(Progress, { value: null, meterAnimate: meterAnimate });
            component = screen.getByTestId(testIds.meter);
            expect(component).toHaveClass(meterAnimate);
            return [2 /*return*/];
        });
    }); });
});
