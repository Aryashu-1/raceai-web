/**
 * Feature Flags - Centralized control for new features
 *
 * To disable any feature: Set to false
 * To remove any feature: Set to false + delete associated files
 *
 * ZERO IMPACT on existing codebase - all features are opt-in
 */

export const FEATURE_FLAGS = {
  // Engagement Features
  NOTIFICATIONS: true,
  ACTIVITY_FEED: true,
  COMMAND_PALETTE: true,
  STREAK_TRACKER: true,

  // AI Features
  DAILY_DIGEST: true,
  QUICK_CAPTURE: true,
  TODAYS_FOCUS: true,

  // Future Features (disabled by default)
  REAL_TIME_COLLABORATION: false,
  LATEX_EDITOR: false,
  MOBILE_APP: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURE_FLAGS[feature] ?? false;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature as FeatureFlag);
}
