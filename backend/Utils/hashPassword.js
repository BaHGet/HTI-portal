const bcrypt = require('bcrypt');


exports. hashPassword = async (data) => {
  const salt = await bcrypt.Salt(10);
  const hashedpassword = await bcrypt.hash(data, salt)
  return hashedpassword;
};


exports. comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
