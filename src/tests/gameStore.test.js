import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { gameStore } from '../lib/stores/gameStore';
import { MERCENARIES } from '../lib/config/mercenaries';
import { MONSTERS } from '../lib/config/monsters';

// localStorage 모킹
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: vi.fn(key => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        })
    };
})();

// global 객체에 localStorage 모킹 설정
global.localStorage = localStorageMock;

describe('Game Store Tests', () => {
    beforeEach(() => {
        // 각 테스트 전에 localStorage와 게임 상태 초기화
        localStorageMock.clear();
        gameStore.resetGame();
    });

    // 용병 고용 테스트
    describe('Mercenary Hiring', () => {
        it('should hire a mercenary when having enough gold', () => {
            const testMerc = MERCENARIES[0]; // 견습 전사
            
            // 충분한 골드 지급
            gameStore.update(state => ({
                ...state,
                resources: { ...state.resources, gold: 1000 }
            }));

            gameStore.hireMercenary(testMerc);
            const newState = get(gameStore);

            expect(newState.mercenaries.length).toBe(1);
            expect(newState.mercenaries[0].id).toBe(testMerc.id);
            expect(newState.mercenaries[0].level).toBe(1);
            expect(newState.mercenaries[0].exp).toBe(0);
            expect(newState.mercenaries[0].power).toBe(testMerc.basePower);
            expect(newState.resources.gold).toBe(1000 - testMerc.hireCost);
        });

        it('should not hire when gold is insufficient', () => {
            const testMerc = MERCENARIES[0];
            
            // 초기 상태 설정 (골드 부족)
            gameStore.update(state => ({
                ...state,
                resources: { ...state.resources, gold: 0 }
            }));

            gameStore.hireMercenary(testMerc);
            const state = get(gameStore);
            
            expect(state.mercenaries.length).toBe(0);
            expect(state.resources.gold).toBe(0);
        });

        it('should not hire when lodging capacity is full', () => {
            const testMerc = MERCENARIES[0];
            
            // 충분한 골드 지급하고 숙소 용량 가득 채우기
            gameStore.update(state => ({
                ...state,
                resources: { ...state.resources, gold: 1000 },
                buildings: { lodging: 1 }, // 용량 3
                mercenaries: Array(3).fill({ ...testMerc, uniqueId: Date.now() })
            }));

            gameStore.hireMercenary(testMerc);
            const state = get(gameStore);
            
            expect(state.mercenaries.length).toBe(3); // 변화 없음
            expect(state.resources.gold).toBe(1000); // 골드 차감 없음
        });
    });

    // 전투 시스템 테스트
    describe('Battle System', () => {
        it('should process battle correctly', () => {
            // MERCENARIES[0]의 원본 데이터를 유지하면서 테스트용 데이터 생성
            const baseMerc = MERCENARIES[0];
            const testMerc = {
                ...baseMerc,
                uniqueId: 'test_merc_1',
                level: 1,
                exp: 0,
                power: 100,  // 충분한 전투력
                battleCost: baseMerc.battleCost  // 원본 용병의 전투 비용 사용
            };
            const testMonster = {
                ...MONSTERS.slime,
                rewards: { gold: 10 },
                exp: 20,
                hp: 50
            };

            // 용병 추가 및 골드 지급
            gameStore.update(state => ({
                ...state,
                mercenaries: [testMerc],
                resources: { ...state.resources, gold: 1000 }
            }));

            const initialState = get(gameStore);
            gameStore.processMercenaryBattle(testMerc, testMonster);
            const finalState = get(gameStore);

            // 전투 후 상태 확인
            const updatedMerc = finalState.mercenaries[0];
            expect(updatedMerc.exp).toBe(20); // 몬스터 경험치만큼 획득
        
        });

        it('should fail battle if power is insufficient', () => {
            const testMerc = {
                ...MERCENARIES[0],
                uniqueId: 'test_merc_1',
                level: 1,
                exp: 0,  // 초기 경험치 설정
                power: 1 // 매우 낮은 전투력
            };
            const testMonster = {
                ...MONSTERS.dragon,
                hp: 1000,  // 높은 HP
                rewards: { gold: 100 },
                exp: 50
            };

            // 초기 상태 설정
            gameStore.update(state => ({
                ...state,
                mercenaries: [testMerc],
                resources: { ...state.resources, gold: 1000 }
            }));

            const initialState = get(gameStore);
            gameStore.processMercenaryBattle(testMerc, testMonster);
            const finalState = get(gameStore);

            // 전투 실패 시 검증
            const updatedMerc = finalState.mercenaries[0];
            expect(updatedMerc.exp).toBe(0);  // 경험치 획득 없음
            expect(finalState.resources.gold).toBe(initialState.resources.gold - testMerc.battleCost);  // 전투 비용만 차감
            expect(updatedMerc.level).toBe(1);  // 레벨 변화 없음
            expect(updatedMerc.power).toBe(1);  // 전투력 변화 없음
        });
    });

    // 용병 레벨업 시스템 테스트
    describe('Mercenary Leveling', () => {
        it('should level up when enough exp gained', () => {
            const testMerc = {
                ...MERCENARIES[0],
                uniqueId: 'test_merc_1',
                level: 1,
                exp: 0,
                power: MERCENARIES[0].basePower
            };
            const testMonster = {
                ...MONSTERS.slime,
                exp: 1000 // 많은 경험치 제공
            };

            gameStore.update(state => ({
                ...state,
                mercenaries: [testMerc],
                resources: { ...state.resources, gold: 1000 }
            }));

            gameStore.processMercenaryBattle(testMerc, testMonster);
            const state = get(gameStore);

            expect(state.mercenaries[0].level).toBeGreaterThan(1);
            expect(state.mercenaries[0].power).toBeGreaterThan(testMerc.power);
        });
    });

    // 저장/로드 시스템 테스트
    describe('Save/Load System', () => {
        it('should save and load game state correctly', () => {
            const baseMerc = MERCENARIES[0];
            const testMerc = {
                ...baseMerc,
                uniqueId: 'test_merc_1',
                level: 2,
                exp: 50,
                power: baseMerc.basePower + (baseMerc.powerPerLevel * 2)  // 레벨 2의 정확한 전투력 계산
            };

            const testState = {
                resources: { gold: 1000, wood: 500, stone: 200 },
                buildings: { lodging: 1 },
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
                    maxExp: 50,
                    attackPower: 5
                },
                currentBattle: {
                    selectedGround: null,
                    selectedMonster: null,
                    monsterHp: 0
                },
                mercenaries: [testMerc],
                mercenaryAssignments: {}
            };

            // 전체 상태를 한 번에 설정
            gameStore.set(testState);
            gameStore.saveGame();
            expect(localStorageMock.setItem).toHaveBeenCalled();
            
            // 초기화
            gameStore.resetGame();
            
            // 로드
            gameStore.loadSavedGame();
            expect(localStorageMock.getItem).toHaveBeenCalled();

            const loadedState = get(gameStore);
            
            // 상태 비교
            expect(loadedState.resources.gold).toBe(testState.resources.gold);
            expect(loadedState.resources.wood).toBe(testState.resources.wood);
            expect(loadedState.resources.stone).toBe(testState.resources.stone);
            expect(loadedState.mercenaries[0].level).toBe(testMerc.level);
            expect(loadedState.mercenaries[0].power).toBe(testMerc.power);
        });
    });
}); 