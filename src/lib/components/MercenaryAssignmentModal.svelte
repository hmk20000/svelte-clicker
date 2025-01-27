<script>
    import { mercenaryAssignmentModal } from '../stores/modalStore';
    import { gameStore } from '../stores/gameStore';
    import { MONSTERS } from '../config/monsters';
    import { onMount, onDestroy } from 'svelte';
    import { logStore } from '../stores/logStore';

    // 자동 사냥 타이머 관리 - 전역 변수로 변경
    let huntingTimers = {};

    function assignMercenary(monsterId, mercenaryId) {
        const merc = $gameStore.mercenaries.find(m => m.uniqueId === mercenaryId);
        if (merc) {
            gameStore.assignMercenary(monsterId, mercenaryId);
            startAutoHunting(monsterId, merc);
        }
    }

    function unassignMercenary(monsterId, mercenaryId) {
        gameStore.unassignMercenary(monsterId, mercenaryId);
        stopAutoHunting(`${monsterId}_${mercenaryId}`);
    }

    // 전체 배치 함수
    function assignAllMercenaries(monsterId) {
        const availableMercs = $gameStore.mercenaries.filter(m => 
            !Object.values($gameStore.mercenaryAssignments).flat().includes(m.uniqueId)
        );
        availableMercs.forEach(merc => {
            assignMercenary(monsterId, merc.uniqueId);
        });
    }

    // 전체 철수 함수
    function unassignAllMercenaries(monsterId) {
        const assignedMercs = $gameStore.mercenaryAssignments[monsterId] || [];
        assignedMercs.forEach(mercId => {
            unassignMercenary(monsterId, mercId);
        });
    }

    function startAutoHunting(monsterId, merc) {
        const timerId = `${monsterId}_${merc.uniqueId}`;
        if (huntingTimers[timerId]) {
            clearInterval(huntingTimers[timerId]);
        }
        
        huntingTimers[timerId] = setInterval(() => {
            const monster = MONSTERS[monsterId];
            
            // 전투 처리
            gameStore.processMercenaryBattle(merc, monster);
            
            // 순수익 계산 및 로그 표시
            const netGold = monster.rewards.gold - merc.battleCost;
            logStore.addLog(`${merc.name}이(가) ${monster.name}을(를) 처치! 순수익: ${netGold} 골드`);
        }, 5000);
    }

    function stopAutoHunting(timerId) {
        if (huntingTimers[timerId]) {
            clearInterval(huntingTimers[timerId]);
            delete huntingTimers[timerId];
        }
    }

    function canFightMonster(merc, monsterId) {
        const monster = MONSTERS[monsterId];
        const requiredPower = Math.ceil(monster.hp * 0.1);
        return merc.power >= requiredPower;
    }

    // 컴포넌트 마운트 시 기존 배치된 용병들의 자동 사냥 시작
    onMount(() => {
        Object.entries($gameStore.mercenaryAssignments).forEach(([monsterId, mercIds]) => {
            mercIds.forEach(mercId => {
                const merc = $gameStore.mercenaries.find(m => m.uniqueId === mercId);
                if (merc) {
                    startAutoHunting(monsterId, merc);
                }
            });
        });
    });

    // 컴포넌트가 제거될 때 타이머 정리하지 않음
    // onDestroy(() => {
    //     Object.values(huntingTimers).forEach(timer => clearInterval(timer));
    // });

    function processBattles() {
        const assignments = $gameStore.mercenaryAssignments;
        const gold = $gameStore.resources.gold;

        Object.entries(assignments).forEach(([monsterId, mercenaryIds]) => {
            const monster = MONSTERS[monsterId];
            mercenaryIds.forEach(mercId => {
                const merc = $gameStore.mercenaries.find(m => m.uniqueId === mercId);
                if (!merc) return;

                // 전투 처리
                gameStore.processMercenaryBattle(merc, monster);
            });
        });
    }
</script>

