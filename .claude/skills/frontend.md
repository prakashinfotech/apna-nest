# Frontend Development Skills

This document provides specific patterns and "skills" for developing the ApnaNest frontend.

## 1. Creating a New Page
- **Convention**: Use Next.js App Router.
- **Pattern**:
  1. Create `app/[route]/page.tsx`.
  2. Use a Server Component for data fetching.
  3. If interactivity is needed, create a separate Client Component in the same folder or in `components/`.
  4. Define metadata for SEO.
- **Example**:
  ```tsx
  import { getProperty } from '@/lib/api';
  import PropertyDetailView from './property-detail-view';

  export async function generateMetadata({ params }) {
    const property = await getProperty(params.id);
    return { title: property.title };
  }

  export default async function Page({ params }) {
    const property = await getProperty(params.id);
    return <PropertyDetailView property={property} />;
  }
  ```

## 2. Data Fetching (Client-Side)
- **Library**: TanStack Query (React Query).
- **Pattern**:
  1. Create a custom hook in `hooks/` or co-located.
  2. Use `useQuery` for fetching, `useMutation` for updates.
- **Example**:
  ```tsx
  import { useQuery } from '@tanstack/react-query';
  import { api } from '@/lib/api';

  export function useProperty(id: string) {
    return useQuery({
      queryKey: ['property', id],
      queryFn: () => api.properties.getById(id),
    });
  }
  ```

## 3. Form Handling
- **Library**: React Hook Form + Zod.
- **Pattern**:
  1. Define a Zod schema.
  2. Use `useForm` with the `zodResolver`.
  3. Create reusable form components (Input, Select, etc.) using `shadcn/ui`.
- **Example**:
  ```tsx
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  ```

## 4. Responsive Design & Styling
- **Convention**: Mobile-first with Tailwind CSS.
- **Pattern**:
  - Use `sm:`, `md:`, `lg:`, `xl:` prefixes.
  - Use `flex` and `grid` for layouts.
  - Follow the theme tokens defined in `tailwind.config.ts`.

## 5. Components & UI
- **Library**: `shadcn/ui` (Radix UI).
- **Pattern**:
  - Copy components from `shadcn/ui` into `components/ui/`.
  - Customize components to match the ApnaNest brand.
  - Use `Lucide React` for icons.
