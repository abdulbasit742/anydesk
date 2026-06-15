# Currency Handling

## Format
```typescript
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(1234.56); // $1,234.56
```

## Rounding
Follow ISO 4217 for decimal places.
