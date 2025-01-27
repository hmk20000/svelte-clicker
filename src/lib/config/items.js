export const SHOP_ITEMS = {
    // 무기류
    weapons: {
        sword1: {
            id: 'sword1',
            name: '기본 검',
            description: '기본적인 검입니다.',
            cost: 100,
            type: 'weapon',
            power: 5
        },
        // ... 다른 무기들
    },
    
    // 방어구류
    armors: {
        armor1: {
            id: 'armor1',
            name: '가죽 갑옷',
            description: '기본적인 방어구입니다.',
            cost: 150,
            type: 'armor',
            defense: 3
        },
        // ... 다른 방어구들
    },
    
    // 소비 아이템
    consumables: {
        potion1: {
            id: 'potion1',
            name: '체력 물약',
            description: 'HP를 회복합니다.',
            cost: 50,
            type: 'consumable',
            heal: 20
        },
        // ... 다른 소비 아이템들
    }
}; 