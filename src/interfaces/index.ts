export interface TokenHelper {
  decodeToken(token: string): string | null;
  verifyToken(decodedToken: string): Promise<any | null>;
}

export interface CacheHelper {
  get(key: string): Promise<any | null>;
  set(key: string, value: any): Promise<void>;
}

export interface UserServiceHelper {
  renewRedisToken(data: any): Promise<any>;
}

export interface ResponseHelper {
  unauthorized(res: any, code: string, customError?: any): void;
  forbidden(res: any): void;
  serverError(res: any, error: any): void;
}
