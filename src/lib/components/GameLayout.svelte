<script>
  import GameLog from './GameLog.svelte';
</script>

<div class="game-layout">
  <div class="main-content">
    <slot />
  </div>
  <GameLog />
</div>

<style>
  .game-layout {
    display: flex;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .main-content {
    flex: 2;
  }
</style> 