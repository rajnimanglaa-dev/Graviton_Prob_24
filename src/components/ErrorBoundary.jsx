import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('React rendering error', error, info);
  }

  retry = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen bg-[#101A17] text-[#F5F7F5] grid place-items-center p-6">
        <div className="max-w-md rounded-3xl border border-red-500/40 bg-[#1D2B25] p-7 text-center space-y-4">
          <h1 className="text-xl font-bold">This screen could not be displayed</h1>
          <p className="text-sm text-[#A5B3AA]">The application encountered a rendering error. Your data has not been changed.</p>
          <button onClick={this.retry} className="rounded-xl bg-[#16A36A] px-4 py-2 text-sm font-bold text-white">Try again</button>
        </div>
      </div>
    );
  }
}
