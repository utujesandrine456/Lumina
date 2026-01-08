import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Ionicons name="alert-circle" size={64} color="#FF5252" />
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>
                            We encountered an unexpected error.
                        </Text>

                        <ScrollView style={styles.errorBox}>
                            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
                        </ScrollView>

                        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 24,
    },
    errorBox: {
        maxHeight: 200,
        width: '100%',
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 24,
    },
    errorText: {
        fontSize: 12,
        color: '#FF5252',
        fontFamily: 'Courier',
    },
    button: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        elevation: 2,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorBoundary;
