import { useState, useEffect } from 'react';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
}

class FeatureFlags {
  private static instance: FeatureFlags;
  private flags: Map<string, FeatureFlag> = new Map();

  private constructor() {
    // Initialize with default flags
    this.flags.set('darkMode', { name: 'darkMode', enabled: true, description: 'Enable dark mode' });
    this.flags.set('analytics', { name: 'analytics', enabled: true, description: 'Enable analytics tracking' });
    this.flags.set('previewMode', { name: 'previewMode', enabled: true, description: 'Enable content preview mode' });
  }

  public static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) {
      FeatureFlags.instance = new FeatureFlags();
    }
    return FeatureFlags.instance;
  }

  public isEnabled(flagName: string): boolean {
    return this.flags.get(flagName)?.enabled ?? false;
  }

  public getFlag(flagName: string): FeatureFlag | undefined {
    return this.flags.get(flagName);
  }

  public setFlag(flagName: string, enabled: boolean): void {
    const flag = this.flags.get(flagName);
    if (flag) {
      this.flags.set(flagName, { ...flag, enabled });
    }
  }

  public getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
}

export const useFeatureFlag = (flagName: string): boolean => {
  const [enabled, setEnabled] = useState(false);
  const featureFlags = FeatureFlags.getInstance();

  useEffect(() => {
    setEnabled(featureFlags.isEnabled(flagName));
  }, [flagName]);

  return enabled;
};

export default FeatureFlags; 