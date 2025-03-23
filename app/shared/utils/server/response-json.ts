enum ResCode {
  success,
  fail,
}

enum ResMessage {
  success = "success",
  fail = "fail",
}

enum InnerMessage {
  PresentationMode = "Demo mode: Only obtainable",
  UnAuth = "Unauthorized",
  Unsupport = "Not supported yet",
}

export class Rps {
  /**
   * Response to JSON successfully
   * @param data
   * @param message
   * @returns
   */
  rsj(data: any, message?: string, options?: any) {
    return new Response(
      JSON.stringify({
        code: ResCode.success,
        message: message ?? ResMessage.success,
        data,
      }),
      options,
    );
  }

  /**
   * Response to JSON failed
   * @param data
   * @param message
   * @param options
   * @returns
   */ rfj(data?: any, message?: string, options?: any) {
    return new Response(
      JSON.stringify({
        code: ResCode.fail,
        message: message ?? ResMessage.fail,
        data: data ?? null,
      }),
    );
  }
}

export const rps = new Rps();

/**
 * Response JSON successful
 * @param data
 * @param message
 * @returns
 */
export const rsj = (data: any, message?: string, options?: any) => {
  return new Response(
    JSON.stringify({
      code: ResCode.success,
      message: message ?? ResMessage.success,
      data,
    }),
    options,
  );
};

/**
 * Failed to respond to JSON
 * @param data
 * @param message
 * @param options
 * @returns */
export const rfj = (data?: any, message?: string, options?: any) => {
  return new Response(
    JSON.stringify({
      code: ResCode.fail,
      message: message ?? ResMessage.fail,
      data: data ?? null,
    }),
  );
};

/**
 * Responsive style mode
 * @returns
 */
export const respPresentationModeJson = () => {
  return Response.json({
    code: ResCode.fail,
    message: InnerMessage.PresentationMode,
    data: {},
  });
};

/**
 * Response is not authorized
 * @returns
 */
export const respUnAuthJson = () => {
  return Response.json({
    code: ResCode.fail,
    message: InnerMessage.UnAuth,
    data: {},
  });
};

/**
 * Response is not supported
 * @returns
 */
export const respUnSupportJson = () => {
  return Response.json({
    code: ResCode.fail,
    message: InnerMessage.Unsupport,
    data: {},
  });
};

export const HigherOrderCreateRespWithTime =
  (data: any, startTimeStamp?: number, code?: boolean, message?: string) =>
  () => {
    const idata: any = {
      code: code ?? 0,
      data,
      message: message ?? "success",
    };
    if (startTimeStamp) {
      data.time = Date.now() - startTimeStamp;
    }
    return idata;
  };
