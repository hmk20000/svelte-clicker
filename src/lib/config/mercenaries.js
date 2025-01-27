export const MERCENARIES = [
    {
        id: 'merc1',
        name: '견습 전사',
        description: '숲 사냥터에 적합한 전사입니다.',
        hireCost: 50,
        battleCost: 5,
        basePower: 15,
        powerPerLevel: 3,
        type: 'mercenary',
        requiredLevel: 1,
        maxLevel: 10,
        expForLevel: (level) => Math.floor(100 * Math.pow(1.2, level))
    },
    {
        id: 'merc2',
        name: '숙련된 전사',
        description: '동굴 사냥터에 적합한 전사입니다.',
        hireCost: 200,
        battleCost: 15,
        basePower: 40,
        powerPerLevel: 5,
        type: 'mercenary',
        requiredLevel: 5,
        maxLevel: 15,
        expForLevel: (level) => Math.floor(150 * Math.pow(1.2, level))
    },
    {
        id: 'merc3',
        name: '베테랑 기사',
        description: '산 사냥터에 적합한 기사입니다.',
        hireCost: 500,
        battleCost: 35,
        basePower: 80,
        powerPerLevel: 8,
        type: 'mercenary',
        requiredLevel: 10,
        maxLevel: 20,
        expForLevel: (level) => Math.floor(200 * Math.pow(1.2, level))
    },
    {
        id: 'merc4',
        name: '정예 마법사',
        description: '사막 사냥터에 적합한 마법사입니다.',
        hireCost: 1500,
        battleCost: 80,
        basePower: 120,
        powerPerLevel: 12,
        type: 'mercenary',
        requiredLevel: 15,
        maxLevel: 25,
        expForLevel: (level) => Math.floor(300 * Math.pow(1.2, level))
    },
    {
        id: 'merc5',
        name: '영웅급 기사',
        description: '화산 사냥터에 적합한 기사입니다.',
        hireCost: 5000,
        battleCost: 200,
        basePower: 250,
        powerPerLevel: 25,
        type: 'mercenary',
        requiredLevel: 20,
        maxLevel: 30,
        expForLevel: (level) => Math.floor(500 * Math.pow(1.2, level))
    }
]; 