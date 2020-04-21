import React from 'react';
import './logo.css';
import Tilt from 'react-tilt';
import face from './face.png';
 

const Logo = () => {
	return(
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 250, width: 250 }} >
 			<div className="Tilt-inner pa3">
 				<img style={{paddingTop: '70px'}} alt='logo' src={face}/> </div>
			</Tilt>
		</div>
	);
}

export default Logo;