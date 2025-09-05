import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1rem',
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
    text: <p>(Do not take any action that could change the state of the device.)</p>
  },
  {
    title: 'If the Device Is On, Proceed with Caution',
    text: (
      <ul>
        <li>Do not type, click the mouse, or explore files or directories without expert consultation.</li>
        <li>Ask about passwords and/or encryption of the system.</li>
        <li>Observe the screen for open programs, files, or indications of encryption.</li>
        <li>If concerned, consult an expert and photograph the screen.</li>
      </ul>
    )
  },
  {
    title: 'Power Down the System',
    text: (
      <ul>
        <li>Pull the plug from the back of the computer system.</li>
        <li>Remove the battery from a laptop system.</li>
      </ul>
    )
  },
  {
    title: 'Collection and Packaging',
    text: (
      <ul>
        <li>Preserve forensic evidence with trained personnel.</li>
        <li>Photograph the system from all perspectives.</li>
        <li>Mark and document all items clearly.</li>
        <li>Disconnect and secure cables.</li>
        <li>Check ports and trays for removable media.</li>
        <li>Package with laptop bags, boxes, or evidence bags.</li>
      </ul>
    )
  },
  {
    title: 'Transport',
    text: (
      <ul>
        <li>Deliver to a secure law enforcement or forensic facility promptly.</li>
        <li>Protect the device from heat, cold, and moisture.</li>
        <li>Package to prevent physical damage.</li>
      </ul>
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
    window.close();
  };

  return (
    <div {...handlers} style={cardStyle}>
      <div style={cardContentStyle}>
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>{`${index + 1}/${cards.length}`}</div>
        <h2>{cards[index].title}</h2>
        <div>{cards[index].text}</div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
        >
          ◀️ Previous
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          onClick={() => setIndex((i) => Math.min(i + 1, cards.length - 1))}
          disabled={index === cards.length - 1}
        >
          Next ▶️
        </button>
      </div>

      <button style={buttonStyle} onClick={handleDone}>Done</button>
    </div>
  );
};

export default SwipeableCards;
