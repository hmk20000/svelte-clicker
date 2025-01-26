import { writable } from 'svelte/store';

function createModalStore() {
    const { subscribe, set } = writable({
        isOpen: false,
        monsterId: null
    });

    return {
        subscribe,
        openAssignmentModal: (monsterId) => set({ isOpen: true, monsterId }),
        close: () => set({ isOpen: false, monsterId: null })
    };
}

export const mercenaryAssignmentModal = createModalStore(); 