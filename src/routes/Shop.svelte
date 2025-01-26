<script>
    import { gameStore, getLodgingUpgradeCost, getLodgingCapacity } from "../lib/stores/gameStore";

    // 상점 아이템 목록
    const shopItems = [
        {
            id: 'sword1',
            name: '기본 검',
            description: '기본적인 검입니다.',
            cost: 100,
            type: 'weapon',
            power: 5
        },
        {
            id: 'armor1',
            name: '가죽 갑옷',
            description: '기본적인 방어구입니다.',
            cost: 150,
            type: 'armor',
            defense: 3
        },
        {
            id: 'potion1',
            name: '체력 물약',
            description: 'HP를 회복합니다.',
            cost: 50,
            type: 'consumable',
            heal: 20
        }
    ];

    const mercenaries = [
        {
            id: 'merc1',
            name: '견습 전사',
            description: '숲 사냥터에 적합한 전사입니다.',
            hireCost: 50,
            battleCost: 5,
            power: 15,
            type: 'mercenary'
        },
        {
            id: 'merc2',
            name: '숙련된 전사',
            description: '동굴 사냥터에 적합한 전사입니다.',
            hireCost: 200,
            battleCost: 15,
            power: 40,
            type: 'mercenary'
        },
        {
            id: 'merc3',
            name: '베테랑 기사',
            description: '산 사냥터에 적합한 기사입니다.',
            hireCost: 500,
            battleCost: 35,
            power: 80,
            type: 'mercenary'
        }
    ];

    // 아이템 구매 함수
    function buyItem(item) {
        const { gold } = $gameStore;
        if (gold >= item.cost) {
            gameStore.update(state => ({
                ...state,
                gold: state.gold - item.cost,
                inventory: [...state.inventory, item]
            }));
        }
    }

    function hireMercenary(merc) {
        gameStore.hireMercenary(merc);
    }

    // 숙소 업그레이드 비용 계산
    $: lodgingCost = getLodgingUpgradeCost($gameStore.buildings.lodging);
    $: lodgingCapacity = getLodgingCapacity($gameStore.buildings.lodging);
    $: currentMercenaries = $gameStore.mercenaries.length;

    function upgradeLodging() {
        gameStore.upgradeLodging();
    }
</script>

<div class="shop">
    <div class="shop-header">
        <h1>상점</h1>
        <div class="gold-display">
            보유 골드: {$gameStore.resources.gold}
            <span class="gold-icon">🪙</span>
        </div>
    </div>
    
    <h2>건물</h2>
    <div class="shop-items">
        <div class="shop-item building">
            <h3>숙소</h3>
            <p>용병들을 수용할 수 있는 공간입니다.</p>
            <div class="building-info">
                <p>현재 레벨: {$gameStore.buildings.lodging}</p>
                <p>수용 가능: {lodgingCapacity}명</p>
                <p>현재 고용: {currentMercenaries}명</p>
            </div>
            <div class="cost-info">
                <p class="cost">업그레이드 비용:</p>
                <ul>
                    <li class={$gameStore.resources.gold < lodgingCost.gold ? 'insufficient' : ''}>
                        골드: {lodgingCost.gold} / {$gameStore.resources.gold}
                    </li>
                    <li class={$gameStore.resources.wood < lodgingCost.wood ? 'insufficient' : ''}>
                        목재: {lodgingCost.wood} / {$gameStore.resources.wood}
                    </li>
                    <li class={$gameStore.resources.stone < lodgingCost.stone ? 'insufficient' : ''}>
                        돌: {lodgingCost.stone} / {$gameStore.resources.stone}
                    </li>
                </ul>
            </div>
            <button 
                on:click={upgradeLodging}
                disabled={$gameStore.resources.gold < lodgingCost.gold || 
                         $gameStore.resources.wood < lodgingCost.wood ||
                         $gameStore.resources.stone < lodgingCost.stone}
            >
                업그레이드
            </button>
        </div>
    </div>

    <h2>용병 고용</h2>
    <div class="shop-items">
        {#each mercenaries as merc}
            <div class="shop-item mercenary">
                <h3>{merc.name}</h3>
                <p>{merc.description}</p>
                <p>전투력: {merc.power}</p>
                <p class="cost">고용 비용: {merc.hireCost} 골드</p>
                <p class="battle-cost">전투 비용: {merc.battleCost} 골드/전투</p>
                <button 
                    on:click={() => hireMercenary(merc)}
                    disabled={$gameStore.resources.gold < merc.hireCost}
                >
                    고용하기
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .shop {
        padding: 1rem;
    }

    .shop-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .shop-item {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        background: white;
    }

    .shop-item h3 {
        margin: 0 0 0.5rem 0;
    }

    .cost {
        font-weight: bold;
        color: #666;
    }

    button {
        width: 100%;
        padding: 0.5rem;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    button:hover:not(:disabled) {
        background: #45a049;
    }

    .battle-cost {
        color: #e74c3c;
        font-size: 0.9em;
    }
    
    .mercenary {
        background: #f8f9fa;
        border: 2px solid #dee2e6;
    }

    .shop-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #dee2e6;
    }

    .gold-display {
        font-size: 1.2rem;
        font-weight: bold;
        color: #ffa000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .gold-icon {
        font-size: 1.4rem;
    }

    h1 {
        margin: 0;
    }

    .building {
        background: #f1f8e9;
        border: 2px solid #81c784;
    }

    .building-info {
        margin: 1rem 0;
        padding: 0.5rem;
        background: rgba(129, 199, 132, 0.1);
        border-radius: 4px;
    }

    .cost-info ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
    }

    .cost-info li {
        color: #666;
        font-size: 0.9em;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .cost-info li.insufficient {
        color: #dc3545;
    }
</style> 