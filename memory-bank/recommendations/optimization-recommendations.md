### Component Structure Simplification

1. **Consolidate Chat Logic Files**

   - Current: `Chat.svelte`, `Chat.svelte.ts`, and route-specific `ChatLogic.ts`
   - Recommendation: Merge related logic into a single coherent pattern

2. **Standardize Component/Logic Split**

   - Current: Mixed patterns (some components have .svelte.ts files, others don't)
   - Recommendation: Adopt consistent pattern for all complex components
     ```
     components/
     ├── ComponentName/
     │   ├── ComponentName.svelte       # UI only
     │   ├── ComponentName.svelte.ts    # Logic only
     │   └── index.ts                   # Export both for easy imports
     ```

3. **Flatten Deep Route Nesting**
   - Current: Deep nesting in routes (e.g., `/analyses/[id]/questions/`)
   - Recommendation: Consider flatter routes with query parameters where appropriate
