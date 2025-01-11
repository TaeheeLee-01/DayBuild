<!--
@component
- **역할**: 게이지 바를 표시하고, 게이지 바의 진행률에 따라 이미지를 조각내어 애니메이션 효과를 줍니다.
- **Props**: 
  - `progress`: 게이지 바의 진행률
- **특징**:
  - `progress` 값에 따라 이미지를 조각내어 애니메이션 효과를 줍니다.
  - 컴포넌트의 크기는 `--box-width`, `--box-height`로 설정할 수 있습니다.
  - 이미지는 `--img-url`로 설정할 수 있습니다.
  - 조각의 크기는 `--frag-width`, `--frag-height`로 설정할 수 있습니다.
  - 조각의 애니메이션 지속 시간은 `--duration`로 설정할 수 있습니다.
  - 조각의 애니메이션 지연 시간은 `--delayDelta`로 설정할 수 있습니다.
-->
<script>
    import { onMount } from 'svelte';

    let { progress } = $props();
    
    let grid_box;

    class GridAnimation {
        // 애니메이션을 작동하도록 fragment를 생성하는 클래스입니다.
        constructor(el, row = 15, col = 15, type = null) {

            //duration
            // 의미: 개별 fragment(애니메이션 조각)의 애니메이션이 시작된 후 완료되기까지 걸리는 전체 시간입니다.
            // 용도: 각 조각이 애니메이션을 실행하는 데 걸리는 총 지속 시간을 설정합니다.
            // 단위: ms (밀리초)
            
            //delayDelta
            //의미: 각 fragment가 애니메이션을 시작하기 전에 지연되는 시간의 단위입니다.
            // 용도: type 값에 따라 각 fragment에 서로 다른 지연 시간을 부여하여 애니메이션에 다양한 패턴과 순서를 만듭니다.
            // 단위: ms (밀리초)
            // 적용 방식: 지연 시간(delay)을 계산할 때 사용됩니다.
            // const delay = (i + j) * this.delayDelta; // i와 j에 따라 delay를 계산

            this.element = el;
            this.fragments = el.children;
            this.row = row;
            this.col = col;
            this.duration = 2000;
            this.delayDelta = 70;
            this.type = type;

            this.element.style.setProperty('--row', this.row);
            this.element.style.setProperty('--col', this.col);
            // this.element.addEventListener('click', this.trigger)

            this.randomIntBetween = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
        }

        progressTrigger = (progress) => {
            if (this.fragments.length > 0) this.clear()
            this.element.classList.add('hide')
            this.animateProgress(progress)
            if (progress === 100) {
            // Trigger multiple animation patterns in sequence
            const celebrationPatterns = [4, 7, 13, 2];
            let delay = 0;
            
            celebrationPatterns.forEach((pattern, index) => {
                setTimeout(() => {
                    this.clear();
                    this.setType(pattern);
                    this.animate();
                }, delay);
                delay += this.duration + (this.delayDelta * this.row * this.col);
            });
        }
        }

        trigger = () => {
            if (this.fragments.length > 0) this.clear()
            this.element.classList.add('hide')
            this.animate()
        }

        setType = (type) => {
            this.type = type
        }

        clear = () => {
            while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.firstChild)
            }
        }

        animate() {
            if (this.type === null) return
            const x = this.col - 1
            const y = this.row - 1
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    const fragment = document.createElement('div');
                    fragment.className = 'fragment';
                    fragment.style.setProperty('--x', j);
                    fragment.style.setProperty('--y', i);

                    let delay = 0
                    switch (this.type) {
                case  0: delay = i * 2; break //"↓"
                case  1: delay = j * 2; break //"→"
                case  2: delay = this.randomIntBetween(0, x + y); break //"🎲"
                case  3: delay = (x + y) - (j + i); break //"↖"
                case  4: delay = i + j; break //"↘"
                case  5: delay = (x - i) + j; break //"↗"
                case  6: delay = i + (y - j); break //"↙"
                case  7: delay = Math.abs((x + y) / 2 - (j + i)); break //"↖↘"
                case  8: delay = (x + y) / 2 - Math.abs((x + y) / 2 - (j + i)); break //"↘↖"
                case  9: delay = (x + y) / 2 - Math.abs((x + y) / 2 - (j + i)) * Math.cos(i + j); break //"🤔"
                case 10: delay = Math.abs((x + y) / 2 - ((x - j) + i)); break //"↙↗"
                case 11: delay = Math.abs((x + y) / 2 - Math.abs((x + y) / 2 - ((x - j) + i))); break //"↗↙"
                case 12: delay = Math.abs((x / 2) - j) + Math.abs((y / 2) - i); break  //"⇐⊚⇒"
                case 13: delay = x / 2 - Math.abs((x / 2) - j) + (x / 2 - Math.abs((y / 2) - i)); break //"⇒⊚⇐"
                }

                const isOdd = (i + j) % 2 === 0
                fragment.style.setProperty('--rotateX', `rotateX(${isOdd ? -180 : 0}deg)`)
                fragment.style.setProperty('--rotateY', `rotateY(${isOdd ? 0 : -180}deg)`)
                fragment.style.setProperty('--delay', delay * this.delayDelta + 'ms')
                fragment.style.setProperty('--duration', this.duration + 'ms')
                this.element.appendChild(fragment);

                const timer = setTimeout(() => {
                    fragment.style.willChange = 'initial'
                    fragment.style.transform = 'initial'
                    fragment.style.animation = 'initial'
                    fragment.style.backfaceVisibility = 'initial'
                    clearTimeout(timer)
                }, this.duration + delay * this.delayDelta)

                }
            }
        }

        animateProgress(degree) {
            //degree : 100% 단위 number
            if (this.type === null) return
            const x = this.col - 1
            const y = this.row - 1
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    const fragment = document.createElement('div');
                    fragment.className = 'fragment';
                    fragment.style.setProperty('--x', j);
                    fragment.style.setProperty('--y', i);

                    let delay = 0
                    delay = this.randomIntBetween(0, x + y);

                    const isOdd = (i + j) % 2 === 0
                    if (Math.random() <= degree/100 ) {
                    fragment.style.setProperty('--rotateX', `rotateX(${isOdd ? -180 : 0}deg)`)
                    fragment.style.setProperty('--rotateY', `rotateY(${isOdd ? 0 : -180}deg)`)
                    fragment.style.setProperty('--delay', delay * this.delayDelta + 'ms')
                    fragment.style.setProperty('--duration', this.duration + 'ms')
                    } else {
                        fragment.classList.add('no-background');
                    }
                    this.element.appendChild(fragment);

                    const timer = setTimeout(() => {
                        fragment.style.willChange = 'initial'
                        fragment.style.transform = 'initial'
                        fragment.style.animation = 'initial'
                        fragment.style.backfaceVisibility = 'initial'
                        clearTimeout(timer)
                    }, this.duration + delay * this.delayDelta)

                }
            }
        }

    }

    let gridAni = $state(); // 컴포넌트 스코프에서 선언

    onMount(() => {
        // const imgBox = document.querySelector('.img-box');
        gridAni = new GridAnimation(grid_box);
        gridAni.setType(2);
        // gridAni.animate();

        // const imgBox2 = document.querySelector('.show');
        // const gridAni2 = new GridAnimation(imgBox2);
        // gridAni2.setType(12);
        // imgBox2.addEventListener('click', gridAni2.trigger);
    });
   
