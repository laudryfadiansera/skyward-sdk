import { randomBytes } from "crypto";
import type { CommonResponseDTO, ValidationError, JoiValidationErrorItem, LogoutNote } from "../types";

/**
 * Konstanta untuk Logout Notes
 * Sesuaikan dengan kebutuhan aplikasi Anda
 */
export const LOGOUT_NOTES: Record<string, LogoutNote> = {
  SESSION_EXPIRED: {
    ID: "SESSION_EXPIRED",
    message: "Session has expired",
  },
  USER_LOGOUT: {
    ID: "USER_LOGOUT",
    message: "User logged out",
  },
  FORCED_LOGOUT: {
    ID: "FORCED_LOGOUT",
    message: "User was forced to logout",
  },
  // Tambahkan logout notes lainnya sesuai kebutuhan
};

/**
 * Generate response dengan format CommonResponseDTO
 * @param code - Response code
 * @param message - Response message
 * @param httpCode - HTTP status code
 * @param data - Response data (optional)
 * @returns CommonResponseDTO object
 */
export function generateResponse(code: string, message: string, httpCode: number, data?: any): CommonResponseDTO {
  return {
    data: data || {},
    code,
    message,
    httpCode,
    eTag: generateETag(),
  };
}

/**
 * Generate ETag untuk response caching
 * @returns Random hex string sebagai ETag
 */
export function generateETag(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Check logout reason berdasarkan notes logout ID
 * @param notesLogoutId - ID dari logout notes
 * @returns Logout note object atau null jika tidak ditemukan
 */
export function checkLogoutReason(notesLogoutId: string): LogoutNote | null {
  const noteIds = Object.keys(LOGOUT_NOTES);
  const logoutNotes = LOGOUT_NOTES as any;
  const reason = noteIds.find((noteId: any) => logoutNotes[noteId].ID === notesLogoutId);
  return reason ? logoutNotes[reason] : null;
}

/**
 * Format Joi validation errors menjadi array yang lebih readable
 * @param errors - Array dari Joi validation error items
 * @returns Array of formatted validation errors
 */
export function joiValidationErrorFormatter(errors: JoiValidationErrorItem[]): ValidationError[] {
  return errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
}

/**
 * Parsing message dengan mengganti placeholder field
 * @param message - Message template dengan placeholder _field_
 * @param field - Field name untuk mengganti placeholder
 * @returns Parsed message
 */
export function parsingMessage(message: string, field: string): string {
  return message.replace("_field_", field);
}
