import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../utils/colors';
import { Button } from './Button';
import { Card } from './Card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error?: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log error to crash reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallbackComponent;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }
      
      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
interface ErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  return (
    <View style={styles.errorContainer}>
      <Card variant="elevated" padding="xl" style={styles.errorCard}>
        <View style={styles.errorIcon}>
          <Ionicons name="warning" size={48} color={colors.error} />
        </View>
        
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>
          We encountered an unexpected error. Don't worry, your data is safe.
        </Text>
        
        {error && __DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorDetailsTitle}>Error Details:</Text>
            <Text style={styles.errorDetailsText}>{error.message}</Text>
          </View>
        )}
        
        <View style={styles.errorActions}>
          <Button
            title="Try Again"
            onPress={retry}
            variant="primary"
            size="lg"
            icon="refresh"
            fullWidth
          />
        </View>
      </Card>
    </View>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-open-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.emptyContainer, style]}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={64} color={colors.textLight} />
      </View>
      
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      
      {actionLabel && onAction && (
        <View style={styles.emptyAction}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="outline"
            size="md"
          />
        </View>
      )}
    </View>
  );
};

// Network Error Component
interface NetworkErrorProps {
  onRetry: () => void;
  message?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  message = "Please check your internet connection and try again.",
}) => {
  return (
    <View style={styles.networkErrorContainer}>
      <Card variant="elevated" padding="xl" style={styles.networkErrorCard}>
        <View style={styles.networkErrorIcon}>
          <Ionicons name="wifi-outline" size={48} color={colors.textLight} />
          <View style={styles.networkErrorIndicator}>
            <Ionicons name="close" size={20} color={colors.error} />
          </View>
        </View>
        
        <Text style={styles.networkErrorTitle}>No Internet Connection</Text>
        <Text style={styles.networkErrorMessage}>{message}</Text>
        
        <View style={styles.networkErrorActions}>
          <Button
            title="Retry"
            onPress={onRetry}
            variant="primary"
            size="lg"
            icon="refresh"
            fullWidth
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  // Error Boundary Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorMessage: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.xl,
  },
  errorDetails: {
    width: '100%',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  errorDetailsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorDetailsText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontFamily: 'monospace',
  },
  errorActions: {
    width: '100%',
  },
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emptyIcon: {
    marginBottom: spacing.xl,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyMessage: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  emptyAction: {
    marginTop: spacing.md,
  },
  
  // Network Error Styles
  networkErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
  },
  networkErrorCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  networkErrorIcon: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  networkErrorIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    padding: 2,
  },
  networkErrorTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  networkErrorMessage: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.xl,
  },
  networkErrorActions: {
    width: '100%',
  },
});