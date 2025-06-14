#!/bin/bash

# Fix client-dashboard-api.ts
sed -i '' 's/projects?.map(p => p.id)/projects?.map((p: any) => p.id)/g' src/lib/client-dashboard-api.ts
sed -i '' 's/projects?.filter(p => p.status === '\''in_progress'\'').length/projects?.filter((p: any) => p.status === '\''in_progress'\'').length/g' src/lib/client-dashboard-api.ts
sed -i '' 's/projects?.filter(p => p.status === '\''completed'\'').length/projects?.filter((p: any) => p.status === '\''completed'\'').length/g' src/lib/client-dashboard-api.ts
sed -i '' 's/async (comment) =>/async (comment: any) =>/g' src/lib/client-dashboard-api.ts
sed -i '' 's/(payload) => {/(payload: any) => {/g' src/lib/client-dashboard-api.ts
sed -i '' 's/.subscribe((status) => {/.subscribe((status: any) => {/g' src/lib/client-dashboard-api.ts

# Fix client-quick-actions.ts
sed -i '' 's/(payload) => {/(payload: any) => {/g' src/lib/client-quick-actions.ts
sed -i '' 's/.subscribe((status) => {/.subscribe((status: any) => {/g' src/lib/client-quick-actions.ts

# Fix simple-messages-api.ts
sed -i '' 's/(payload) => {/(payload: any) => {/g' src/lib/simple-messages-api.ts
sed -i '' 's/.subscribe((status) => {/.subscribe((status: any) => {/g' src/lib/simple-messages-api.ts

# Fix admin-notifications.ts
sed -i '' 's/(payload) => {/(payload: any) => {/g' src/lib/admin-notifications.ts

echo "TypeScript errors fixed!"