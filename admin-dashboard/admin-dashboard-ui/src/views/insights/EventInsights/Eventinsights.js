import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const EventInsightsDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState('event1');
  const [plotData, setPlotData] = useState(null);
  const [analysis, setAnalysis] = useState({
    sentiment: '',
    painpoints: '',
    areas_of_improvement: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const events = {
    event1: {
      name: "Harmony Music Festival",
      date: "October 21, 2024"
    },
    event2: {
      name: "AI & Data Science Workshop",
      date: "October 18, 2024"
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        // Fetch plot data
        const plotResponse = await fetch('http://localhost:8002/event-plot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId: selectedEvent }),
        });
        const plotJson = await plotResponse.json();
        setPlotData(plotJson);

        // Fetch sentiment analysis data
        const sentimentResponse = await fetch('http://localhost:8002/event-sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId: selectedEvent }),
        });
        const sentimentJson = await sentimentResponse.json();
        setAnalysis(sentimentJson);
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [selectedEvent]);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px'
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '32px'
  };

  const selectStyle = {
    width: '300px',
    padding: '8px',
    marginBottom: '32px',
    fontSize: '16px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px'
  };

  const listStyle = {
    listStyle: 'disc',
    paddingLeft: '20px'
  };

  const listItemStyle = {
    marginBottom: '8px'
  };

  const renderPlot = () => {
    if (!plotData) return null;
    const figureData = JSON.parse(plotData);
    return (
      <Plot
        data={figureData.data}
        layout={{
          ...figureData.layout,
          autosize: true,
          width: undefined,
          height: 400,
          margin: { t: 10, r: 10, l: 10, b: 10 }
        }}
        style={{ width: '100%', height: '400px' }}
        config={{ responsive: true }}
      />
    );
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        Analyze the Performance of Your Events
      </h1>

      <div style={{ textAlign: 'left', marginBottom: '24px' }}>
        <select 
          value={selectedEvent} 
          onChange={(e) => setSelectedEvent(e.target.value)}
          style={selectStyle}
        >
          {Object.entries(events).map(([id, event]) => (
            <option key={id} value={id}>
              {event.name} - {event.date}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading...
        </div>
      ) : (
        <>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Event Word Cloud</h2>
            <div style={{ width: '100%', height: '400px' }}>
              {renderPlot()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Sentiment Analysis & Pain Points</h2>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ ...sectionTitleStyle, fontSize: '18px' }}>Overall Sentiment</h3>
                <p>{analysis.sentiment}</p>
              </div>
              <div>
                <h3 style={{ ...sectionTitleStyle, fontSize: '18px' }}>Pain Points</h3>
                <ul style={listStyle}>
                  {analysis.painpoints.split('\n').map((point, index) => (
                    <li key={index} style={listItemStyle}>{point.replace('-', '')}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Areas of Improvement</h2>
              <ul style={listStyle}>
                {analysis.areas_of_improvement.split('\n').map((suggestion, index) => (
                  <li key={index} style={listItemStyle}>{suggestion.replace('-', '')}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventInsightsDashboard;