<script>
  import { gameStore } from '../lib/stores/gameStore';
  import { logStore } from '../lib/stores/logStore';
  import { calculateUpgradeCost, UPGRADE_CONFIGS } from '../lib/utils/upgradeCosts';
  import UpgradeButton from '../lib/components/UpgradeButton.svelte';
  import GameLayout from '../lib/components/GameLayout.svelte';

  let gameState;
  gameStore.subscribe(state => {
    gameState = state;
  });
</script>

<GameLayout>
  <div class="upgrades-container">
    <h1>업그레이드</h1>
    
    <div class="upgrades-section">
      <h2>기본 업그레이드</h2>
      <div class="upgrades-list">
        <UpgradeButton
          type="clickPower"
          cost={{ gold: calculateUpgradeCost(UPGRADE_CONFIGS.clickPower.baseAmount, UPGRADE_CONFIGS.clickPower.multiplier, gameState.upgrades.clickPower) }}
          description="클릭 파워 증가"
          disabled={gameState.resources.gold < calculateUpgradeCost(UPGRADE_CONFIGS.clickPower.baseAmount, UPGRADE_CONFIGS.clickPower.multiplier, gameState.upgrades.clickPower)}
          currentLevel={gameState.upgrades.clickPower}
        />
      </div>
    </div>

    <div class="upgrades-section">
      <h2>자원 보너스</h2>
      <div class="upgrades-list">
        {#if gameState.resources.wood > 0}
          <UpgradeButton
            type="woodBonus"
            cost={{ wood: calculateUpgradeCost(UPGRADE_CONFIGS.woodBonus.baseAmount, UPGRADE_CONFIGS.woodBonus.multiplier, gameState.upgrades.woodBonus) }}
            description="나무 생산량 20% 증가"
            disabled={gameState.resources.wood < calculateUpgradeCost(UPGRADE_CONFIGS.woodBonus.baseAmount, UPGRADE_CONFIGS.woodBonus.multiplier, gameState.upgrades.woodBonus)}
            currentLevel={gameState.upgrades.woodBonus}
            bonusText={` (+${gameState.upgrades.woodBonus * 20}%)`}
          />
        {/if}

        {#if gameState.resources.stone > 0}
          <UpgradeButton
            type="stoneBonus"
            cost={{ stone: calculateUpgradeCost(UPGRADE_CONFIGS.stoneBonus.baseAmount, UPGRADE_CONFIGS.stoneBonus.multiplier, gameState.upgrades.stoneBonus) }}
            description="돌 생산량 20% 증가"
            disabled={gameState.resources.stone < calculateUpgradeCost(UPGRADE_CONFIGS.stoneBonus.baseAmount, UPGRADE_CONFIGS.stoneBonus.multiplier, gameState.upgrades.stoneBonus)}
            currentLevel={gameState.upgrades.stoneBonus}
            bonusText={` (+${gameState.upgrades.stoneBonus * 20}%)`}
          />
        {/if}

        {#if gameState.resources.wood > 0 && gameState.resources.stone > 0}
          <UpgradeButton
            type="goldMultiplier"
            cost={{
              wood: calculateUpgradeCost(UPGRADE_CONFIGS.goldMultiplier.baseAmount, UPGRADE_CONFIGS.goldMultiplier.multiplier, gameState.upgrades.goldMultiplier),
              stone: calculateUpgradeCost(UPGRADE_CONFIGS.goldMultiplier.baseAmount, UPGRADE_CONFIGS.goldMultiplier.multiplier, gameState.upgrades.goldMultiplier)
            }}
            description="골드 획득량 30% 증가"
            disabled={
              gameState.resources.wood < calculateUpgradeCost(UPGRADE_CONFIGS.goldMultiplier.baseAmount, UPGRADE_CONFIGS.goldMultiplier.multiplier, gameState.upgrades.goldMultiplier) ||
              gameState.resources.stone < calculateUpgradeCost(UPGRADE_CONFIGS.goldMultiplier.baseAmount, UPGRADE_CONFIGS.goldMultiplier.multiplier, gameState.upgrades.goldMultiplier)
            }
            currentLevel={gameState.upgrades.goldMultiplier}
            bonusText={` (+${gameState.upgrades.goldMultiplier * 30}%)`}
          />
        {/if}
      </div>
    </div>

    <div class="upgrades-section">
      <h2>자동화</h2>
      <div class="upgrades-list">
        {#each ['Gold', 'Wood', 'Stone'] as resource}
          <UpgradeButton
            type={`auto${resource}`}
            cost={{ gold: calculateUpgradeCost(UPGRADE_CONFIGS.autoProduction.baseAmount, UPGRADE_CONFIGS.autoProduction.multiplier, gameState.upgrades[`auto${resource}`]) }}
            description={`자동 ${resource} 생산`}
            disabled={gameState.resources.gold < calculateUpgradeCost(UPGRADE_CONFIGS.autoProduction.baseAmount, UPGRADE_CONFIGS.autoProduction.multiplier, gameState.upgrades[`auto${resource}`])}
            currentLevel={gameState.upgrades[`auto${resource}`]}
          />
        {/each}
      </div>
    </div>
  </div>
</GameLayout>

<style>
  .upgrades-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .upgrades-section {
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
  }

  .upgrades-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  h1, h2 {
    color: #333;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5em;
  }
</style> 