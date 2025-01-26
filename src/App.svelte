<script>
	import { Router, Link, Route } from "svelte-routing";
	import { onMount, beforeUpdate } from "svelte";
	import Home from "./routes/Home.svelte";
	import Battle from "./routes/Battle.svelte";
	import Inventory from "./routes/Inventory.svelte";
	import Character from "./routes/Character.svelte";
	import Settings from "./routes/Settings.svelte";
	import Shop from "./routes/Shop.svelte";
	import Mercenaries from "./routes/Mercenaries.svelte";
	import { gameStore } from "./lib/stores/gameStore";
	import Toast from "./lib/components/Toast.svelte";
	import MercenaryAssignmentModal from './lib/components/MercenaryAssignmentModal.svelte';
	
	export let url = "";
	let previousUrl = url;

	// 게임 상태 구독
	let unsubscribe;
	let lastSaveTime = Date.now();
	const SAVE_COOLDOWN = 5000; // 5초 쿨다운

	onMount(() => {
		gameStore.loadSavedGame();

		// 게임 상태 변경 감지 및 저장
		unsubscribe = gameStore.subscribe(state => {
			const now = Date.now();
			if (now - lastSaveTime > SAVE_COOLDOWN) {
				gameStore.saveGame();
				lastSaveTime = now;
			}
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});

	// URL 변경 시 저장
	beforeUpdate(() => {
		if (previousUrl !== url) {
			gameStore.saveGame();
		}
		previousUrl = url;
	});
</script>

<Router {url}>
	<Toast />
	<nav>
		<Link to="/">홈</Link>
		<Link to="/battle">전투</Link>
		<Link to="/character">캐릭터</Link>
		<Link to="/inventory">인벤토리</Link>
		<Link to="/mercenaries">용병</Link>
		<Link to="/shop">상점</Link>
		<Link to="/settings">설정</Link>
	</nav>

	<main>
		<Route path="/" component={Home} />
		<Route path="/battle" component={Battle} />
		<Route path="/character" component={Character} />
		<Route path="/shop" component={Shop} />
		<Route path="/inventory" component={Inventory} />
		<Route path="/settings" component={Settings} />
		<Route path="/mercenaries" component={Mercenaries} />
	</main>
</Router>

<MercenaryAssignmentModal />

<style>
	nav {
		padding: 1rem;
		background: #f4f4f4;
	}
	
	:global(a) {
		margin-right: 1rem;
		text-decoration: none;
		color: #333;
		padding: 5px 10px;
		border-radius: 5px;
	}
	
	:global(a:hover) {
		background: #e0e0e0;
	}
	
	main {
		padding: 1em;
		max-width: 1200px;
		margin: 0 auto;
	}
</style>