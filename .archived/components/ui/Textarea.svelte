<script lang="ts">
  import { textareaVariants } from './textarea';

  let {
    variant = 'default',
    class: className = '',
    ...props
  } = $props<{
    variant?: 'default' | 'outline';
    class?: string;
    [key: string]: any;
  }>();

  const classNames = $derived(
    textareaVariants({ variant, className })
  );
</script>

<textarea
  class={classNames}
  {...props}
></textarea>