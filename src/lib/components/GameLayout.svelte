<script>
  import LogViewer from './LogViewer.svelte';
</script>

<div class="game-layout">
  <div class="content">
    <slot />
  </div>

  <div class="log-container">
    <LogViewer />
  </div>
</div>

<style>
  .game-layout {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1rem;
    height: calc(100vh - 2rem);
  }

  .content {
    overflow-y: auto;
  }

  .log-container {
    border-left: 1px solid #dee2e6;
    padding-left: 1rem;
    height: 100%;
    overflow-y: hidden;
  }
</style> 