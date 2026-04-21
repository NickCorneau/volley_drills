import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-4 text-center">
          <h1 className="text-xl font-bold text-text-primary">
            Something went wrong
          </h1>
          <p className="text-sm text-text-secondary">
            The app encountered an unexpected error.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false })
              window.location.href = '/'
            }}
            className="min-h-[54px] rounded-[16px] bg-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-pressed active:bg-accent-pressed"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
