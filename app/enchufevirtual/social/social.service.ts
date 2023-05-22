
import { SocialModel } from "types/types";
import { sequelize } from "../../libs/sequelize";

class SocialService {

  private social;

  constructor () {
    this.social = sequelize.models.Social;
  }
  async update(userId: number, socialData: SocialModel) {
    const [socialObj, created] = await this.social.findOrCreate({
      where: { userId },
      defaults: { userId }
    });
    if (!created) {
      await socialObj.update(socialData);
    } else if (socialData) {
      await socialObj.update(socialData);
    }
    return socialObj;
  }
}

export { SocialService };




