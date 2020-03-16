import React from 'react';
import './FaceRecognition.css';

const renderDivs = (box) => {
  	return box.map((box) => {
  		return (
  			<div className='bounding-box' style= {{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}> </div>
  		)
  	})
  };


const FaceRecognition = ({ imageUrl, box }) => {
  	
 return(
 	<div className='center ma'>
 	 <div className='absolute mt2'>
 	  <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
 	  {
 	  	renderDivs(box)
 	  }
 	  
 	 </div>
 	</div>
  );
}

export default FaceRecognition;
