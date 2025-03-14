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
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Slider } from '../../index.js';
describe('Slider', function () {
    var testIds = {
        root: 'slider',
        markers: 'slider-markers',
        mark: 'slider-mark',
        thumb: 'slider-thumb'
    };
    var commonProps = {
        value: [40]
    };
    it('Renders the component', function () {
        render(Slider, __assign({}, commonProps));
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('should render the component with multiple values', function () {
        render(Slider, { value: [40, 60] });
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('should render the component with markers', function () {
        render(Slider, __assign(__assign({}, commonProps), { markers: [25, 50, 75] }));
        var elemMakers = screen.getByTestId(testIds.markers);
        expect(elemMakers).toBeInTheDocument();
        var elemMarks = screen.getAllByTestId(testIds.mark);
        expect(elemMarks).toHaveLength(3);
    });
    it('should render the component in the disabled state', function () {
        render(Slider, __assign(__assign({}, commonProps), { disabled: true }));
        var component = screen.getByTestId(testIds.root);
        expect(component).toHaveClass('disabled');
    });
    it('should render the component in the read-only state', function () {
        render(Slider, __assign(__assign({}, commonProps), { readOnly: true }));
        var component = screen.getByTestId(testIds.thumb);
        expect(component).toHaveClass('cursor-not-allowed');
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Slider, __assign(__assign({}, commonProps), (_a = {}, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'spaceY', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
});
