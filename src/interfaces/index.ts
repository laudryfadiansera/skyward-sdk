import jwt from "jsonwebtoken";

export interface IAuthDeps {
  redisGet(key: string): Promise<any>;
  grpcRenewToken(payload: any): Promise<any>;
  decodeToken(encoded: string, key: string): string | null;
  jwtVerify(token: string, secret: string, algorithm: jwt.Algorithm): Promise<any>;
  logoutReasonChecker(notesLogoutId: string): { CODE: string; MESSAGE: string } | null;

  vault: {
    TOKEN_ENCODING_KEY: string;
    JWT_SECRET: string;
    JWT_ALGORITHM: jwt.Algorithm;
  };

  helper: {
    generateResponse(success: number, code: string, message: string, httpCode: number, customError?: any): any;
  };

  constants: {
    ERROR: any;
    HTTP_CODE: any;
    STATUS_CODE: any;
  };

  glitchTip: {
    logError(err: any): void;
  };
}
