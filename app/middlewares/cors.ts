import { CorsOptions } from "cors";

const whiteList = [process.env.FRONTEND_URL];

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin && whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST',],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
};
