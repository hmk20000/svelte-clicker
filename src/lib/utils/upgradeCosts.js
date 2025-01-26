export function calculateUpgradeCost(baseAmount, multiplier, level) {
  return Math.floor(baseAmount * Math.pow(multiplier, level));
}

export const UPGRADE_CONFIGS = {
  clickPower: { baseAmount: 10, multiplier: 1.5 },
  woodBonus: { baseAmount: 50, multiplier: 1.6 },
  stoneBonus: { baseAmount: 40, multiplier: 1.6 },
  goldMultiplier: { baseAmount: 100, multiplier: 1.7 },
  autoProduction: { baseAmount: 50, multiplier: 1.5 }
}; 