import bcrypt from 'bcryptjs'
export const users = [
    {
        name:"admin",
        email:"admin@gmail.com",
        password: bcrypt.hashSync("1234",10),
        isAdmin: true,
        isActive:1
    },
    {
        name:"User",
        email:"user@gmail.com",
        password: bcrypt.hashSync("1234",10),
        isAdmin: false,
        isActive:1
    }
  ];
  export default users;
  