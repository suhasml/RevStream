import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('last_week'); // Default to 'last_week'
  const [charts, setCharts] = useState({});
  const [reviewSummary, setReviewSummary] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // Fetch charts and review analysis based on selected time range
  useEffect(() => {
    // Fetch chart data
    axios.post('http://localhost:8000/generate-charts', { time_range: timeRange })
      .then((response) => {
        // Parse each chart data (assuming chart_1, chart_2, etc.)
        const parsedCharts = Object.keys(response.data).reduce((acc, chartKey) => {
          acc[chartKey] = JSON.parse(response.data[chartKey]);
          return acc;
        }, {});
        setCharts(parsedCharts);
      })
      .catch((error) => console.error(error));

    // Fetch review analysis data
    axios.post('http://localhost:8000/review-analysis', { time_range: timeRange })
      .then((response) => {
        setReviewSummary(response.data.review);
        setPainPoints(response.data.painpoints);
        setSuggestions(response.data.areas_of_improvement);
      })
      .catch((error) => console.error(error));
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

      {/* Display 4 charts in a single row */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.keys(charts).map((chartKey, index) => (
          <Plot
            key={index}
            data={charts[chartKey].data}  // Extract data
            layout={charts[chartKey].layout}  // Extract layout
            style={{ width: '45%', height: '400px' }}  // Set width and height
          />
        ))}
      </div>

      {/* Divider line */}
      <hr style={{ margin: '40px 0' }} />

      {/* Review summary, pain points, and suggestions layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Review summary and pain points as two rows in the left column */}
        <div style={{ width: '60%' }}>
          <h3>Review Summary</h3>
          <p>{reviewSummary}</p>
          
          <hr />
          
          <h3>Pain Points</h3>
          <ul>
            {painPoints.split('\n').map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Suggestions displayed on the right side */}
        <div style={{ width: '35%' }}>
          <h3>Suggestions</h3>
          <ul>
            {suggestions.split('\n').map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
