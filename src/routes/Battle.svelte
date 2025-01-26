<script>
  import { onMount, onDestroy } from 'svelte';
  import { gameStore } from '../lib/stores/gameStore';
  import { logStore } from '../lib/stores/logStore';
  import GameButton from '../lib/components/GameButton.svelte';
  import GameLayout from '../lib/components/GameLayout.svelte';
  import { HUNTING_GROUNDS, MONSTERS } from '../lib/config/monsters';
  import { mercenaryAssignmentModal } from '../lib/stores/modalStore';

  let gameState;
  gameStore.subscribe(state => {
    gameState = state;
  });

  // 자동 사냥 타이머 관리
  let huntingTimers = {};
  
  function startAutoHunting(monsterId, merc) {
    const timerId = `${monsterId}_${merc.uniqueId}`;
    if (huntingTimers[timerId]) {
      clearInterval(huntingTimers[timerId]);
    }
    
    huntingTimers[timerId] = setInterval(() => {
      const monster = MONSTERS[monsterId];
      const { gold } = gameState.resources;
      
      if (gold < merc.battleCost) {
        logStore.addLog(`${merc.name}의 비용을 지불할 수 없어 철수했습니다.`);
        unassignMercenary(monsterId, merc.uniqueId);
        return;
      }
      
      gameStore.processMercenaryBattle(merc, monster);
      logStore.addLog(`${merc.name}이(가) ${monster.name}을(를) 처치하고 ${monster.rewards.gold}골드를 획득했습니다.`);
    }, 5000);
  }
  
  function stopAutoHunting(timerId) {
    if (huntingTimers[timerId]) {
      clearInterval(huntingTimers[timerId]);
      delete huntingTimers[timerId];
    }
  }
  
  // 컴포넌트가 제거될 때 모든 타이머 정리
  onDestroy(() => {
    Object.values(huntingTimers).forEach(timer => clearInterval(timer));
  });

  function handleGroundSelect(groundId) {
    gameStore.selectHuntingGround(groundId);
    if (groundId) {
      logStore.addLog(`${HUNTING_GROUNDS[groundId].name}으로 이동했습니다.`);
    }
  }

  function handleMonsterSelect(monsterId) {
    if (!monsterId) {
      gameStore.selectMonster(null);
      return;
    }
    gameStore.selectMonster(monsterId);
    logStore.addLog(`${MONSTERS[monsterId].name}와의 전투를 시작합니다!`);
  }

  function handleAttack() {
    const monster = MONSTERS[gameState.currentBattle.selectedMonster];
    gameStore.attackMonster();
  }

  // gameState를 반응형 변수로 선언
  $: monsterHpPercentage = getMonsterHpPercentage(gameState);

  function getMonsterHpPercentage(state) {
    if (!state?.currentBattle?.selectedMonster) return 0;
    const monster = MONSTERS[state.currentBattle.selectedMonster];
    return (state.currentBattle.monsterHp / monster.hp) * 100;
  }

  function assignMercenary(monsterId, mercenaryId) {
    const merc = gameState.mercenaries.find(m => m.uniqueId === mercenaryId);
    if (merc) {
      gameStore.assignMercenary(monsterId, mercenaryId);
      startAutoHunting(monsterId, merc);
    }
  }
  
  function unassignMercenary(monsterId, mercenaryId) {
    gameStore.unassignMercenary(monsterId, mercenaryId);
    stopAutoHunting(`${monsterId}_${mercenaryId}`);
  }
  
  // 컴포넌트 마운트 시 기존 배치된 용병들의 자동 사냥 시작
  onMount(() => {
    Object.entries(gameState.mercenaryAssignments).forEach(([monsterId, mercIds]) => {
      mercIds.forEach(mercId => {
        const merc = gameState.mercenaries.find(m => m.uniqueId === mercId);
        if (merc) {
          startAutoHunting(monsterId, merc);
        }
      });
    });
  });

  function handleAssignmentClick(monsterId) {
    mercenaryAssignmentModal.openAssignmentModal(monsterId);
  }
