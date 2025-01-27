export const HUNTING_GROUNDS = {
  forest: {
    id: 'forest',
    name: "숲",
    description: "초보자를 위한 사냥터",
    requiredLevel: 1,
    monsters: ["slime", "wolf", "goblin"]
  },
  cave: {
    id: 'cave',
    name: "동굴",
    description: "중급 사냥터",
    requiredLevel: 5,
    monsters: ["bat", "spider", "skeleton"]
  },
  mountain: {
    id: 'mountain',
    name: "산",
    description: "고급 사냥터",
    requiredLevel: 10,
    monsters: ["bear", "golem", "dragon"]
  },
  desert: {
    id: 'desert',
    name: "사막",
    description: "고급 사냥터",
    requiredLevel: 15,
    monsters: ["scorpion", "mummy", "sphinx"]
  },
  volcano: {
    id: 'volcano',
    name: "화산",
    description: "최상급 사냥터",
    requiredLevel: 20,
    monsters: ["fireSpirit", "lavaGolem", "phoenix"]
  }
};

export const MONSTERS = {
  // 숲 몬스터 (레벨 1-4)
  slime: {
    name: "슬라임",
    hp: 30,
    rewards: {
      gold: 8,
      wood: 1
    },
    exp: 5
  },
  wolf: {
    name: "늑대",
    hp: 45,
    rewards: {
      gold: 12,
      wood: 2
    },
    exp: 8
  },
  goblin: {
    name: "고블린",
    hp: 60,
    rewards: {
      gold: 15,
      wood: 3,
      stone: 1
    },
    exp: 10
  },
  
  // 동굴 몬스터 (레벨 5-9)
  bat: {
    name: "박쥐",
    hp: 100,
    rewards: {
      gold: 25,
      stone: 2
    },
    exp: 15
  },
  spider: {
    name: "거미",
    hp: 150,
    rewards: {
      gold: 35,
      wood: 3,
      stone: 3
    },
    exp: 20
  },
  skeleton: {
    name: "스켈레톤",
    hp: 200,
    rewards: {
      gold: 45,
      stone: 5
    },
    exp: 25
  },

  // 산 몬스터 (레벨 10+)
  bear: {
    name: "곰",
    hp: 300,
    rewards: {
      gold: 60,
      wood: 8,
      stone: 3
    },
    exp: 35
  },
  golem: {
    name: "골렘",
    hp: 400,
    rewards: {
      gold: 100,
      stone: 12
    },
    exp: 50
  },
  dragon: {
    name: "드래곤",
    hp: 600,
    rewards: {
      gold: 250,
      wood: 20,
      stone: 20
    },
    exp: 150
  },

  // 사막 몬스터
  scorpion: {
    name: "전갈",
    hp: 800,
    rewards: {
      gold: 150,
      stone: 10,
      crystal: 1
    },
    exp: 80
  },
  mummy: {
    name: "미이라",
    hp: 1000,
    rewards: {
      gold: 200,
      crystal: 2
    },
    exp: 100
  },
  sphinx: {
    name: "스핑크스",
    hp: 1500,
    rewards: {
      gold: 300,
      crystal: 5
    },
    exp: 150
  },

  // 화산 몬스터
  fireSpirit: {
    name: "화염정령",
    hp: 2000,
    rewards: {
      gold: 400,
      crystal: 3,
      obsidian: 1
    },
    exp: 200
  },
  lavaGolem: {
    name: "용암 골렘",
    hp: 3000,
    rewards: {
      gold: 600,
      obsidian: 3
    },
    exp: 300
  },
  phoenix: {
    name: "불사조",
    hp: 5000,
    rewards: {
      gold: 1000,
      crystal: 10,
      obsidian: 5,
      phoenixFeather: 1
    },
    exp: 500
  }
}; 