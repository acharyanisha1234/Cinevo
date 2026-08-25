import React from 'react';

const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    {Icon && <Icon size={48} className="mb-4" />}
    <p className="text-lg">{message}</p>
  </div>
);

export default EmptyState;