{#if $mercenaryAssignmentModal.isOpen}
    <div class="mercenary-assignment-modal">
        <div class="modal-header">
            <h2>{MONSTERS[$mercenaryAssignmentModal.monsterId].name} - 용병 배치</h2>
            <button class="close-button" on:click={() => mercenaryAssignmentModal.close()}>×</button>
        </div>
        
        <div class="assignment-layout">
            <!-- 좌측: 사용 가능한 용병 목록 -->
            <div class="available-mercenaries">
                <div class="section-header">
                    <h3>보유 용병</h3>
                    <button 
                        class="assign-all-button"
                        on:click={() => assignAllMercenaries($mercenaryAssignmentModal.monsterId)}
                        disabled={!$gameStore.mercenaries.some(m => 
                            !Object.values($gameStore.mercenaryAssignments).flat().includes(m.uniqueId)
                        )}
                    >
                        전체 배치
                    </button>
                </div>
                <div class="mercenary-list">
                    {#each $gameStore.mercenaries.filter(m => 
                        !Object.values($gameStore.mercenaryAssignments).flat().includes(m.uniqueId)
                    ) as merc}
                        <div class="mercenary-card">
                            <div class="merc-info">
                                <h4>{merc.name} #{merc.uniqueId.split('_')[1].substr(-4)}</h4>
                                <p>전투력: {merc.power}</p>
                                <p class="cost">비용: {merc.battleCost} 골드/전투</p>
                                {#if !canFightMonster(merc, $mercenaryAssignmentModal.monsterId)}
                                    <p class="warning">⚠️ 전투력 부족</p>
                                {/if}
                            </div>
                            <button 
                                class="assign-button"
                                on:click={() => assignMercenary($mercenaryAssignmentModal.monsterId, merc.uniqueId)}
                                disabled={!canFightMonster(merc, $mercenaryAssignmentModal.monsterId)}
                            >
                                배치하기
                            </button>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- 우측: 배치된 용병 목록 -->
            <div class="assigned-mercenaries">
                <div class="section-header">
                    <h3>배치된 용병</h3>
                    <button 
                        class="unassign-all-button"
                        on:click={() => unassignAllMercenaries($mercenaryAssignmentModal.monsterId)}
                        disabled={!$gameStore.mercenaryAssignments[$mercenaryAssignmentModal.monsterId]?.length}
                    >
                        전체 철수
                    </button>
                </div>
                <div class="mercenary-list">
                    {#each ($gameStore.mercenaryAssignments[$mercenaryAssignmentModal.monsterId] || []) as mercId}
                        {@const merc = $gameStore.mercenaries.find(m => m.uniqueId === mercId)}
                        {#if merc}
                            <div class="mercenary-card">
                                <div class="merc-info">
                                    <h4>{merc.name} #{merc.uniqueId.split('_')[1].substr(-4)}</h4>
                                    <p>전투력: {merc.power}</p>
                                    <p class="cost">비용: {merc.battleCost} 골드/전투</p>
                                </div>
                                <button 
                                    class="unassign-button"
                                    on:click={() => unassignMercenary($mercenaryAssignmentModal.monsterId, merc.uniqueId)}
                                >
                                    철수하기
                                </button>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .mercenary-assignment-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        padding: 2rem;
        z-index: 1000;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1rem;
        border-radius: 8px 8px 0 0;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    .assignment-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        background: white;
        padding: 1rem;
        border-radius: 0 0 8px 8px;
        overflow: auto;
        flex: 1;
    }

    .mercenary-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        max-height: 60vh;
        padding: 1rem;
    }

    .mercenary-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
    }

    .merc-info {
        flex: 1;
    }

    .assign-button, .unassign-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
    }

    .assign-button {
        background: #4CAF50;
        color: white;
    }

    .assign-button:hover {
        background: #45a049;
    }

    .unassign-button {
        background: #dc3545;
        color: white;
    }

    .unassign-button:hover {
        background: #c82333;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0 1rem;
    }

    .section-header h3 {
        margin: 0;
    }

    .assign-all-button, .unassign-all-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .assign-all-button {
        background: #4CAF50;
        color: white;
    }

    .assign-all-button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .unassign-all-button {
        background: #dc3545;
        color: white;
    }

    .unassign-all-button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    h2 {
        margin: 0;
        color: #333;
    }

    h4 {
        margin: 0 0 0.5rem 0;
        color: #444;
    }

    p {
        margin: 0.25rem 0;
    }

    .cost {
        color: #e74c3c;
    }

    .warning {
        color: #dc3545;
        font-size: 0.9em;
        margin-top: 0.5rem;
    }

    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
</style> 