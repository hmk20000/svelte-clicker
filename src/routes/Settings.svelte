<script>
  import { gameStore } from '../lib/stores/gameStore';
  import { logStore } from '../lib/stores/logStore';
  import GameButton from '../lib/components/GameButton.svelte';
  import { clearSave } from '../lib/storage';
  import { toastStore } from '../lib/stores/toastStore';
  import GameLayout from '../lib/components/GameLayout.svelte';

  let gameState;
  gameStore.subscribe(state => {
    gameState = state;
  });

  function resetGame() {
    if (confirm('정말로 게임을 초기화하시겠습니까? 모든 진행상황이 삭제됩니다.')) {
      clearSave();
      gameStore.resetGame();
      toastStore.show('게임이 초기화되었습니다.', 'success');
    }
  }

  function exportSave() {
    try {
      const saveData = JSON.stringify($gameStore);
      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `idle_game_save_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toastStore.show('게임 데이터가 저장되었습니다.', 'success');
    } catch (error) {
      toastStore.show('게임 데이터 저장에 실패했습니다.', 'error');
    }
  }

  function importSave(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveData = JSON.parse(e.target.result);
        gameStore.loadSaveData(saveData);
        toastStore.show('게임 데이터를 불러왔습니다.', 'success');
      } catch (error) {
        toastStore.show('잘못된 게임 데이터입니다.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // 파일 입력 초기화
  }

  function clearLogs() {
    if (confirm('정말로 모든 로그를 삭제하시겠습니까?')) {
      logStore.clear();
    }
  }
</script>

<GameLayout>
  <div class="settings">
    <h1>설정</h1>

    <div class="settings-section">
      <h2>게임 데이터</h2>
      <div class="settings-grid">
        <div class="setting-card">
          <h3>게임 초기화</h3>
          <p>모든 진행상황을 초기화합니다.</p>
          <button class="danger-button" on:click={resetGame}>초기화</button>
        </div>

        <div class="setting-card">
          <h3>데이터 내보내기</h3>
          <p>현재 게임 데이터를 파일로 저장합니다.</p>
          <button class="primary-button" on:click={exportSave}>내보내기</button>
        </div>

        <div class="setting-card">
          <h3>데이터 불러오기</h3>
          <p>저장된 게임 데이터를 불러옵니다.</p>
          <label class="file-input-label">
            파일 선택
            <input 
              type="file" 
              accept=".json"
              on:change={importSave}
              style="display: none;"
            >
          </label>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>게임 로그</h2>
      <div class="settings-grid">
        <div class="setting-item">
          <h3>로그 초기화</h3>
          <p>모든 게임 로그를 삭제합니다.</p>
          <GameButton onClick={clearLogs}>로그 삭제</GameButton>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>게임 정보</h2>
      <div class="settings-grid">
        <div class="setting-item">
          <h3>버전</h3>
          <p>1.0.0</p>
        </div>
        <div class="setting-item">
          <h3>제작자</h3>
          <p>Your Name</p>
        </div>
      </div>
    </div>
  </div>
</GameLayout>

<style>
  .settings {
    padding: 1rem;
  }

  .settings-section {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .setting-card {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
  }

  h1, h2, h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  p {
    color: #666;
    margin: 0 0 1rem 0;
  }

  button, .file-input-label {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    text-align: center;
  }

  .primary-button {
    background: #4CAF50;
    color: white;
  }

  .primary-button:hover {
    background: #45a049;
  }

  .danger-button {
    background: #dc3545;
    color: white;
  }

  .danger-button:hover {
    background: #c82333;
  }

  .file-input-label {
    background: #007bff;
    color: white;
    display: inline-block;
  }

  .file-input-label:hover {
    background: #0056b3;
  }
</style> 