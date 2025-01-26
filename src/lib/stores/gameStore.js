import { writable } from 'svelte/store';
import { loadGame, saveGame } from '../storage';
import { MONSTERS } from '../config/monsters';
import { toastStore } from './toastStore';
import { logStore } from './logStore';

// 초기 상태
const initialState = {
  resources: {
    gold: 100,  // 시작 골드 증가
    wood: 0,
    stone: 0
  },
  buildings: {
    lodging: 1  // 초기 숙소 1개 (기본 용병 수용 가능)
  },
  upgrades: {
    clickPower: 1,
    autoGold: 0,
    autoWood: 0,
    autoStone: 0,
    woodBonus: 0,
    stoneBonus: 0,
    goldMultiplier: 0
  },
  character: {
    level: 1,
    exp: 0,
    maxExp: 50,  // 초기 필요 경험치 감소
    attackPower: 5  // 초기 공격력 조정
  },
  currentBattle: {
    selectedGround: null,
    selectedMonster: null,
    monsterHp: 0
  },
  mercenaries: [],
  mercenaryAssignments: {}  // { monsterId: [mercenaryId1, mercenaryId2, ...] }
};

// 스토어 생성
function createGameStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    addResource: (resourceType, amount) => update(state => {
      const bonus = getResourceBonus(state.upgrades, resourceType);
      const finalAmount = amount * bonus;
      
      state.resources[resourceType] += finalAmount;
      state.resources[resourceType] = Math.floor(state.resources[resourceType] * 100) / 100;
      
      return state;
    }),
    
    purchaseUpgrade: (upgradeType, cost) => update(state => {
      if (cost.gold && state.resources.gold < cost.gold) return state;
      if (cost.wood && state.resources.wood < cost.wood) return state;
      if (cost.stone && state.resources.stone < cost.stone) return state;

      // 비용 지불
      if (cost.gold) state.resources.gold -= cost.gold;
      if (cost.wood) state.resources.wood -= cost.wood;
      if (cost.stone) state.resources.stone -= cost.stone;

      // 업그레이드 레벨 증가
      state.upgrades[upgradeType] += 1;

      return state;
    }),

    loadSavedGame: () => {
      const savedGame = loadGame();
      if (savedGame) {
        set({
          ...initialState,  // 기본값으로 시작
          ...savedGame      // 저장된 데이터로 덮어쓰기
        });
      }
    },

    saveGame: () => {
      let currentState;
      subscribe(state => {
        currentState = { ...state };  // 상태 복사
      })();
      
      if (currentState) {
        saveGame(currentState);
      }
    },

    loadSaveData: (saveData) => {
      set({
        ...initialState,  // 먼저 초기 상태를 spread
        ...saveData,      // 그 위에 저장된 데이터를 덮어씌움
        mercenaries: saveData.mercenaries || [],
        mercenaryAssignments: saveData.mercenaryAssignments || {}
      });
    },

    selectHuntingGround: (groundId) => update(state => {
      state.currentBattle.selectedGround = groundId;
      state.currentBattle.selectedMonster = null;
      state.currentBattle.monsterHp = 0;
      return state;
    }),

    selectMonster: (monsterId) => update(state => {
      if (!monsterId) {
        state.currentBattle.selectedMonster = null;
        state.currentBattle.monsterHp = 0;
        return state;
      }
      
      const monster = MONSTERS[monsterId];
      state.currentBattle.selectedMonster = monsterId;
      state.currentBattle.monsterHp = monster.hp;
      return state;
    }),

    attackMonster: () => update(state => {
      if (!state.currentBattle.selectedMonster) return state;
      
      const monster = MONSTERS[state.currentBattle.selectedMonster];
      state.currentBattle.monsterHp -= state.character.attackPower;

      if (state.currentBattle.monsterHp <= 0) {
        // 몬스터 처치 보상
        Object.entries(monster.rewards).forEach(([resource, amount]) => {
          state.resources[resource] += amount;
        });

        // 보상 로그 추가
        const rewardText = Object.entries(monster.rewards)
          .map(([resource, amount]) => `${amount} ${resource}`)
          .join(', ');
        logStore.addLog(`${monster.name} 처치! 보상: ${rewardText}, ${monster.exp} exp`);

        // 경험치 획득 및 레벨업 처리
        state.character.exp += monster.exp;
        if (state.character.exp >= state.character.maxExp) {
          const prevLevel = state.character.level;
          state.character.level += 1;
          state.character.exp -= state.character.maxExp;
          state.character.maxExp = Math.floor(state.character.maxExp * 1.5);
          
          // 레벨업 시 공격력 증가량 조정
          const powerIncrease = Math.floor(3 * Math.pow(1.1, prevLevel));
          state.character.attackPower += powerIncrease;
          
          toastStore.show(
            `레벨 업! ${prevLevel} → ${state.character.level}\n공격력 +${powerIncrease}`,
            'success',
            5000
          );
        }

        // 몬스터 리셋
        state.currentBattle.monsterHp = monster.hp;
      }

      return state;
    }),

    hireMercenary: (mercenary) => update(state => {
      const capacity = getLodgingCapacity(state.buildings.lodging);
      
      if (state.mercenaries.length >= capacity) {
        toastStore.show('더 이상 용병을 수용할 수 없습니다. 숙소를 업그레이드하세요!', 'error');
        return state;
      }

      if (state.resources.gold < mercenary.hireCost) {
        toastStore.show('골드가 부족합니다!', 'error');
        return state;
      }

      // 고유 ID 생성 (timestamp + random string)
      const uniqueId = `${mercenary.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      state.resources.gold -= mercenary.hireCost;
      state.mercenaries.push({ 
        ...mercenary, 
        uniqueId,  // 고유 ID 추가
        hired: true 
      });
      
      toastStore.show(`${mercenary.name}을(를) 고용했습니다!`, 'success');
      return state;
    }),

    dismissMercenary: (mercenaryId) => update(state => {
      // uniqueId로 용병 해고
      state.mercenaries = state.mercenaries.filter(m => m.uniqueId !== mercenaryId);
      return state;
    }),

    processMercenaryBattle: (mercenary, monster) => update(state => {
      // 전투력 체크 - 몬스터 HP의 10%보다 전투력이 낮으면 실패
      const requiredPower = Math.ceil(monster.hp * 0.1);
      if (mercenary.power < requiredPower) {
        logStore.addLog(`${mercenary.name}이(가) ${monster.name} 사냥에 실패했습니다! (필요 전투력: ${requiredPower})`);
        // 전투 비용은 지불
        state.resources.gold -= mercenary.battleCost;
        return state;
      }

      // 먼저 보상 획득
      Object.entries(monster.rewards).forEach(([resource, amount]) => {
        state.resources[resource] += amount;
      });
      
      // 경험치 획득
      state.character.exp += monster.exp;
      
      // 레벨업 체크
      if (state.character.exp >= state.character.maxExp) {
        state.character.level += 1;
        state.character.exp -= state.character.maxExp;
        state.character.maxExp = Math.floor(state.character.maxExp * 1.5);
      }

      // 마지막으로 전투 비용 지불
      state.resources.gold -= mercenary.battleCost;
      
      return state;
    }),

    assignMercenary: (monsterId, mercenaryId) => update(state => {
      if (!state.mercenaryAssignments[monsterId]) {
        state.mercenaryAssignments[monsterId] = [];
      }
      state.mercenaryAssignments[monsterId].push(mercenaryId);
      return state;
    }),

    unassignMercenary: (monsterId, mercenaryId) => update(state => {
      if (state.mercenaryAssignments[monsterId]) {
        state.mercenaryAssignments[monsterId] = state.mercenaryAssignments[monsterId]
          .filter(id => id !== mercenaryId);
        if (state.mercenaryAssignments[monsterId].length === 0) {
          delete state.mercenaryAssignments[monsterId];
        }
      }
      return state;
    }),

    upgradeLodging: () => update(state => {
      const cost = getLodgingUpgradeCost(state.buildings.lodging);
      
      if (state.resources.gold < cost.gold || 
          state.resources.wood < cost.wood || 
          state.resources.stone < cost.stone) {
        toastStore.show('자원이 부족합니다!', 'error');
        return state;
      }

      state.resources.gold -= cost.gold;
      state.resources.wood -= cost.wood;
      state.resources.stone -= cost.stone;
      state.buildings.lodging += 1;

      toastStore.show(`숙소가 레벨 ${state.buildings.lodging}로 업그레이드되었습니다!`, 'success');
      return state;
    }),

    resetGame: () => {
      set(initialState);
    }
  };
}

// 보너스 계산 함수
function getResourceBonus(upgrades, resourceType) {
  switch (resourceType) {
    case 'wood':
      return 1 + upgrades.woodBonus * 0.2;
    case 'stone':
      return 1 + upgrades.stoneBonus * 0.2;
    case 'gold':
      return 1 + upgrades.goldMultiplier * 0.3;
    default:
      return 1;
  }
}

// 숙소 업그레이드 비용 계산 함수
export function getLodgingUpgradeCost(currentLevel) {
  return {
    gold: Math.floor(100 * Math.pow(1.5, currentLevel)),
    wood: Math.floor(50 * Math.pow(1.5, currentLevel)),
    stone: Math.floor(30 * Math.pow(1.5, currentLevel))
  };
}

// 숙소 수용 가능 용병 수 계산
export function getLodgingCapacity(level) {
  return level * 3;  // 각 숙소당 3명의 용병 수용 가능
}

export const gameStore = createGameStore(); 