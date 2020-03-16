import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.jpg';
import './Logo.css';

const Logo = () => {
 return(
   <div className='ma4 mt0'>
	<Tilt className="Tilt br2 shadow-2" options={{ max : 60 }} style={{ height: 200, width: 350 }} >
     <div className="Tilt-inner"> 
       <img alt='logo' src={brain}/> 
     </div>
    </Tilt>
   </div>)
}

export default Logo;