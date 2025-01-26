<script>
  import GameButton from './GameButton.svelte';
  import { gameStore } from '../stores/gameStore';
  import { logStore } from '../stores/logStore';

  export let type;
  export let cost;
  export let description;
  export let disabled = false;
  export let currentLevel;
  export let bonusText = '';

  function handleUpgrade() {
    gameStore.purchaseUpgrade(type, cost);
    logStore.addLog(`${description} 업그레이드 구매 (레벨 ${currentLevel + 1})`);
  }
</script>

<div class="upgrade-item">
  <GameButton {disabled} onClick={handleUpgrade}>
    {description} (비용: {Object.entries(cost).map(([resource, amount]) => `${amount} ${resource}`).join(' + ')})
  </GameButton>
  <span>현재 레벨: {currentLevel}{bonusText}</span>
</div>

<style>
  .upgrade-item {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style> 