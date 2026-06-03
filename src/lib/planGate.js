const PLANS = {
  free:    { accounts: 2,  relay: false, fleet: false, wall: false },
  starter: { accounts: 5,  relay: true,  fleet: false, wall: false },
  pro:     { accounts: 25, relay: true,  fleet: true,  wall: true  },
  agency:  { accounts: 999,relay: true,  fleet: true,  wall: true  },
};

export const getPlan = () => localStorage.getItem('agp_plan') || 'free';
export const setPlan = (plan) => localStorage.setItem('agp_plan', plan);
export const canDo = (feature) => PLANS[getPlan()]?.[feature] ?? false;
export const getLimit = (feature) => PLANS[getPlan()]?.[feature] ?? 0;

export const getCurrentPlan = () => {
  const plan = getPlan();
  const labels = {
    free: { id: 'free', label: 'Free Trial' },
    starter: { id: 'starter', label: 'Starter' },
    pro: { id: 'pro', label: 'Professional Pro' },
    agency: { id: 'agency', label: 'Enterprise Agency' }
  };
  return labels[plan] || labels.free;
};

export const checkAccountLimit = (currentCount) => {
  const plan = getPlan();
  const limit = PLANS[plan]?.accounts ?? 2;
  const upgradeRequired = currentCount >= limit;
  return {
    upgradeRequired,
    upgradeMessage: `You've reached the maximum limit of ${limit} accounts for your ${getCurrentPlan().label} plan. Upgrade to link more workspaces.`
  };
};

