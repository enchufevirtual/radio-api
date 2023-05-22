import { CorsOptions } from "types/types";

const whiteList = [process.env.FRONTEND_URL];

export const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    if (origin && whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  }
}