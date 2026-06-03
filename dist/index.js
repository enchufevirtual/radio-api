"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const enchufevirtual_1 = require("./enchufevirtual");
const error_handler_1 = require("./middlewares/error.handler");
const setupSocketIO_1 = require("./middlewares/setupSocketIO");
const upload_1 = require("./middlewares/upload");
const cors_2 = require("./middlewares/cors");
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_2.corsOptions));
// Web Sockets - socket.io
const server = http_1.default.createServer(app);
(0, setupSocketIO_1.setupSocketIO)(server);
//  If not exists folder public/upload / create
const uploadDirectory = path_1.default.join(__dirname, 'public/uploads');
if (!fs_1.default.existsSync(uploadDirectory)) {
    fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
}
// Dir Public
app.use(express_1.default.static(uploadDirectory));
// Upload File
app.use(upload_1.upload);
// Router Api Enchufe Virtual
(0, enchufevirtual_1.routerApi)(app);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res) => {
    res.status(400).send("400 - Enchufe Virtual - API - Bad Request");
});
// Errors
app.use(error_handler_1.boomErrorHandler);
app.use(error_handler_1.multerError);
app.use(error_handler_1.errorHandler);
// Server
const PORT = parseInt(process.env.PORT || '4000', 10);
server.listen(PORT, '0.0.0.0', () => {
    const url = `http://0.0.0.0:${PORT}`;
    console.log(`\x1b[31mListen in the port:\x1b[0m ${url}`);
});
//# sourceMappingURL=index.js.map