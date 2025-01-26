<script>
  import { onMount } from 'svelte';
  import { gameStore } from '../lib/stores/gameStore';
  import { logStore } from '../lib/stores/logStore';
  import { calculateUpgradeCost, UPGRADE_CONFIGS } from '../lib/utils/upgradeCosts';
  import GameButton from '../lib/components/GameButton.svelte';
  import UpgradeButton from '../lib/components/UpgradeButton.svelte';
  import GameLayout from '../lib/components/GameLayout.svelte';

  let gameState;
  let saveInterval;

  gameStore.subscribe(state => {
    gameState = state;
  });

  let logs = [];
  logStore.subscribe(value => {
    logs = value;
  });

  onMount(() => {
    // 자동 생산 타이머
    const productionTimer = setInterval(() => {
      const { upgrades } = gameState;
      if (upgrades.autoGold) gameStore.addResource('gold', upgrades.autoGold);
      if (upgrades.autoWood) gameStore.addResource('wood', upgrades.autoWood);
      if (upgrades.autoStone) gameStore.addResource('stone', upgrades.autoStone);
    }, 1000);

    // 자동 저장 타이머 (1분마다)
    saveInterval = setInterval(() => {
      gameStore.saveGame();
      logStore.addLog('게임이 자동 저장되었습니다.');
    }, 60000);

    // 브라우저 닫기 이벤트 리스너 추가
    const handleBeforeUnload = () => {
      gameStore.saveGame();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(productionTimer);
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  function handleClick(resourceType) {
    const amount = Math.floor(gameState.upgrades.clickPower * getResourceBonus(resourceType));
    gameStore.addResource(resourceType, gameState.upgrades.clickPower);
    logStore.addLog(`${resourceType} +${amount} (클릭)`);
  }

  function getResourceBonus(resourceType) {
    switch (resourceType) {
      case 'wood':
        return 1 + gameState.upgrades.woodBonus * 0.2;
      case 'stone':
        return 1 + gameState.upgrades.stoneBonus * 0.2;
      case 'gold':
        return 1 + gameState.upgrades.goldMultiplier * 0.3;
      default:
        return 1;
    }
  }

  function handleSave() {
    gameStore.saveGame();
    alert('게임이 저장되었습니다!');
  }
</script>

<GameLayout>
  <div class="game-layout">
    <div class="game-container">
      <h1>클리커 게임</h1>
      
      <div class="resources">
        {#each Object.entries(gameState.resources) as [type, amount]}
          <div class="resource-card">
            <h2>{type}: {Math.floor(amount)}</h2>
            <GameButton onClick={() => handleClick(type)}>
              클릭 (+{gameState.upgrades.clickPower})
            </GameButton>
          </div>
        {/each}
      </div>
    </div>
  </div>
</GameLayout>

<style>
  .game-layout {
    display: flex;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .game-container {
    flex: 2;
    text-align: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: white;
  }

  .log-container {
    flex: 1;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: white;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .log-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-top: 10px;
  }

  .log-item {
    padding: 5px;
    border-bottom: 1px solid #eee;
    font-size: 0.9em;
    display: flex;
    gap: 10px;
  }

  .log-time {
    color: #666;
    font-size: 0.8em;
  }

  .log-message {
    flex: 1;
  }

  /* 로그 스크롤바 스타일 */
  .log-list::-webkit-scrollbar {
    width: 8px;
  }

  .log-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .log-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .log-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .upgrades {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
  }

  .upgrades-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
  }

  .upgrades-list::-webkit-scrollbar {
    width: 8px;
  }

  .upgrades-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .upgrades-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .upgrades-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .resources {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
  }

  .resource-card {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  .upgrade-item {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .floating-number {
    position: absolute;
    color: #4CAF50;
    font-weight: bold;
    pointer-events: none;
    animation: float-up 1s ease-out forwards;
    z-index: 100;
  }

  @keyframes float-up {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
</style> 