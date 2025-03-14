import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { mockSnippet } from '../../internal/test-utils.js';
import { Avatar } from '../../index.js';
describe('Avatar', function () {
    var testIds = {
        root: 'avatar',
        image: 'avatar-image',
        fallback: 'avatar-fallback'
    };
    var test = {
        src: 'https://picsum.photos/100',
        name: 'John Doe',
        initials: 'JD'
    };
    it('Renders the component', function () {
        render(Avatar, { src: test.src, name: test.name });
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(Avatar, (_a = { name: test.name }, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'background', 'size', 'font', 'border', 'rounded', 'shadow', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
    describe('Image', function () {
        it('Renders the image element', function () {
            render(Avatar, { src: test.src, name: test.name });
            var component = screen.getByTestId(testIds.image);
            expect(component).toBeInTheDocument();
        });
        var _loop_2 = function (prop) {
            it("Correctly applies the `".concat(prop, "` prop"), function () {
                var _a;
                var value = 'foo';
                render(Avatar, (_a = { src: test.src, name: test.name }, _a[prop] = value, _a));
                var component = screen.getByTestId(testIds.image);
                expect(component).toHaveClass(value);
            });
        };
        for (var _i = 0, _a = ['imageBase', 'imageClasses']; _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_2(prop);
        }
        it('Correctly applies the `style` prop', function () {
            var value = 'background-color: rgb(0, 128, 0); opacity: 0.5;';
            render(Avatar, { src: test.src, name: test.name, style: value });
            var component = screen.getByTestId(testIds.image);
            expect(component).toHaveStyle(value);
        });
    });
    describe('Fallback', function () {
        it('Renders fallback initials', function () {
            render(Avatar, { name: test.name });
            var component = screen.getByTestId(testIds.fallback);
            expect(component).toHaveTextContent(test.initials);
        });
        it('Renders children snippet', function () {
            var testValue = 'childrenSnippet';
            render(Avatar, { name: test.name, children: mockSnippet(testValue) });
            var component = screen.getByTestId(testIds.fallback);
            expect(component).toHaveTextContent(testValue);
        });
    });
});
