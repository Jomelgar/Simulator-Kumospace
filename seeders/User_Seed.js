const user = require("../models/user");
const bcrypt = require("bcryptjs");

const seedUsers = async () => {
  const usersData = [
    {
      user_name: "Usuario1",
      password: "password123",
      email: "tu@example.com",
      first_name: "Tu",
      last_name: "Usuario",
      imageURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
      status: "online",
      currentLocation: 1,
      locationType: "private",
    },
    {
      user_name: "Admin",
      password: "adminpass",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
      imageURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      status: "online",
      currentLocation: 1,
      locationType: "private",
    },
  ];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await user.create({ ...userData, password: hashedPassword });
  }
};

module.exports = seedUsers;
