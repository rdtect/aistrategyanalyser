import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { mockSnippet } from '../../internal/test-utils.js';
import { Tabs } from '../../index.js';
import TabsTest from './Tabs.test.svelte';
describe('Tabs', function () {
    var testIds = {
        root: 'tabs',
        list: 'tabs-list',
        content: 'tabs-content'
    };
    it('Renders the component', function () {
        render(Tabs, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Tabs, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    it('Should render all snippets', function () {
        render(Tabs, { list: mockSnippet('listSnippet'), content: mockSnippet('contentSnippet') });
        var componentList = screen.getByTestId(testIds.list);
        var componentContent = screen.getByTestId(testIds.content);
        expect(componentList).toHaveTextContent('listSnippet');
        expect(componentContent).toHaveTextContent('contentSnippet');
    });
});
describe('Tabs.Control', function () {
    var testIds = {
        root: 'tabs-control'
    };
    it('Renders the item', function () {
        render(TabsTest, {});
        var component = screen.getAllByTestId(testIds.root)[0];
        expect(component).toBeInTheDocument();
    });
    var _loop_2 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(TabsTest, { controlProps: (_a = {}, _a[prop] = value, _a) });
            var component = screen.getAllByTestId(testIds.root)[0];
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'padding', 'translateX', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_2(prop);
    }
});
describe('Tabs.Panel', function () {
    var testIds = {
        root: 'tabs-panel'
    };
    it('Renders the item', function () {
        render(TabsTest, {});
        var component = screen.getAllByTestId(testIds.root)[0];
        expect(component).toBeInTheDocument();
    });
    var _loop_3 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(TabsTest, { panelProps: (_a = {}, _a[prop] = value, _a) });
            var component = screen.getAllByTestId(testIds.root)[0];
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_3(prop);
    }
});
