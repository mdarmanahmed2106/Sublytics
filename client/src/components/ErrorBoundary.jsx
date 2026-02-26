import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '100vh', padding: 32, textAlign: 'center',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(239, 68, 68, 0.1)', marginBottom: 20,
                    }}>
                        <AlertTriangle size={28} color="var(--danger)" />
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                        marginBottom: 8, letterSpacing: '-0.02em',
                    }}>
                        Something went wrong
                    </h2>

                    <p style={{
                        fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400,
                        lineHeight: 1.6, marginBottom: 24,
                    }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>

                    {this.state.error && (
                        <pre style={{
                            fontSize: 11, color: 'var(--text-muted)',
                            background: 'var(--bg-elevated)', padding: '12px 16px',
                            borderRadius: 'var(--radius-sm)', maxWidth: 500,
                            overflow: 'auto', marginBottom: 24, textAlign: 'left',
                        }}>
                            {this.state.error.message}
                        </pre>
                    )}

                    <button
                        onClick={this.handleRetry}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <RefreshCw size={16} /> Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
