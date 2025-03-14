import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Accordion } from '../../index.js';
import AccordionTest from './Accordion.test.svelte';
describe('Accordion', function () {
    var testId = 'accordion';
    it('Renders the component', function () {
        render(Accordion, {});
        var component = screen.getByTestId(testId);
        expect(component).toBeInTheDocument();
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Accordion, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testId);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'padding', 'spaceY', 'rounded', 'width', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
});
describe('Accordion.Item', function () {
    var testId = 'accordion-item';
    it('Renders the item', function () {
        render(AccordionTest, {});
        var component = screen.getAllByTestId(testId)[0];
        expect(component).toBeInTheDocument();
    });
    it('Renders all snippets', function () {
        render(AccordionTest, {});
        var component = screen.getAllByTestId(testId)[0];
        expect(component).toHaveTextContent('FooLead');
        expect(component).toHaveTextContent('FooControl');
        expect(component).toHaveTextContent('FooPanel');
    });
    var _loop_2 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(AccordionTest, { childProps: (_a = {}, _a[prop] = value, _a) });
            var component = screen.getAllByTestId(testId)[0];
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'spaceY', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_2(prop);
    }
    it('Renders in open state', function () {
        render(AccordionTest, {});
        var component = screen.getAllByTestId(testId)[0]; // first item
        expect(component.dataset.state).toEqual('open');
    });
    it('Renders in closed state', function () {
        render(AccordionTest, {});
        var component = screen.getAllByTestId(testId)[1]; // second item
        expect(component.dataset.state).toEqual('closed');
    });
});
