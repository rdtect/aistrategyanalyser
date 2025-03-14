import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Modal } from '../../index.js';
describe('Modal', function () {
    var testIds = {
        root: 'modal'
    };
    // NOTE: bare minimum test as this feature is considered temporary
    it('Renders the component', function () {
        render(Modal, {});
        var component = screen.getByTestId(testIds.root);
        expect(component).toBeInTheDocument();
    });
});
