export interface CreateDeviceDto { name: string; type: "desktop" | "laptop" | "server" | "mobile" | "iot" | "raspberry_pi" | "android_tv"; os: string; ipAddress?: string; macAddress?: string; tags?: string[]; groupId?: string; }
export interface UpdateDeviceDto { name?: string; tags?: string[]; groupId?: string; status?: string; }
