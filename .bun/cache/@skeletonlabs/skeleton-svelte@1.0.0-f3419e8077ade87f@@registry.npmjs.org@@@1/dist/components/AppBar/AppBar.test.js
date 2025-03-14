import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { mockSnippet } from '../../internal/test-utils.js';
import { AppBar } from '../../index.js';
describe('AppBar', function () {
    var testId = 'app-bar';
    var testIdToolbar = "".concat(testId, "-toolbar");
    var testIdHeadline = "".concat(testId, "-headline");
    it('Renders the component', function () {
        render(AppBar, {});
        var component = screen.getByTestId(testId);
        expect(component).toBeInTheDocument();
    });
    it('Renders all snippets', function () {
        render(AppBar, {
            children: mockSnippet('childrenSnippet'),
            lead: mockSnippet('leadSnippet'),
            trail: mockSnippet('trailSnippet'),
            headline: mockSnippet('headlineSnippet')
        });
        var component = screen.getByTestId(testId);
        expect(component).toHaveTextContent('childrenSnippet');
        expect(component).toHaveTextContent('leadSnippet');
        expect(component).toHaveTextContent('trailSnippet');
        expect(component).toHaveTextContent('headlineSnippet');
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(AppBar, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testId);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'background', 'spaceY', 'border', 'padding', 'shadow', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    var _loop_2 = function (prop) {
        it("Correctly applies toolbar `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(AppBar, (_a = {}, _a[prop] = value, _a.lead = mockSnippet('Skeleton'), _a));
            var component = screen.getByTestId(testIdToolbar);
            expect(component).toHaveClass(value);
        });
    };
    for (var _b = 0, _c = ['toolbarBase', 'toolbarGridCols', 'toolbarGap', 'toolbarClasses']; _b < _c.length; _b++) {
        var prop = _c[_b];
        _loop_2(prop);
    }
    var _loop_3 = function (prop) {
        it("Correctly applies headline `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(AppBar, (_a = {}, _a[prop] = value, _a.headline = mockSnippet('Skeleton'), _a));
            var component = screen.getByTestId(testIdHeadline);
            expect(component).toHaveClass(value);
        });
    };
    for (var _d = 0, _e = ['headlineBase', 'headlineClasses']; _d < _e.length; _d++) {
        var prop = _e[_d];
        _loop_3(prop);
    }
});
