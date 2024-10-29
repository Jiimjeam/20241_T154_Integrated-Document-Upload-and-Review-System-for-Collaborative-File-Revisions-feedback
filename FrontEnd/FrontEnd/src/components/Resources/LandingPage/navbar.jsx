import './navbar.css'
const Navbar = () => {
    return (
      <div className='navbar'>
        <ul>
          <li title='About the Website'  className='about'><a href="#1">About</a></li>
          <li title='Enter your account' className='Login'><a href="#">Login</a></li>
          <li title='Make your account'  className='Register'><a href="#">Register</a></li>
        </ul>
      </div>
    );
  };
  
  export default Navbar;
  