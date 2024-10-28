import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('last_week'); // Default to 'last_week'
  const [charts, setCharts] = useState({});
  const [reviewSummary, setReviewSummary] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch charts and review analysis based on selected time range
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch chart data
        const chartResponse = await axios.post('https://revstream-461943786929.us-central1.run.app/generate-charts', { time_range: timeRange });
        const parsedCharts = Object.keys(chartResponse.data).reduce((acc, chartKey) => {
          acc[chartKey] = JSON.parse(chartResponse.data[chartKey]);
          return acc;
        }, {});
        setCharts(parsedCharts);

        // Fetch review analysis data
        const analysisResponse = await axios.post('https://revstream-461943786929.us-central1.run.app/reviews-analysis', { time_range: timeRange });
        setReviewSummary(analysisResponse.data.review);
        setPainPoints(analysisResponse.data.painpoints);
        setSuggestions(analysisResponse.data.areas_of_improvement);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div>
      {/* Dropdown to select time range */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="last_3_months">Last 3 Months</option>
        </select>
      </div>

      {/* Loading screen */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ color: 'white', fontSize: '24px' }}>Loading...</div>
        </div>
      )}

      {/* Display 4 charts in a single row */}
      {!isLoading && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {Object.keys(charts).map((chartKey, index) => (
            <Plot
              key={index}
              data={charts[chartKey].data}
              layout={charts[chartKey].layout}
              style={{ width: '45%', height: '400px' }}
            />
          ))}
        </div>
      )}

      {/* Divider line */}
      <hr style={{ margin: '40px 0' }} />

      {/* Review summary, pain points, and suggestions layout */}
      {!isLoading && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Review summary and pain points as two rows in the left column */}
          <div style={{ width: '60%' }}>
            <h3>Review Summary</h3>
            <p>{reviewSummary}</p>

            <hr />

            <h3>Pain Points</h3>
            <ul>
              {painPoints.split('\n').map((point, index) => (
                <li key={index}>{point.replace('-', '')}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions displayed on the right side */}
          <div style={{ width: '35%' }}>
            <h3>Suggestions</h3>
            <ul>
              {suggestions.split('\n').map((suggestion, index) => (
                <li key={index}>{suggestion.replace('-', '')}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;