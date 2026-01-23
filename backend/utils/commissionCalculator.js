// Commission levels based on downline count
const COMMISSION_LEVELS = [
  { level: 1, minPeople: 1, maxPeople: 10, rate: 10 },
  { level: 2, minPeople: 11, maxPeople: 100, rate: 8 },
  { level: 3, minPeople: 101, maxPeople: 1000, rate: 6 },
  { level: 4, minPeople: 1001, maxPeople: 10000, rate: 4 },
  { level: 5, minPeople: 10001, maxPeople: 100000, rate: 2 }
];

const BASE_SUBSCRIPTION_AMOUNT = 250; // $250 per subscription

// Calculate commission for a user based on downline count
const calculateCommissionByLevel = (downlineCount) => {
  const levelData = COMMISSION_LEVELS.find(
    l => downlineCount >= l.minPeople && downlineCount <= l.maxPeople
  );
  return levelData || COMMISSION_LEVELS[0];
};

// Calculate total earnings for a user
const calculateTotalEarnings = (downlineCount, baseAmount = BASE_SUBSCRIPTION_AMOUNT) => {
  const level = calculateCommissionByLevel(downlineCount);
  const commissionAmount = (baseAmount * level.rate) / 100;
  return downlineCount * commissionAmount;
};

// Get all commission levels breakdown
const getCommissionBreakdown = (downlineCount, baseAmount = BASE_SUBSCRIPTION_AMOUNT) => {
  return COMMISSION_LEVELS.map(level => {
    if (downlineCount >= level.minPeople && downlineCount <= level.maxPeople) {
      const profitPerPerson = (baseAmount * level.rate) / 100;
      const totalProfit = downlineCount * profitPerPerson;
      return {
        ...level,
        isActive: true,
        profitPerPerson,
        totalProfit,
        actualDownlineCount: downlineCount
      };
    }
    const profitPerPerson = (baseAmount * level.rate) / 100;
    return {
      ...level,
      isActive: false,
      profitPerPerson,
      totalProfit: level.maxPeople * profitPerPerson,
      actualDownlineCount: 0
    };
  });
};

module.exports = {
  COMMISSION_LEVELS,
  BASE_SUBSCRIPTION_AMOUNT,
  calculateCommissionByLevel,
  calculateTotalEarnings,
  getCommissionBreakdown
};
