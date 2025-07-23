import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';

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
    title: 'Collection and Packaging',
    text: (
      <div>
        <p>If available, static-free evidence bags are best for the storage of media.</p>
        <p>Work with crime scene service technicians or trained forensic personnel to preserve forensic evidence (fingerprints, biological samples, DNA, etc.) without disturbing the integrity of the device.</p>
      </div>
    )
  },
  {
    title: 'Transport',
    text: (
      <div>
        <p>Deliver evidence to a secure law enforcement facility or digital evidence laboratory as soon as possible.</p>
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
    navigate('/collectevidence'); // Replace with your actual route
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