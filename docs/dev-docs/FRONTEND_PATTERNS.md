# Frontend Patterns

## Component Structure
```tsx
// imports
import React from 'react';
import { Button } from '@/components/ui/button';

// types
interface Props {
  title: string;
}

// component
export const MyComponent: React.FC<Props> = ({ title }) => {
  // hooks
  const [count, setCount] = useState(0);

  // handlers
  const handleClick = () => setCount(c => c + 1);

  // render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Count: {count}</Button>
    </div>
  );
};
```

## Data Fetching
```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = trpc.user.getById.useQuery(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NotFound />;

  return <Profile user={data} />;
}
```

## Mutations
```tsx
function CreatePost() {
  const utils = trpc.useUtils();
  const mutation = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.list.invalidate();
    },
  });

  const handleSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return <Form onSubmit={handleSubmit} loading={mutation.isPending} />;
}
```

## Form Handling
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function MyForm() {
  const form = useForm({
    resolver: zodResolver(MySchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```