</script>

<button
    class="GridAnimateButton grid-item-6"
    aria-label="게이지 이미지"
    onclick={() => {
        gridAni.progressTrigger(progress);
        console.log(gridAni);
        }}
>
    <div bind:this={grid_box} class="img-box" data-title="호이"></div>

</button>

<!-- <div class="img-box show grid-item" data-title="호이"></div> -->


<style>
    .GridAnimateButton {
        border: none;
        background: none;
        display: flex;

    }


    :global(.img-box) {
        --box-width: 20rem;
        --box-height: 30rem;
        --frag-width: calc(var(--box-width) / var(--col));
        --frag-height: calc(var(--box-height) / var(--row));
        /* --img-url: url('https://djjjk9bjm164h.cloudfront.net/leather01.jpg'); */
        --img-url: url('https://i.pinimg.com/736x/ba/46/2e/ba462ecb1e3b0449fdbcdf444840cf82.jpg');

        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: var(--box-width);
        height: var(--box-height);
        /* box-sizing: border-box; */
        border: 1px solid #F1F1F1;
        position: relative;
    }

    /* .img-box::before {
    content: attr(data-title);
    position: absolute;
    top: calc(100% + 1.5rem);
    font-size: 1.7rem;
    } */

    .img-box::after {
    content: "CLICK ME";
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    color: #aaa;
    
    background-image: repeating-linear-gradient(-45deg, rgba(100,100,100, 0.25), rgba(100,100,100, 0.25) 1px, transparent 1px, transparent 6px);
    background-size: 4px 4px;
    transition: all 0.2s;
    }

    :global(.img-box.hide::after) { opacity: 0; }
    :global(.img-box.hide:hover::after) { opacity: 0; }
    .img-box:hover::after { 
    background-image: initial;
    font-size: 1.8rem;
    }



    :global(.fragment) {
        --x-offset: calc(var(--x) * (var(--frag-width) * -1));
        --y-offset: calc(var(--y) * (var(--frag-height) * -1));
        --rotateX: rotateX(0);
        --rotateY: rotateY(0);

        width: var(--frag-width);
        height: var(--frag-height);
        box-sizing: border-box;

        background-image: var(--img-url);
        background-repeat: no-repeat;
        background-size: var(--box-width) var(--box-height);
        background-position: var(--x-offset) var(--y-offset);
        
        backface-visibility: hidden;
        will-change: transform;
        transform: var(--rotateX) var(--rotateY) scale(0.8);
        animation: flip var(--duration) linear var(--delay) forwards;
    }

    :global(.fragment.no-background) {
        background: rgb(255, 255, 255); /* 이미지 없음, 배경색 하얀색 */
    }

    @keyframes flip {
    0% { transform: var(--rotateX) var(--rotateY) scale(0.8); opacity: 0; }
    70% { transform: rotateX(0) rotateY(0) scale(0.8); opacity: 1; }
    100% { transform: rotateX(0) rotateY(0) scale(1); }
    }
</style>