import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Combobox } from '../../index.js';
describe('Combobox', function () {
    var testIds = {
        root: 'combobox'
    };
    // NOTE: bare minimum test as this feature is considered temporary
    it('Renders the component', function () {
        render(Combobox, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
});