</script>

<GameLayout>
  <div class="battle-container">
    {#if !gameState.currentBattle.selectedGround}
      <div class="hunting-grounds">
        <h2>사냥터 선택</h2>
        <div class="grounds-grid">
          {#each Object.entries(HUNTING_GROUNDS) as [id, ground]}
            <div class="ground-card" class:selected={gameState.currentBattle.selectedGround === id}>
              <h3>{ground.name}</h3>
              <p>{ground.description}</p>
              <p>필요 레벨: {ground.requiredLevel}</p>
              <GameButton 
                onClick={() => handleGroundSelect(id)}
                disabled={gameState.character.level < ground.requiredLevel}
              >
                입장
              </GameButton>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if gameState.currentBattle.selectedGround && !gameState.currentBattle.selectedMonster}
      <div class="location-header">
        <GameButton onClick={() => handleGroundSelect(null)} class="back-button">
          ← 사냥터 목록
        </GameButton>
        <h2>{HUNTING_GROUNDS[gameState.currentBattle.selectedGround].name}</h2>
      </div>

      <div class="monster-list">
        <h2>몬스터 목록</h2>
        <div class="monsters-grid">
          {#each HUNTING_GROUNDS[gameState.currentBattle.selectedGround].monsters as monsterId}
            {@const monster = MONSTERS[monsterId]}
            <div class="monster-card">
              <h3>{monster.name}</h3>
              <p>체력: {monster.hp}</p>
              <p>경험치: {monster.exp}</p>
              <div class="rewards">
                <h4>보상:</h4>
                {#each Object.entries(monster.rewards) as [resource, amount]}
                  <span>{resource}: {amount}</span>
                {/each}
              </div>

              <div class="monster-actions">
                <GameButton onClick={() => handleMonsterSelect(monsterId)}>
                  직접 전투
                </GameButton>
                <GameButton onClick={() => handleAssignmentClick(monsterId)}>
                  용병 배치
                </GameButton>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if gameState.currentBattle.selectedMonster}
      <div class="location-header">
        <GameButton onClick={() => handleMonsterSelect(null)} class_="back-button">
          ← 몬스터 목록
        </GameButton>
        <h2>{MONSTERS[gameState.currentBattle.selectedMonster].name} 전투</h2>
      </div>

      <div class="battle-area">
        <div class="monster-status">
          <div class="hp-bar">
            <div class="hp-fill" style="width: {monsterHpPercentage}%"></div>
          </div>
          <p>HP: {Math.max(0, gameState.currentBattle.monsterHp)} / {MONSTERS[gameState.currentBattle.selectedMonster].hp}</p>
        </div>
        <GameButton onClick={handleAttack}>
          공격하기 ({gameState.character.attackPower})
        </GameButton>
      </div>
    {/if}
  </div>
</GameLayout>

<style>
  .location-header {
    display: flex;
    align-items: center;
    gap: 20px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .location-header h2 {
    margin: 0;
    flex: 1;
  }

  .back-button {
    padding: 8px 16px;
    font-size: 0.9em;
  }

  .battle-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .hunting-grounds {
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .grounds-grid, .monsters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 10px;
  }

  .ground-card, .monster-card {
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 15px;
    transition: all 0.3s ease;
  }

  .ground-card.selected, .monster-card.selected {
    border-color: #4CAF50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
  }

  .battle-area {
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    text-align: center;
  }

  .hp-bar {
    width: 100%;
    height: 20px;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
  }

  .hp-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.2s ease;
  }

  .rewards {
    margin: 10px 0;
    font-size: 0.9em;
  }

  .rewards span {
    margin-right: 10px;
  }

  h2 {
    color: #333;
    margin-bottom: 15px;
  }

  h3 {
    margin: 0 0 10px 0;
    color: #444;
  }

  .monster-card {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }
  
  .monster-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

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

  .unassign-button {
    background: #dc3545;
    color: white;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
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
</style> 