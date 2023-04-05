const { sequelize } = require('../../../libs/sequelize.js')

class UserService {


  constructor () {

  }
  async find() {
    const users = await sequelize.models.User.findAll({
      include: ['social']
    })
    return users;
  }

  async findOne() {

  }

  async create(data: any) {
    const newUser = await sequelize.models.User.create(data, {
      include: ['social']
    })
    return newUser;
  }

  async update() {

  }

  async delete() {


  }

}

export { UserService };