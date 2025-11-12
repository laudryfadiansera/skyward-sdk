import { Request, Response, NextFunction } from "express";
import { CacheHelper, ResponseHelper, TokenHelper, UserServiceHelper } from "../interfaces";

export function createAuthMiddleware(tokenHelper: TokenHelper, cache: CacheHelper, userService: UserServiceHelper, response: ResponseHelper) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawToken = req.headers.authorization?.split(" ")[1];
      if (!rawToken) return response.unauthorized(res, "FAILED_DECODE_TOKEN");

      const decoded = tokenHelper.decodeToken(rawToken);
      if (!decoded) return response.unauthorized(res, "FAILED_DECODE_TOKEN");

      const verified = await tokenHelper.verifyToken(decoded);
      if (!verified) return; // response helper sudah tangani error

      let redisData = await cache.get(verified.id);

      if (!redisData) {
        const renew = await userService.renewRedisToken(verified);
        if (renew.status === 0) return response.unauthorized(res, renew.code);

        redisData = await cache.get(verified.id);
      }

      // cek kecocokan token
      if (redisData.accessToken !== rawToken) {
        return response.unauthorized(res, "INVALID_TOKEN");
      }

      // set req attributes
      req.headers.userData = redisData.data;
      req.headers.notesLogoutId = redisData.notesLogoutId;
      req.headers.businessAreaIds = (redisData.data?.businessArea ?? []).map((x: any) => x.businessAreaId);

      next();
    } catch (err) {
      response.serverError(res, err);
    }
  };
}
