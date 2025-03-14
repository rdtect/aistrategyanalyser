import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { mockSnippet } from '../../internal/test-utils.js';
import { Rating } from '../../index.js';
describe('Rating', function () {
    var testIds = {
        root: 'rating',
        control: 'rating-control',
        item: 'rating-item',
        input: 'rating-input'
    };
    it('Renders the component', function () {
        render(Rating, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('Should render with a value', function () {
        var testValue = 3;
        render(Rating, { value: testValue });
        var component = screen.getByTestId(testIds.input);
        expect(component).toHaveValue(String(testValue));
    });
    it('Should render all snippets', function () {
        render(Rating, {
            value: 1,
            iconEmpty: mockSnippet('iconEmptySnippet'),
            iconHalf: mockSnippet('iconHalfSnippet'),
            iconFull: mockSnippet('iconFullSnippet')
        });
        var component = screen.getAllByTestId(testIds.item);
        expect(component[0].children[0]).toHaveTextContent('iconFullSnippet');
        expect(component[1].children[0]).toHaveTextContent('iconEmptySnippet');
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Rating, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
});
