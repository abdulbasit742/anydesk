# Web Error Handling

## Global Error Boundary
```tsx
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="error-boundary">
      <h2>Something went wrong</h2>
      <p>We have been notified and are working on a fix.</p>
      <button onClick={() => window.location.reload()}>
        Reload page
      </button>
    </div>
  );
}
```

## API Error Handling
```typescript
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw RemoteDeskError.fromApiResponse(error);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new RemoteDeskError(
        "Network error. Please check your connection.",
        "RD_N001",
        0
      );
    }
    throw error;
  }
}
```

## Form Validation
```tsx
function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (data: unknown) => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };
  
  return { errors, validate };
}
```

## Loading States
```tsx
function SessionView({ deskId }: { deskId: string }) {
  const { data, isLoading, error } = useSession(deskId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} retry={() => refetch()} />;
  if (!data) return <NotFound />;
  
  return <Session data={data} />;
}
```
