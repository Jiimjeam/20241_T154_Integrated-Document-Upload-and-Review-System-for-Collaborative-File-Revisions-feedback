import { Link } from 'react-router-dom';
import './navbar.css'
const Navbar = () => {
    return (
      <div className='navbar'>
        <ul>
          <li title='About the Website'  className='about'><a href="#1">About</a></li>
          <li title='Enter your account' className='Register'><Link to="/signup">Register</Link></li>
          <li title='Make your account'  className='Login'><Link to="/login">Login</Link></li>
        </ul>
      </div>
    );
  };
  
  export default Navbar;
  