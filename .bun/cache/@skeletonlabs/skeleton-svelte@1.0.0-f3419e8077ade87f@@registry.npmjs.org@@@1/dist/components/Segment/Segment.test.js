import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Segment } from '../../index.js';
import SegmentTest from './Segment.test.svelte';
describe('Segment', function () {
    var testId = 'segment';
    it('Renders the component', function () {
        render(Segment, {});
        var component = screen.getByTestId(testId);
        expect(component).toBeInTheDocument();
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Segment, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testId);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'background', 'border', 'gap', 'padding', 'rounded', 'width', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    it('should render in the disabled state', function () {
        render(Segment, { disabled: true });
        var component = screen.getByTestId(testId);
        expect(component.dataset.disabled).toBeDefined();
    });
    it('should render in the read-only state', function () {
        render(Segment, { readOnly: true });
        var component = screen.getByTestId(testId);
        expect(component).toHaveClass('pointer-events-none');
    });
});
describe('SegmentItem', function () {
    var testIds = {
        root: 'segment-item',
        itemInput: 'segment-item-input'
    };
    it('Renders the item', function () {
        render(SegmentTest, {});
        var component = screen.getAllByTestId(testIds.root)[0];
        expect(component).toBeInTheDocument();
    });
    it('should render custom child content', function () {
        render(SegmentTest, {});
        var component = screen.getAllByTestId(testIds.root)[0];
        expect(component).toHaveTextContent('left');
    });
    it('should render in the checked state', function () {
        render(SegmentTest, {});
        var component = screen.getAllByTestId(testIds.root)[0];
        var attrDataState = component.getAttribute('data-state');
        expect(attrDataState).toBe('checked');
    });
    it('should render in the unchecked state', function () {
        render(SegmentTest, {});
        var component = screen.getAllByTestId(testIds.root)[1];
        var attrDataState = component.getAttribute('data-state');
        expect(attrDataState).toBe('unchecked');
    });
    it('should render in the disabled state', function () {
        render(SegmentTest, {});
        var component = screen.getAllByTestId('segment-item-input')[3];
        expect(component).toHaveAttribute('disabled');
    });
    var _loop_2 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(SegmentTest, { childProps: (_a = {}, _a[prop] = value, _a) });
            var component = screen.getAllByTestId(testIds.root)[0];
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_2(prop);
    }
});
