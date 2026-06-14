import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Root error boundary (RDM-004 TD-11): a WebGL/asset failure must degrade to a
 * recoverable screen, never a white page. OFFICINA-styled, with a reload path.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Sprint-4 hooks Sentry here; for now a structured console record.
    console.error('[dtea] unhandled error', error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="display-caps text-[11px] tracking-[0.2em] text-grigio-400">Officina</p>
        <h1 className="display text-2xl text-nero">Qualcosa si è inceppato.</h1>
        <p className="max-w-md text-sm text-grigio-600">
          The workshop hit an unexpected fault. Your progress is saved locally; reloading usually
          clears it.
        </p>
        <p className="data max-w-md break-words text-[11px] text-grigio-400">
          {this.state.error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="ui-move rounded bg-rosso px-4 py-2 text-xs font-semibold text-white hover:bg-rosso-scuro"
        >
          Ricarica
        </button>
      </div>
    );
  }
}
