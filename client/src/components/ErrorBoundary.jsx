// src/components/ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Component Failed to Load</div>;
    }
    return this.props.children;
  }
}

// Usage in App.js:
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      {/* Your existing app structure */}
    </ErrorBoundary>
  )
}