// Provide a TypeScript declaration for the ESM entry we import directly
// This forwards exports to the main `lucide-react` package so TS can resolve types.
declare module 'lucide-react/dist/esm/lucide-react.mjs' {
  export * from 'lucide-react';
  import lucide from 'lucide-react';
  export default lucide;
}
