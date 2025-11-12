import { Request, Response, NextFunction } from "express";
import { IAuthDeps } from "../interfaces";

export class AuthProvider {
  constructor(private deps: IAuthDeps) {}

  checkToken = async (req: Request, res: Response, next: NextFunction) => {
    const { ERROR, HTTP_CODE, STATUS_CODE } = this.deps.constants;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return this.unauthorized(res, STATUS_CODE.AUTH.FAILED_DECODE_TOKEN);

      // 1. decode
      const decoded = this.deps.decodeToken(token, this.deps.vault.TOKEN_ENCODING_KEY);
      if (!decoded) return this.unauthorized(res, STATUS_CODE.AUTH.FAILED_DECODE_TOKEN);

      // 2. verify jwt
      let verified;
      try {
        verified = await this.deps.jwtVerify(decoded, this.deps.vault.JWT_SECRET, this.deps.vault.JWT_ALGORITHM);
      } catch (error: any) {
        return this.handleJwtError(error, res);
      }

      // 3. get redis
      let userRedis = await this.deps.redisGet(verified.id);

      // if expired → renew via grpc
      if (!userRedis) {
        const grpcRes = await this.deps.grpcRenewToken(verified);

        if (grpcRes.status === 0) {
          return this.unauthorized(res, grpcRes.code);
        }

        userRedis = await this.deps.redisGet(verified.id);
      }

      // 4. validate token match
      if (userRedis?.accessToken !== token) {
        const reason = this.deps.logoutReasonChecker(userRedis?.notesLogoutId);
        const result = reason
          ? this.deps.helper.generateResponse(0, reason.CODE, reason.MESSAGE, HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED)
          : this.deps.helper.generateResponse(0, STATUS_CODE.AUTH.INVALID_TOKEN, ERROR.CLIENT_ERROR.UNAUTHORIZED, HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED);

        const http = result.httpCode;
        delete result.httpCode;
        return res.status(http).json(result);
      }

      // 5. inject data
      req.headers.userData = userRedis.data;
      req.headers.notesLogoutId = userRedis.notesLogoutId;
      req.headers.businessAreaIds = (userRedis.data?.businessArea || []).map((x: any) => x.businessAreaId);

      next();
    } catch (err) {
      return this.handleServerError(err, res);
    }
  };

  /** CHECK ACCESS */
  checkAccess = (menus: Array<{ menuName: string; action: string }>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const userData: any = req.headers.userData;
        const accessMenu = userData?.roleMenu?.data || [];

        const can = menus.some((m) => this.hasAccess(accessMenu, m.menuName, m.action));

        if (!can) return this.forbidden(res);

        next();
      } catch (err) {
        this.deps.glitchTip.logError(err);
        const { ERROR, HTTP_CODE, STATUS_CODE } = this.deps.constants;

        const result = this.deps.helper.generateResponse(
          0,
          STATUS_CODE.AUTH.INTERNAL_SERVER_ERROR,
          ERROR.SERVER_ERROR.INTERNAL_SERVER_ERROR,
          HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR,
        );

        const http = result.httpCode;
        delete result.httpCode;
        res.status(http).json(result);
      }
    };
  };

  private hasAccess(menuList: any[], targetMenuName: string, action: string): boolean {
    for (const menu of menuList) {
      if (this.checkMenu(menu, targetMenuName, action)) return true;
    }
    return false;
  }

  private checkMenu(menu: any, name: string, action: string): boolean {
    if (menu?.menuName === name && menu?.data?.[action]) return true;

    if (Array.isArray(menu.child)) {
      return menu.child.some((child: any) => this.checkMenu(child, name, action));
    }

    return false;
  }

  /** Shared responses */
  private unauthorized(res: Response, code: string) {
    const { ERROR, HTTP_CODE } = this.deps.constants;
    const result = this.deps.helper.generateResponse(0, code, ERROR.CLIENT_ERROR.UNAUTHORIZED, HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED);
    const http = result.httpCode;
    delete result.httpCode;
    return res.status(http).json(result);
  }

  private forbidden(res: Response) {
    const { ERROR, HTTP_CODE, STATUS_CODE } = this.deps.constants;
    const result = this.deps.helper.generateResponse(0, STATUS_CODE.AUTH.FORBIDDEN, ERROR.CLIENT_ERROR.FORBIDDEN, HTTP_CODE.CLIENT_ERROR.FORBIDDEN);
    const http = result.httpCode;
    delete result.httpCode;
    return res.status(http).json(result);
  }

  private handleJwtError(error: any, res: Response) {
    const { STATUS_CODE } = this.deps.constants;
    let code = STATUS_CODE.AUTH.INVALID_TOKEN;

    if (error?.name === "TokenExpiredError") code = STATUS_CODE.AUTH.EXPIRED_TOKEN;

    return this.unauthorized(res, code);
  }

  private handleServerError(error: any, res: Response) {
    this.deps.glitchTip.logError(error);
    const { ERROR, HTTP_CODE, STATUS_CODE } = this.deps.constants;

    const result = this.deps.helper.generateResponse(
      0,
      STATUS_CODE.AUTH.INTERNAL_SERVER_ERROR,
      ERROR.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    );
    const http = result.httpCode;
    delete result.httpCode;
    res.status(http).json(result);
  }
}
