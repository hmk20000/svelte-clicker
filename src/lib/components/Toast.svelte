<script>
  import { toastStore } from '../stores/toastStore';
  import { fly } from 'svelte/transition';
</script>

<div class="toast-container">
  {#each $toastStore as toast (toast.id)}
    <div
      class="toast-item {toast.type}"
      transition:fly={{ x: 50, duration: 300 }}
    >
      {toast.message}
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .toast-item {
    padding: 15px 25px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 1em;
    min-width: 200px;
  }

  .toast-item.success {
    background: #4CAF50;
    color: white;
  }

  .toast-item.info {
    background: #2196F3;
    color: white;
  }

  .toast-item.warning {
    background: #FF9800;
    color: white;
  }

  .toast-item.error {
    background: #f44336;
    color: white;
  }
</style> 