export interface DesktopUpdateReadiness { installerSigned:boolean; channelAllowed:boolean; rollbackAvailable:boolean; }
export function desktopUpdateReady(i:DesktopUpdateReadiness): boolean { return i.installerSigned && i.channelAllowed && i.rollbackAvailable; }
