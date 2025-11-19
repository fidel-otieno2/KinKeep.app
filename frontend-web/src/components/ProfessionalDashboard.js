import React, { useState, useEffect } from 'react';

const ProfessionalDashboard = ({ user }) => {
  const [analytics, setAnalytics] = useState({
    reach: 0,
    engagement: 0,
    followers: 0,
    posts: 0
  });

  useEffect(() => {
    // Mock analytics data
    setAnalytics({
      reach: 1250,
      engagement: 8.5,
      followers: 342,
      posts: 28
    });
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Professional Dashboard</h3>
      
      {/* Analytics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{analytics.reach}</div>
          <div className="text-sm text-gray-600">Reach</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{analytics.engagement}%</div>
          <div className="text-sm text-gray-600">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{analytics.followers}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{analytics.posts}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary text-sm">Create Ad</button>
        <button className="btn-secondary text-sm">View Insights</button>
        <button className="btn-secondary text-sm">Promote Post</button>
        <button className="btn-secondary text-sm">Creator Tools</button>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;