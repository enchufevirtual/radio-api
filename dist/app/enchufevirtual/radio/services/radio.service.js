"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioService = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const axios_1 = __importDefault(require("axios"));
class RadioService {
    constructor() {
        this.ZENO_API_URL = 'https://zenoplay.zenomedia.com/api/zenofm/nowplaying';
        this.ZENO_STREAM_URL = 'https://stream.zeno.fm';
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY = 1000; // ms
        this.REQUEST_TIMEOUT = 5000; // ms
        const stationId = process.env.ZENO_STATION_ID || 'hnwgw0jr0gatv';
        const streamId = process.env.ZENO_STREAM_ID || 'hnwgw0jr0gatv';
        this.radio = {
            title: "Cargando...",
            streamUrl: `${this.ZENO_STREAM_URL}/${streamId}`
        };
    }
    fetchWithRetry(url, retries = this.MAX_RETRIES) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url, {
                    timeout: this.REQUEST_TIMEOUT,
                });
                return response.data;
            }
            catch (err) {
                if (retries > 0) {
                    yield new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
                    return this.fetchWithRetry(url, retries - 1);
                }
                throw err;
            }
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stationId = process.env.ZENO_STATION_ID || 'hnwgw0jr0gatv';
                const streamId = process.env.ZENO_STREAM_ID || 'hnwgw0jr0gatv';
                const nowPlayingUrl = `${this.ZENO_API_URL}/${stationId}`;
                const streamUrl = `${this.ZENO_STREAM_URL}/${streamId}`;
                // Validate that IDs match (for consistency)
                if (stationId !== streamId) {
                    console.warn(`⚠️ Warning: ZENO_STATION_ID (${stationId}) and ZENO_STREAM_ID (${streamId}) don't match`);
                }
                try {
                    const data = yield this.fetchWithRetry(nowPlayingUrl);
                    this.radio = {
                        title: data.title || "Sin información",
                        streamUrl
                    };
                }
                catch (apiError) {
                    // If API fails but we have stream URL, return partial data
                    console.error('Error fetching from Zeno API:', apiError);
                    this.radio = {
                        title: "En vivo",
                        streamUrl
                    };
                }
                return this.radio;
            }
            catch (err) {
                const axiosError = err;
                const errorMsg = axiosError.message || 'Error desconocido';
                throw boom_1.default.badGateway(`Error al obtener la información de la radio: ${errorMsg}`);
            }
        });
    }
}
exports.RadioService = RadioService;
//# sourceMappingURL=radio.service.js.map