import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { ChatInterface } from './components/Chat/ChatInterface';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ChatInterface />
      </div>
    </AppProvider>
  );
}

export default App;