"use client";

import React, { Component, type ReactNode } from "react";
import ErrorCard from "./ErrorCard";

type Props = {
  children: ReactNode;
  /** Section name shown in error message */
  section?: string;
  /** Compact mode for inline sections */
  compact?: boolean;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Client-side error boundary for individual dashboard sections.
 * Catches render errors in children without crashing the whole page.
 *
 * Usage:
 *   <SectionErrorBoundary section="Nutrition">
 *     <NutritionSection />
 *   </SectionErrorBoundary>
 */
export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[${this.props.section || "Section"}] Error:`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorCard
          title={`${this.props.section || "Section"} Error`}
          message={`This section couldn't load. Your data is safe — try refreshing.`}
          icon="⚠️"
          onRetry={this.handleRetry}
          compact={this.props.compact ?? true}
        />
      );
    }

    return this.props.children;
  }
}
