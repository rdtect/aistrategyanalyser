import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { mockSnippet } from '../../internal/test-utils.js';
import { FileUpload } from '../../index.js';
describe('FileUpload', function () {
    var testIds = {
        root: 'uploader',
        input: 'uploader-input',
        filesList: 'uploader-files-list'
    };
    it('Renders the component', function () {
        render(FileUpload, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
    it('Renders children snippet', function () {
        render(FileUpload, {
            children: mockSnippet('childrenSnippet')
        });
        var component = screen.getByTestId(testIds.root);
        expect(component).toHaveTextContent('childrenSnippet');
    });
    it('Renders icon snippet', function () {
        render(FileUpload, {
            iconInterface: mockSnippet('iconInterfaceSnippet')
        });
        var component = screen.getByTestId(testIds.root);
        expect(component).toHaveTextContent('iconInterfaceSnippet');
    });
    it('should render the component in the disabled state', function () {
        render(FileUpload, { disabled: true });
        var component = screen.getByTestId(testIds.input);
        expect(component).toHaveAttribute('disabled');
    });
    var _loop_1 = function (prop) {
        it("Correctly applies the `".concat(prop, "` prop"), function () {
            var _a;
            var value = 'bg-green-500';
            render(FileUpload, (_a = {}, _a[prop] = value, _a));
            var component = screen.getByTestId(testIds.root);
            expect(component).toHaveClass(value);
        });
    };
    for (var _i = 0, _a = ['base', 'classes']; _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
    }
});
