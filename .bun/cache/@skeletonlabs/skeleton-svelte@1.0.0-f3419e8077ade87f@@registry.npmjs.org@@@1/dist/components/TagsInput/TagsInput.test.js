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
import { mockSnippet } from '../../internal/test-utils.js';
import { TagsInput } from '../../index.js';
describe('TagsInput', function () {
    var testIds = {
        root: 'tags',
        inputAdd: 'tags-input-add',
        delete: 'tag-delete'
    };
    var commonProps = {
        value: ['Vanilla', 'Chocolate', 'Strawberry']
    };
    it('Renders the component', function () {
        render(TagsInput, __assign({}, commonProps));
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('should render the `buttonDelete` snippet', function () {
        var testValue = 'testIcon';
        render(TagsInput, __assign(__assign({}, commonProps), { buttonDelete: mockSnippet(testValue) }));
        var component = screen.getAllByTestId(testIds.delete)[0];
        expect(component).toHaveTextContent(testValue);
    });
    it('should render the component in the disabled state', function () {
        render(TagsInput, __assign(__assign({}, commonProps), { disabled: true }));
        var component = screen.getByTestId(testIds.inputAdd);
        expect(component).toHaveAttribute('disabled');
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(TagsInput, __assign(__assign({}, commonProps), (_a = {}, _a[prop] = value, _a)));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'gap', 'padding', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
});
