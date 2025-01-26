<script>
  import { logStore } from '../stores/logStore';

  let logs = [];
  logStore.subscribe(value => {
    logs = value;
  });
</script>

<div class="log-container">
  <h2>게임 로그</h2>
  <div class="log-list">
    {#each logs.slice().reverse() as log}
      <div class="log-item">
        <span class="log-time">{log.timestamp.toLocaleTimeString()}</span>
        <span class="log-message">{log.message}</span>
      </div>
    {/each}
  </div>
</div>

<style>
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
</style> 