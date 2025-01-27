<script>
    import { logStore } from '../stores/logStore';

    function clearLogs() {
        logStore.clear();
    }

    // 로그를 최신 순으로 정렬
    $: sortedLogs = [...$logStore].reverse();
</script>

<div class="log-viewer">
    <div class="log-header">
        <h3>전투 로그</h3>
        <button class="clear-button" on:click={clearLogs}>
            지우기
        </button>
    </div>
    <div class="log-content">
        {#each sortedLogs as log}
            <div class="log-entry">
                {log.message}
                <span class="timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .log-viewer {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    h3 {
        margin: 0;
    }

    .clear-button {
        padding: 0.25rem 0.5rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8em;
    }

    .clear-button:hover {
        background: #c82333;
    }

    .log-content {
        flex: 1;
        overflow-y: auto;
        font-size: 0.9em;
        display: flex;
        flex-direction: column;
    }

    .log-entry {
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .log-entry:last-child {
        border-bottom: none;
    }

    .timestamp {
        font-size: 0.8em;
        color: #666;
    }
</style> 