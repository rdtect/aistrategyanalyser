import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Popover } from '../../index.js';
describe('Popover', function () {
    var testIds = {
        root: 'popover'
    };
    // NOTE: bare minimum test as this feature is considered temporary
    it('Renders the component', function () {
        render(Popover, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
});
