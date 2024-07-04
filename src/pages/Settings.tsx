import React from 'react';
import Link from 'next/link';
import "./globals.css";

const SettingsPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        <h1 className="text-4xl font-bold mb-4">Settings Page</h1>
        <div className="flex space-x-4">
          <Link href="/Login" className="bg-blue-500 text-white py-2 px-4 rounded">Login Page</Link>
          <Link href="/" className="bg-blue-500 text-white py-2 px-4 rounded">Main Page</Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

