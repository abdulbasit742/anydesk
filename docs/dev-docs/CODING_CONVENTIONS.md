# Coding Conventions

## TypeScript
### Types vs Interfaces
- Use `interface` for object shapes that may be extended
- Use `type` for unions, tuples, and mapped types
- Always export types that cross module boundaries

### Naming
- PascalCase: Types, Interfaces, Classes, Components, Enums
- camelCase: Variables, Functions, Methods, Properties
- UPPER_SNAKE_CASE: Constants, Environment Variables
- kebab-case: File names, CSS classes

### Functions
```typescript
// Named exports for utilities
export function doSomething(param: string): void {}

// Arrow functions for callbacks
const handler = (event: Event): void => {};

// Async/await preferred
async function fetchData(): Promise<Data> {
  const response = await api.get('/data');
  return response.data;
}
```

## React
### Components
```typescript
// Named exports
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};
```

### Hooks
- Custom hooks start with `use`
- One hook per file for complex hooks
- Document parameters and return type

### State Management
- useState for local state
- Context for shared state
- No external state library needed

## CSS/Tailwind
### Utility First
```tsx
// Good
<div className="flex items-center gap-2 p-4 bg-card rounded-lg">

// Avoid
<div className="my-custom-class">
```

### Custom Classes
- Use `cn()` utility for conditional classes
- Extract repeated patterns to components

## File Organization
```
src/
├── components/     # Reusable components
├── pages/          # Route-level pages
├── hooks/          # Custom hooks
├── lib/            # Utilities and services
├── types/          # TypeScript types
└── styles/         # Global styles
```

## Error Handling
- Use custom error classes
- Always log errors
- Show user-friendly messages
- Never expose internal details

## Comments
- JSDoc for public APIs
- Inline comments for complex logic
- TODO comments must include ticket number
