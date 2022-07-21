import { RequestHandler } from "express-serve-static-core";

/** 
 * Logs requests/responses
 */
const logger = (): RequestHandler => (req, res, next) => {
  console.log(`Incoming request for ${req.path}, from ${req.ip}`);

  var send = res.send;
  //@ts-ignore
  res.send = function (v) {
    if (typeof v === "string")
      console.log(
        `Answering with: ` + v.substring(0, 100) + (v.length > 100 ? "..." : "")
      );
    //@ts-ignore
    send.apply(res, arguments);
  };

  next();
};

export default logger;
