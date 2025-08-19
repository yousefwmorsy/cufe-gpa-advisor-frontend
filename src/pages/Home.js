import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Welcome to Advanced GPA Advisor</h2>
      <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        <div style={{ background: '#23263A', color: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #C71585', padding: 24, width: 220 }}>
          <h3>Step 1: Upload Transcript</h3>
          <p>Import your PDF transcript and review your grades.</p>
        </div>
        <div style={{ background: '#23263A', color: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #C71585', padding: 24, width: 220 }}>
          <h3>Step 2: Explore Insights</h3>
          <p>See your GPA trends, best/worst courses, and more.</p>
        </div>
        <div style={{ background: '#23263A', color: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #C71585', padding: 24, width: 220 }}>
          <h3>Step 3: Simulate GPA</h3>
          <p>Plan future terms and see if you can reach your target GPA.</p>
        </div>
        <div style={{ background: '#23263A', color: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #C71585', padding: 24, width: 220 }}>
          <h3>Step 4: Ask the AI Advisor</h3>
          <p>Get personalized advice and save your conversations.</p>
        </div>
      </div>
    </div>
  );
}
