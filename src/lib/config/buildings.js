export const BUILDINGS = {
    lodging: {
        name: '숙소',
        description: '용병들을 수용할 수 있는 공간입니다.',
        baseCapacity: 3,
        upgradeCosts: (level) => ({
            gold: Math.floor(100 * Math.pow(1.5, level)),
            wood: Math.floor(50 * Math.pow(1.5, level)),
            stone: Math.floor(30 * Math.pow(1.5, level))
        })
    }
    // ... 다른 건물들
}; 