<header class="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
  <div class="w-10 mr-2 shrink-0">
    <Button variant="ghost" onclick={ () => collapsed = !collapsed }>
      <PanelLeft size={ 16 } class="text-gray-800" />
    </Button>
  </div>

  <div class="w-px h-full shrink-0 bg-gray-200"></div>

  <div class="ml-4 shrink-0">
    <Breadcrumbs />
  </div>
</header>

<script lang="ts">
import { PanelLeft } from 'lucide-svelte';
import Breadcrumbs from './Breadcrumbs.svelte';
import Button from '$lib/components/Button.svelte';

interface Props {
  collapsed: boolean;
}

let { collapsed = $bindable() }: Props = $props();
</script>
