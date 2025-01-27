import { MERCENARIES } from './config/mercenaries';

const GAME_SAVE_KEY = 'idle_game_save';

export function saveGame(gameState) {
    try {
        const saveData = JSON.stringify(gameState);
        localStorage.setItem(GAME_SAVE_KEY, saveData);
    } catch (error) {
        console.error('Failed to save game:', error);
    }
}

export function loadGame() {
    try {
        const saveData = localStorage.getItem(GAME_SAVE_KEY);
        if (!saveData) return null;
        
        const gameState = JSON.parse(saveData);
        
        // 용병 데이터 구조 마이그레이션
        const mercenaries = gameState.mercenaries?.map(merc => {
            const mercConfig = MERCENARIES.find(m => m.id === merc.id.split('_')[0]);
            if (!mercConfig) return merc;

            return {
                ...merc,
                basePower: mercConfig.basePower,
                powerPerLevel: mercConfig.powerPerLevel,
                maxLevel: mercConfig.maxLevel,
                level: merc.level || 1,
                exp: merc.exp || 0,
                // 전투력 재계산
                power: mercConfig.basePower + (mercConfig.powerPerLevel * (merc.level || 1))
            };
        }) || [];

        // 기본 게임 상태 반환
        return {
            resources: gameState.resources || { gold: 0, wood: 0, stone: 0 },
            buildings: gameState.buildings || { lodging: 1 },
            upgrades: gameState.upgrades || {
                clickPower: 1,
                autoGold: 0,
                autoWood: 0,
                autoStone: 0,
                woodBonus: 0,
                stoneBonus: 0,
                goldMultiplier: 0
            },
            character: {
                ...gameState.character,
                level: gameState.character?.level || 1,
                exp: gameState.character?.exp || 0,
                maxExp: gameState.character?.maxExp || 50,
                attackPower: gameState.character?.attackPower || 5
            },
            currentBattle: gameState.currentBattle || {
                selectedGround: null,
                selectedMonster: null,
                monsterHp: 0
            },
            mercenaries: mercenaries,
            mercenaryAssignments: gameState.mercenaryAssignments || {}
        };
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
}

export function clearSave() {
    try {
        localStorage.removeItem(GAME_SAVE_KEY);
    } catch (error) {
        console.error('Failed to clear save:', error);
    }
} 