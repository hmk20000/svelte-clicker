<script>
  import { gameStore } from '../lib/stores/gameStore';
  import { logStore } from '../lib/stores/logStore';
  import GameButton from '../lib/components/GameButton.svelte';
  import GameLayout from '../lib/components/GameLayout.svelte';

  let gameState;
  gameStore.subscribe(state => {
    gameState = state;
  });

  function formatNumber(num) {
    return Math.floor(num).toLocaleString();
  }

  function calculateTotalValue() {
    const { resources, upgrades } = gameState;
    return {
      gold: formatNumber(resources.gold),
      wood: formatNumber(resources.wood),
      stone: formatNumber(resources.stone),
      totalUpgrades: Object.values(upgrades).reduce((a, b) => a + b, 0),
      clickPower: formatNumber(upgrades.clickPower),
      autoProduction: {
        gold: formatNumber(upgrades.autoGold),
        wood: formatNumber(upgrades.autoWood),
        stone: formatNumber(upgrades.autoStone)
      },
      bonuses: {
        wood: `${upgrades.woodBonus * 20}%`,
        stone: `${upgrades.stoneBonus * 20}%`,
        gold: `${upgrades.goldMultiplier * 30}%`
      }
    };
  }
</script>

<GameLayout>
  <div class="inventory-container">
    <h1>인벤토리</h1>

    <div class="stats-section">
      <h2>보유 자원</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <h3>골드</h3>
          <p>{calculateTotalValue().gold}</p>
        </div>
        <div class="stat-item">
          <h3>나무</h3>
          <p>{calculateTotalValue().wood}</p>
        </div>
        <div class="stat-item">
          <h3>돌</h3>
          <p>{calculateTotalValue().stone}</p>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>업그레이드 현황</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <h3>클릭 파워</h3>
          <p>{calculateTotalValue().clickPower}</p>
        </div>
        <div class="stat-item">
          <h3>총 업그레이드 수</h3>
          <p>{calculateTotalValue().totalUpgrades}</p>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>자동 생산량</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <h3>골드/초</h3>
          <p>{calculateTotalValue().autoProduction.gold}</p>
        </div>
        <div class="stat-item">
          <h3>나무/초</h3>
          <p>{calculateTotalValue().autoProduction.wood}</p>
        </div>
        <div class="stat-item">
          <h3>돌/초</h3>
          <p>{calculateTotalValue().autoProduction.stone}</p>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>생산 보너스</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <h3>골드 보너스</h3>
          <p>{calculateTotalValue().bonuses.gold}</p>
        </div>
        <div class="stat-item">
          <h3>나무 보너스</h3>
          <p>{calculateTotalValue().bonuses.wood}</p>
        </div>
        <div class="stat-item">
          <h3>돌 보너스</h3>
          <p>{calculateTotalValue().bonuses.stone}</p>
        </div>
      </div>
    </div>
  </div>
</GameLayout>

<style>
  .inventory-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .stats-section {
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 10px;
  }

  .stat-item {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }

  .stat-item h3 {
    margin: 0;
    color: #666;
    font-size: 1em;
  }

  .stat-item p {
    margin: 10px 0 0;
    font-size: 1.2em;
    font-weight: bold;
    color: #4CAF50;
  }

  h1, h2 {
    color: #333;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5em;
  }
</style> 