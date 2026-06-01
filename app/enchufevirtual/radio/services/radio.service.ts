import boom from "@hapi/boom";
import axios, { AxiosError } from "axios";

type RadioTypes = { 
  title: string;
  streamUrl: string;
}

class RadioService {

  private radio: RadioTypes;
  private readonly ZENO_API_URL = 'https://zenoplay.zenomedia.com/api/zenofm/nowplaying';
  private readonly ZENO_STREAM_URL = 'https://stream.zeno.fm';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // ms
  private readonly REQUEST_TIMEOUT = 5000; // ms

  constructor () {
    const stationId = process.env.ZENO_STATION_ID || 'hnwgw0jr0gatv';
    const streamId = process.env.ZENO_STREAM_ID || 'hnwgw0jr0gatv';
    
    this.radio = { 
      title: "Cargando...",
      streamUrl: `${this.ZENO_STREAM_URL}/${streamId}`
    };
  }
  
  private async fetchWithRetry<T>(
    url: string,
    retries: number = this.MAX_RETRIES
  ): Promise<T> {
    try {
      const response = await axios.get<T>(url, {
        timeout: this.REQUEST_TIMEOUT,
      });
      return response.data;
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.fetchWithRetry<T>(url, retries - 1);
      }
      throw err;
    }
  }
  
  async find(): Promise<RadioTypes> {
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
        const data = await this.fetchWithRetry<{ title: string }>(nowPlayingUrl);
        this.radio = {
          title: data.title || "Sin información",
          streamUrl
        };
      } catch (apiError) {
        // If API fails but we have stream URL, return partial data
        console.error('Error fetching from Zeno API:', apiError);
        this.radio = {
          title: "En vivo",
          streamUrl
        };
      }
      
      return this.radio;
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMsg = axiosError.message || 'Error desconocido';
      throw boom.badGateway(`Error al obtener la información de la radio: ${errorMsg}`);
    }
  }

}

export { RadioService };