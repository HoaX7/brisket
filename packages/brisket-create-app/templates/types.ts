import { PackageManager } from "../helpers/index";

export type TemplateType = "default";
export type TemplateMode = "ts" | "js";

export interface InstallTemplateProps {
    appName: string;
    root: string;
    packageManager: PackageManager;
    skipInstall: boolean;
    template: TemplateType;
    mode: TemplateMode;
    isOnline: boolean;
}