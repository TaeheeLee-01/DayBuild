<script>
    import { spring } from 'svelte/motion';

    let coords = spring({ x: 50, y: 50 }, {
        stiffness: 0.1,
        damping: 0.25
    });

    let size = spring(10);  
</script>


<svg
	onmousemove={(e) => {
		coords.set({ x: e.clientX, y: e.clientY });
	}}
	onmousedown={() => size.set(30)}
	onmouseup={() => size.set(10)}
	role="presentation"
>
	<circle
		cx={$coords.x}
		cy={$coords.y}
		r={$size}
	/>
</svg>

<style>
    svg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}
	circle {
		fill: #ff3e00;
	}
</style>