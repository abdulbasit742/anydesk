export interface DesktopSmokeChecklistState { auth: boolean; screenPreview: boolean; signaling: boolean; dataChannel: boolean; disconnect: boolean; }
export function desktopSmokeChecklistPassed(state: DesktopSmokeChecklistState): boolean { return state.auth && state.screenPreview && state.signaling && state.dataChannel && state.disconnect; }
