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
import { Pagination } from '../../index.js';
// Test Data
var sourceData = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }
];
var commonProps = {
    data: sourceData,
    page: 1,
    pageSize: 3
};
describe('Pagination', function () {
    var testIds = {
        root: 'pagination',
        buttonNumeral: 'pagination-button-numeral',
        altInterface: 'pagination-alt-ui'
    };
    it('Renders the component', function () {
        render(Pagination, __assign({}, commonProps));
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('should render the component in default numeral UI mode', function () {
        render(Pagination, __assign({}, commonProps));
        var component = screen.getAllByTestId(testIds.buttonNumeral);
        expect(component).toHaveLength(3);
    });
    it('should render the component in the alternative UI mode', function () {
        render(Pagination, __assign(__assign({}, commonProps), { alternative: true }));
        var component = screen.getByTestId(testIds.altInterface);
        expect(component).toBeInTheDocument();
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Pagination, __assign(__assign({}, commonProps), (_a = {}, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'background', 'border', 'gap', 'padding', 'rounded', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    it('should render first and last buttons if required', function () {
        render(Pagination, __assign(__assign({}, commonProps), { showFirstLastButtons: true }));
        var firstButton = screen.getByTestId('pagination-button-first');
        var lastButton = screen.getByTestId('pagination-button-last');
        expect(firstButton).toBeInTheDocument();
        expect(lastButton).toBeInTheDocument();
    });
});
