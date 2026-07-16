import React from 'react';

export default function StatCard({ label, value, icon }) {
  return (
    <div className="card-spring p-6 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-2xl font-light text-text-primary">{value}</p>
      </div>
    </div>
  );
}