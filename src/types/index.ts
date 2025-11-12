/**
 * Interface untuk Common Response DTO
 */
export interface CommonResponseDTO {
  data: any;
  code: string;
  message: string;
  httpCode: number;
  eTag: string;
}

/**
 * Interface untuk Validation Error
 */
export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Interface untuk Joi Validation Error Item
 */
export interface JoiValidationErrorItem {
  path: (string | number)[];
  message: string;
  type?: string;
  context?: any;
}

/**
 * Interface untuk Logout Note
 */
export interface LogoutNote {
  ID: string;
  message?: string;
  [key: string]: any;
}
