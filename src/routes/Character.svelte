<script>
  import { gameStore } from '../lib/stores/gameStore';
  import GameLayout from '../lib/components/GameLayout.svelte';
  import { onMount } from "svelte";

  let gameState;
  gameStore.subscribe(state => {
    gameState = state;
  });

  $: character = $gameStore.character;
  $: expPercentage = (character.exp / character.maxExp) * 100;

  function calculateExpPercentage() {
    return (gameState.character.exp / gameState.character.maxExp) * 100;
  }

  function formatNumber(num) {
    return Math.floor(num).toLocaleString();
  }
</script>

<GameLayout>
  <div class="character-container">
    <h1>캐릭터 정보</h1>

    <div class="character-section">
      <h2>기본 정보</h2>
      <div class="info-grid">
        <div class="info-card">
          <h3>레벨</h3>
          <p class="value">{character.level}</p>
        </div>
        <div class="info-card">
          <h3>공격력</h3>
          <p class="value">{character.attackPower}</p>
        </div>
      </div>
    </div>

    <div class="character-section">
      <h2>경험치</h2>
      <div class="exp-container">
        <div class="exp-bar">
          <div class="exp-fill" style="width: {expPercentage}%"></div>
        </div>
        <p class="exp-text">
          {character.exp} / {character.maxExp} EXP
        </p>
      </div>
    </div>

    <div class="character-section">
      <h2>보유 자원</h2>
      <div class="resources-grid">
        <div class="resource-card">
          <h3>골드</h3>
          <p class="value">{formatNumber(gameState.resources.gold)}</p>
        </div>
        <div class="resource-card">
          <h3>나무</h3>
          <p class="value">{formatNumber(gameState.resources.wood)}</p>
        </div>
        <div class="resource-card">
          <h3>돌</h3>
          <p class="value">{formatNumber(gameState.resources.stone)}</p>
        </div>
      </div>
    </div>

    <div class="character-section">
      <h2>업그레이드 현황</h2>
      <div class="upgrades-grid">
        <div class="upgrade-card">
          <h3>클릭 파워</h3>
          <p class="value">Lv.{gameState.upgrades.clickPower}</p>
        </div>
        <div class="upgrade-card">
          <h3>자동 생산</h3>
          <div class="sub-values">
            <p>골드: Lv.{gameState.upgrades.autoGold}</p>
            <p>나무: Lv.{gameState.upgrades.autoWood}</p>
            <p>돌: Lv.{gameState.upgrades.autoStone}</p>
          </div>
        </div>
        <div class="upgrade-card">
          <h3>생산 보너스</h3>
          <div class="sub-values">
            <p>골드: {gameState.upgrades.goldMultiplier * 30}%</p>
            <p>나무: {gameState.upgrades.woodBonus * 20}%</p>
            <p>돌: {gameState.upgrades.stoneBonus * 20}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</GameLayout>

<style>
  .character-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .character-section {
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
  }

  .info-grid, .resources-grid, .upgrades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 10px;
  }

  .info-card, .resource-card, .upgrade-card {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }

  .exp-container {
    margin-top: 10px;
  }

  .exp-bar {
    width: 100%;
    height: 20px;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
  }

  .exp-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
  }

  .exp-text {
    text-align: center;
    color: #666;
  }

  .value {
    font-size: 1.5em;
    font-weight: bold;
    color: #4CAF50;
    margin: 10px 0;
  }

  .sub-values {
    text-align: left;
    padding: 0 10px;
  }

  .sub-values p {
    margin: 5px 0;
    color: #666;
  }

  h1, h2 {
    color: #333;
    margin-bottom: 15px;
  }

  h3 {
    margin: 0;
    color: #666;
    font-size: 1em;
  }
</style> 