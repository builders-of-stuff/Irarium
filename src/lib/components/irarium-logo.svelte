<script lang="ts">
  let { class: className = 'w-8 h-8' } = $props();
</script>

<div
  class={className}
  style="
    mask-image: url('/irarium-logo-mask.png');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-image: url('/irarium-logo-mask.png');
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #94a3b8 100%);
  "
></div>
