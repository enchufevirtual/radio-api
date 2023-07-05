import boom from "@hapi/boom";
import axios from "axios";

type RadioTypes = { title: string } 

class RadioService {

  private radio: RadioTypes;

  constructor () {
    this.radio = { title: "" };
  }
  
  async find() {

    try {
      const response = await axios('https://zenoplay.zenomedia.com/api/zenofm/nowplaying/hnwgw0jr0gatv');
      this.radio = { title: response.data.title };
      return this.radio;
    } catch (err) {
      throw boom.notFound('Error al obtener la mùsica actual');
    }
  }

}

export { RadioService };