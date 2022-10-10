import bcrypt from 'bcryptjs';
const users = [
    {
        name:"User",
        email:"user@gmail.com",
        password: bcrypt.hashSync("1234",10),
        isAdmin: false,
        isActive:1,
        pin:"123"
    },
    {
        name:"admin",
        email:"admin@gmail.com",
        password: bcrypt.hashSync("12345",10),
        isAdmin: true,
        isActive:1,
        pin:"312"
    },
    
  ];
  export default users;
  