import { store } from './store.js';

export const PLANS = {
  free:    {accounts:2,  relay:false, fleet:false, wall:false, remote:false},
  starter: {accounts:5,  relay:true,  fleet:false, wall:false, remote:true},
  pro:     {accounts:25, relay:true,  fleet:true,  wall:true,  remote:true},
  agency:  {accounts:999,relay:true,  fleet:true,  wall:true,  remote:true},
}
export const getPlan = () => store.getPlan()
export const canDo = (f) => PLANS[getPlan()]?.[f]??false
export const getLimit = (f) => PLANS[getPlan()]?.[f]??0

// Extra helpers for legacy code compatibility
export const setPlan = (plan) => store.setPlan(plan)
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
