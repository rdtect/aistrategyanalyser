<script lang="ts">
  import { buttonVariants } from './button';

  let {
    type = 'button',
    variant = 'default',
    size = 'default',
    disabled = false,
    class: className = '',
    ...props
  } = $props<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    class?: string;
    [key: string]: any;
  }>();

  const classNames = $derived(
    buttonVariants({ variant, size, className: className })
  );
</script>

<button
  type={type}
  class={classNames}
  disabled={disabled}
  {...props}
>
  {@render props.children?.()}
</button>