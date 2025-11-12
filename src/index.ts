/**
 * SkywardSDK - A comprehensive TypeScript SDK
 * @packageDocumentation
 */

// ============================================
// Versi SDK
// ============================================
export const VERSION = "1.0.0";

// ============================================
// Named Exports - Untuk tree-shaking optimal
// ============================================

// General utilities
export * from "./utils";

// Types
export * from "./types";

// ============================================
// Namespace Exports - Untuk grouping (optional)
// ============================================
import * as Utils from "./utils";

export { Utils };
