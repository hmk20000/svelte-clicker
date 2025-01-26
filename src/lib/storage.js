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
        
        // 레벨에 따른 공격력 재계산
        let totalPower = 10; // 기본 공격력
        for (let level = 1; level < gameState.character.level; level++) {
            totalPower += Math.floor(5 * Math.pow(1.1, level));
        }

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
                attackPower: totalPower  // 계산된 공격력으로 덮어쓰기
            },
            currentBattle: gameState.currentBattle || {
                selectedGround: null,
                selectedMonster: null,
                monsterHp: 0
            },
            mercenaries: gameState.mercenaries || [],
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