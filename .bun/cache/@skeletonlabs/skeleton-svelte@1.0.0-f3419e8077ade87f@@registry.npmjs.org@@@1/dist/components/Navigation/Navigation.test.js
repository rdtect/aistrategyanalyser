import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Navigation } from '../../index.js';
import { mockSnippet } from '../../internal/test-utils.js';
import NavRailTest from './NavRail.test.svelte';
import NavBarTest from './NavBar.test.svelte';
describe('NavRail', function () {
    var testIds = {
        root: 'nav-rail',
        header: 'nav-rail-header',
        tiles: 'nav-rail-tiles',
        footer: 'nav-rail-footer'
    };
    it('Renders the component', function () {
        render(Navigation.Rail, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('Renders all snippets', function () {
        render(Navigation.Rail, {
            header: mockSnippet('headerSnippet'),
            tiles: mockSnippet('tilesSnippet'),
            footer: mockSnippet('footerSnippet')
        });
        var component = screen.getByTestId(testIds.root);
        expect(component).toHaveTextContent('headerSnippet');
        expect(component).toHaveTextContent('tilesSnippet');
        expect(component).toHaveTextContent('footerSnippet');
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Navigation.Rail, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'background', 'padding', 'height', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    it('Renders in collapsed mode', function () {
        var width = 'width';
        var widthExpanded = 'widthExpanded';
        render(Navigation.Rail, {
            width: width,
            widthExpanded: widthExpanded,
            expanded: false
        });
        var component = screen.getByTestId(testIds.root);
        expect(component).toHaveClass(width);
        expect(component).not.toHaveClass(widthExpanded);
    });
    it('Renders in expanded mode', function () {
        var width = 'width';
        var widthExpanded = 'widthExpanded';
        render(Navigation.Rail, {
            width: width,
            widthExpanded: widthExpanded,
            expanded: true
        });
        var component = screen.getByTestId(testIds.root);
        expect(component).not.toHaveClass(width);
        expect(component).toHaveClass(widthExpanded);
    });
    var _loop_2 = function (prop) {
        it("Correctly applies the header `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Navigation.Rail, (_a = {
                    header: mockSnippet('header')
                },
                _a[prop] = value,
                _a));
            var component = screen.getByTestId(testIds.header);
            expect(component).toHaveClass(value);
        });
    };
    for (var _b = 0, _c = ['headerBase', 'headerFlexDirection', 'headerJustify', 'headerItems', 'headerGap', 'headerClasses']; _b < _c.length; _b++) {
        var prop = _c[_b];
        _loop_2(prop);
    }
    var _loop_3 = function (prop) {
        it("Correctly applies the tiles `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Navigation.Rail, (_a = {
                    tiles: mockSnippet('tiles')
                },
                _a[prop] = value,
                _a));
            var component = screen.getByTestId(testIds.tiles);
            expect(component).toHaveClass(value);
        });
    };
    for (var _d = 0, _e = ['tilesBase', 'tilesFlexDirection', 'tilesJustify', 'tilesItems', 'tilesGap', 'tilesClasses']; _d < _e.length; _d++) {
        var prop = _e[_d];
        _loop_3(prop);
    }
    var _loop_4 = function (prop) {
        it("Correctly applies the tiles `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Navigation.Rail, (_a = {
                    footer: mockSnippet('footer')
                },
                _a[prop] = value,
                _a));
            var component = screen.getByTestId(testIds.footer);
            expect(component).toHaveClass(value);
        });
    };
    for (var _f = 0, _g = ['footerBase', 'footerFlexDirection', 'footerJustify', 'footerItems', 'footerGap', 'footerClasses']; _f < _g.length; _f++) {
        var prop = _g[_f];
        _loop_4(prop);
    }
    describe('NavTile', function () {
        var testIds = {
            root: 'nav-tile',
            labelExpanded: 'nav-tile-label-expanded'
        };
        it('Renders the component', function () {
            render(NavRailTest, {});
            var component = screen.getAllByTestId(testIds.root)[0];
            expect(component).toBeInTheDocument();
        });
        it('Renders child snippet', function () {
            render(NavRailTest, {});
            var component = screen.getAllByTestId(testIds.root)[0];
            expect(component).toHaveTextContent('HeaderTile');
        });
        var _loop_5 = function (prop) {
            it("Correctly applies the `".concat(prop, "` prop"), function () {
                var _a;
                var value = 'bg-green-500';
                render(NavRailTest, { childProps: (_a = {}, _a[prop] = value, _a) });
                var component = screen.getAllByTestId(testIds.root)[0];
                expect(component).toHaveClass(value);
            });
        };
        for (var _i = 0, _a = ['base', 'width', 'aspect', 'background', 'hover', 'gap', 'rounded']; _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_5(prop);
        }
        it('Renders the labelExpanded in expanded mode', function () {
            var testValue = 'LabelExpanded';
            render(NavRailTest, { rootProps: { expanded: true }, childProps: { labelExpanded: testValue } });
            var component = screen.getAllByTestId(testIds.labelExpanded)[0];
            expect(component).toHaveTextContent(testValue);
        });
    });
});
describe('NavBar', function () {
    var testIds = {
        root: 'nav-bar',
        tileset: 'nav-bar-tileset'
    };
    it('Renders the component', function () {
        render(Navigation.Bar, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('Renders all snippets', function () {
        render(Navigation.Bar, {
            children: mockSnippet('children')
        });
        var component = screen.getByTestId(testIds.root);
        expect(component).toHaveTextContent('children');
    });
    var _loop_6 = function (prop) {
        it("Correctly applies the root `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Navigation.Bar, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'background', 'width', 'height', 'padding', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_6(prop);
    }
    var _loop_7 = function (prop) {
        it("Correctly applies the tileset `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Navigation.Bar, (_a = { children: mockSnippet('children') }, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.tileset);
            expect(component).toHaveClass(value);
        });
    };
    for (var _b = 0, _c = ['tilesBase', 'tilesFlexDirection', 'tilesJustify', 'tilesItems', 'tilesGap', 'tilesClasses']; _b < _c.length; _b++) {
        var prop = _c[_b];
        _loop_7(prop);
    }
    describe('NavTile', function () {
        var testId = 'nav-tile';
        it('Renders the component', function () {
            render(NavBarTest, {});
            var component = screen.getAllByTestId(testId)[0];
            expect(component).toBeInTheDocument();
        });
        it('Renders child snippet', function () {
            render(NavBarTest, {});
            var component = screen.getAllByTestId(testId)[0];
            expect(component).toHaveTextContent('TileOne');
        });
        var _loop_8 = function (prop) {
            it("Correctly applies the `".concat(prop, "` prop"), function () {
                var _a;
                var value = 'bg-green-500';
                render(NavBarTest, { childProps: (_a = {}, _a[prop] = value, _a) });
                var component = screen.getAllByTestId(testId)[0];
                expect(component).toHaveClass(value);
            });
        };
        for (var _i = 0, _a = ['base', 'width', 'active', 'padding', 'gap', 'rounded', 'classes']; _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_8(prop);
        }
    });
});
