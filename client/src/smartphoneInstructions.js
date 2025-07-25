import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';

import airplaneModeImage from './assets/airplaneMode.png'; 
import smartphoneInBagWithChargerImage from './assets/smartphoneInBagWithCharger.png'; 

const cardStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.25rem',
  backgroundColor: '#f0f0f0',
  padding: '2rem',
  boxSizing: 'border-box',
  flexDirection: 'column'
};

const cardContentStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  width: '80%',
  maxWidth: '600px',
  textAlign: 'left'
};

const buttonStyle = {
  marginTop: '1.5rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: '#007BFF',
  color: '#fff',
  cursor: 'pointer'
};

const cards = [
  {
    title: 'Document Device and Procedures',
    text: (
      <ul>
        <li>Photograph</li>
        <li>Video</li>
        <li>Sketch</li>
        <li>Notes</li>
        <li>Chain of custody</li>
      </ul>
    )
  },
  {
    title: 'Determine if the Device is On or Off',
    text: (
      <ul>
        <li>Look for lights</li>
        <li>Listen for sounds</li>
        <li>Feel for vibrations or heat</li>
        <li>Ask if the device is currently powered on.</li>
        <li>Where legal, pressing the home button quickly will activate the screen.</li>
      </ul>
    )
  },
  {
    title: 'If the Device Is Off, Do Not Turn It On',
    text: <p>(No additional action should be taken that could modify the device’s state.)</p>
  },
  {
    title: 'If the Device Is On, Proceed with Caution',
    text: (
      <div>
        <p>If possible, obtain security passwords or pass patterns for the device.</p>
        <p>Avoid turning the device off, as this could result in the loss of evidence.</p>
        <p>If possible, connect device to a charger to keep it powered</p>
        <p>Keep it unlocked</p>
        <p>Place it in airplane mode until it is in the hands of an experienced technician.</p>
        <img
          src={airplaneModeImage}
          alt="Description of image"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    )
  },
  {
    title: 'Collection and Packaging',
    text: (
      <div>
        <p>If available, Faraday evidence bags or else static-free evidence bags are best for the storage of mobile devices.</p>
        <img
          src={smartphoneInBagWithChargerImage}
          alt="Description of image"
          style={{ width: '100%', height: 'auto' }}
        />
        <p>Work with crime scene service technicians or trained forensic personnel to preserve forensic evidence (fingerprints, biological samples, DNA, etc.) without disturbing the integrity of the device.</p>
      </div>
    )
  },
  {
    title: 'Transport',
    text: (
      <div>
        <p>Deliver evidence to a secure law enforcement facility or digital evidence laboratory as soon as possible.</p>
        <p>This is especially important for mobile devices, where even a short delay can make it challenging and slow to collect digital forensic evidence.</p>
        <p>Protect the device from temperature extremes and moisture.</p>
        <p>Package evidence so it will not be physically damaged or deformed.</p>
      </div>
    )
  }
];

const SwipeableCards = () => {
  const [index, setIndex] = React.useState(0);
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex(prev => Math.min(prev + 1, cards.length - 1)),
    onSwipedRight: () => setIndex(prev => Math.max(prev - 1, 0)),
    trackMouse: true
  });

  const handleDone = () => {
    /*navigate('/collectevidence');*/
	navigate(-1);
  };

  return (
    <div {...handlers} style={cardStyle}>
      <div style={cardContentStyle}>
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>{`${index + 1}/${cards.length}`}</div>
        <h2>{cards[index].title}</h2>
        <div>{cards[index].text}</div>
      </div>
      <button style={buttonStyle} onClick={handleDone}>Done</button>
    </div>
  );
};

export default SwipeableCards;