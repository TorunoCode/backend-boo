import './newUser.css'

export default function NewUser() {
  return (
    <div className="newUser">
        <h1 className="newUserTitle">New User</h1>
        <form action="" className="newUserForm">
            <div className="newUserItem">
                <label htmlFor="">UserName</label>
                <input type="text" placeholder='join' />
            </div>
            <div className="newUserItem">
                <label htmlFor="">Full Name</label>
                <input type="text" placeholder='join' />
            </div>
            <div className="newUserItem">
                <label htmlFor="">Email</label>
                <input type="text" placeholder='aa@gmail.com' />
            </div>
            <div className="newUserItem">
                <label htmlFor="">Password</label>
                <input type="text" placeholder='password' />
            </div>
            <div className="newUserItem">
                <label htmlFor="">Phone</label>
                <input type="text" placeholder='+84 123 122 12' />
            </div>
            <div className="newUserItem">
                <label htmlFor="">Address</label>
                <input type="text" placeholder='New York | USA' />
            </div>
            <div className="newUserItem">
                <label htmlFor="">Gender</label>
                <div className="newUserGender">
                <input type="radio" name="gender" id="male" value="male" />
                <label htmlFor="male">Male</label>
                <input type="radio" name="gender" id="female" value="female"/>
                <label htmlFor="female">Female</label>
                <input type="radio" name="gender" id="other" value="other"/>
                <label htmlFor="other">Other</label>
                </div>
            </div>
            <div className="newUserItem">
                <label htmlFor="">Active</label>
                <select name="active" id="active" className='newUserSelect'>
                    <option value="yes" >yes</option>
                    <option value="no" >no</option>
                </select>
            </div>
            <button className='newUserButton'>Create</button>
        </form>
    </div>
  )
}
