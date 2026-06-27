import path from "path";
export const sanitizePath = (filePath: string): string => path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");
export const getFileName = (filePath: string): string => path.basename(filePath);
export const getExtensionFromPath = (filePath: string): string => path.extname(filePath);
export const joinPaths = (...paths: string[]): string => path.join(...paths);
export const isAbsolute = (filePath: string): boolean => path.isAbsolute(filePath);
