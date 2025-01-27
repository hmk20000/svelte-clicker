<script>
    import { gameStore } from "../lib/stores/gameStore";
    import { MONSTERS } from '../lib/config/monsters';
    import { mercenaryAssignmentModal } from '../lib/stores/modalStore';
    import { MERCENARIES } from '../lib/config/mercenaries';
    import { toastStore } from '../lib/stores/toastStore';
    import GameLayout from '../lib/components/GameLayout.svelte';

    // $gameStore를 사용하면 자동으로 구독되어 상태 변경 시 컴포넌트가 갱신됨
    $: mercenaries = $gameStore.mercenaries;
    $: assignments = $gameStore.mercenaryAssignments;

    function dismissMercenary(mercenaryId) {
        gameStore.dismissMercenary(mercenaryId);
    }

    // 용병이 전투중인지 확인하는 함수
    function getMercenaryBattleStatus(mercId) {
        for (const [monsterId, mercIds] of Object.entries(assignments)) {
            if (mercIds.includes(mercId)) {
                return {
                    monsterName: MONSTERS[monsterId].name,
                    monsterId: monsterId
                };
            }
        }
        return null;
    }

    function getAssignedMonster(mercId) {
        for (const [monsterId, mercIds] of Object.entries(assignments)) {
            if (mercIds.includes(mercId)) {
                return monsterId;
            }
        }
        return null;
    }

    function getExpProgress(merc) {
        const mercConfig = MERCENARIES.find(m => m.id === merc.id.split('_')[0]);
        if (!mercConfig) return 0;
        const requiredExp = mercConfig.expForLevel(merc.level);
        return (merc.exp / requiredExp * 100).toFixed(1);
    }
</script>

<GameLayout>
    <h1>용병 관리</h1>
    
    {#if mercenaries.length === 0}
        <p>고용된 용병이 없습니다.</p>
    {:else}
        <div class="mercenary-list">
            {#each mercenaries as merc}
                {@const battleStatus = getMercenaryBattleStatus(merc.uniqueId)}
                {@const mercConfig = MERCENARIES.find(m => m.id === merc.id.split('_')[0])}
                {@const assignedMonster = getAssignedMonster(merc.uniqueId)}
                <div class="mercenary-card {battleStatus ? 'in-battle' : ''}">
                    <div class="merc-info">
                        <h3>{merc.name} #{merc.uniqueId.split('_')[1].substr(-4)}</h3>
                        <p>레벨: {merc.level} / {mercConfig.maxLevel}</p>
                        <p>전투력: {merc.power}</p>
                        <p class="battle-cost">전투 비용: {merc.battleCost} 골드</p>
                        
                        <div class="exp-info">
                            <div class="exp-bar">
                                <div 
                                    class="exp-fill" 
                                    style="width: {getExpProgress(merc)}%"
                                ></div>
                            </div>
                            <p class="exp-text">경험치: {merc.exp} / {mercConfig.expForLevel(merc.level)} EXP ({getExpProgress(merc)}%)</p>
                        </div>

                        {#if battleStatus}
                            <div class="battle-status" 
                                 on:click={() => mercenaryAssignmentModal.openAssignmentModal(battleStatus.monsterId)}
                                 role="button"
                                 tabindex="0"
                            >
                                🗡️ {battleStatus.monsterName} 사냥 중
                            </div>
                        {/if}
                    </div>
                    <button 
                        class="dismiss" 
                        on:click={() => dismissMercenary(merc.uniqueId)}
                        disabled={battleStatus}
                        title={battleStatus ? "전투 중인 용병은 해고할 수 없습니다" : ""}
                    >
                        {battleStatus ? '전투중' : '해고하기'}
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</GameLayout>

<style>
    .mercenary-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .mercenary-card {
        border: 2px solid #dee2e6;
        border-radius: 8px;
        padding: 1rem;
        background: #f8f9fa;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .mercenary-card.in-battle {
        border-color: #4CAF50;
        background: #f1f8e9;
    }

    .merc-info {
        flex: 1;
    }

    .battle-cost {
        color: #e74c3c;
    }

    .battle-status {
        color: #4CAF50;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        margin-top: 0.5rem;
    }

    .battle-status:hover {
        text-decoration: underline;
    }

    .dismiss {
        padding: 0.5rem 1rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
    }

    .dismiss:disabled {
        background: #6c757d;
        cursor: not-allowed;
    }

    .dismiss:hover:not(:disabled) {
        background: #c82333;
    }

    h3 {
        margin: 0 0 0.5rem 0;
    }

    p {
        margin: 0.25rem 0;
    }

    .exp-info {
        margin-top: 0.5rem;
    }

    .exp-bar {
        width: 100%;
        height: 8px;
        background: #eee;
        border-radius: 4px;
        overflow: hidden;
    }

    .exp-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.3s ease;
    }

    .exp-text {
        font-size: 0.9em;
        color: #666;
        text-align: center;
        margin-top: 0.25rem;
    }

    .max-level {
        color: #4CAF50;
        font-weight: bold;
        text-align: center;
        margin-top: 0.5rem;
    }
</style> 