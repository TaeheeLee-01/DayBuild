<script>
    import { json } from '@sveltejs/kit';
    
    import { calculateDDay, calculateDayDiff, calculateHourDiffbyendHour } from '$lib/utils/dateUtils.js'
    import GridAnimateProgress from './GridAnimateProgress.svelte';
    import { onMount } from 'svelte';
        
    let { data } = $props();
    let Daydata = $state({ ...data });
    let editMode = $state(false);
    let day_reset = $derived(calculateHourDiffbyendHour(Daydata.updatedAt) > 0 ? true : false);
    let mission_progress = $state(0); //0 to 100
    let extra_score = $state(0);
    let step_progress = $state(0); //0 to 100

    function Particle_event(event) {
        const button = event.target;
        const container = button.parentElement;
        const rect = button.getBoundingClientRect(); //이걸 바탕으로 현재 버튼의 위치 및 크기 체크 가능
        console.log(container);
        // const container = document.getElementById('button-container');

        // Create particle fragments
        for (let i = 0; i < 100; i++) {
            const fragment = document.createElement('div'); 
            fragment.className = 'particle-fragment';

            // Random position and velocity for each fragment
            const x = Math.random() * 2 - 1; // random between -1 and 1
            const y = Math.random() * 2 - 1;

            fragment.style.setProperty('--x', x);
            fragment.style.setProperty('--y', y);

            // Place the fragment at the button's position
            fragment.style.left = `${rect.left + rect.width / 2}px`;
            fragment.style.top = `${rect.top + rect.height / 2}px`;

            container.appendChild(fragment);

            // Remove the fragment after animation
            setTimeout(() => {
                fragment.remove();
            }, 1000);
        }

        // Animate button disappearance
        button.classList.add('disappear');

        // Remove button after animation
        setTimeout(() => {
            button.style.display = 'none';
        }, 1000);
    }

    
    $effect(() => {
        //하루 단위가 지날 경우, 하루 단위 체크 리스크들 리셋시키기
        if (day_reset) {
            Daydata.updatedAt = new Date().toISOString();
            Daydata.day_mission.map((training) => {
                training.completed = false;
            });
            mission_progress = 0;
            // syncTrainingSetWithServer(skill);
            //굳이 이렇게 하지 않고, 그냥 나중에 트레이닝에서 체크 버튼 누를 때마다 skill 잘 업데이트 해주면 될 듯?
        }
    });
    $inspect(Daydata);

    onMount(() => {
        // 초기 mission_progress 값 mount할 때 구한 다음 여기서 빼거나 더하는 식으로 구현
        mission_progress = 0;
        Daydata.day_mission.map((training) => {
                if (training.completed == true) mission_progress += training.rate;
            });
        extra_score = 0;
        extra_score = Daydata.extra_score;

    })
</script>

<!-- 구현할 내용 

1. server.json.에서 데이터 가져오기 : 
    가장 가까운 deactive list
    가장 가까운 goals
    현재 진행중인 breakthough와 그에 대한 쪼개기 내용 -> today라는 컬렉션을 만든 다음에 그 안에 이거랑, 이거 어디 skill 소속인지 등
    Today 전용 퀘스트들
    디자인용 컴포넌트 제작 -> 여러가지 라이브러리 적용해보기!! 
    svelte 내장 애니메이션!!! 
--> 

<!-- Main Content -->
{#if editMode}
        <!-- <DayForm
            skill={skill}
            submit_data = { (updatedSkill) => {
                skill = { ...skill, ...updatedSkill}; // 데이터 업데이트
                editMode = false; // 수정 모드 종료
            }}
            submit_cancel = { () => {
                editMode = false;
            }} /> -->
{:else}
<main class="container" >

    <!-- skill state -->
    {#if Daydata.combo && Daydata.deactive_limit_day}
        <!-- State -->
        <h2 class="title">State</h2>
        <div class="deactivation grid-item-6">
            <h3>Until deactivation: { left_dayt_to_deactive } {left_dayt_to_deactive <= 1 ? 'day' : 'days'}</h3>
            <div class="deact-progress-bar">
                <div class="progress"></div>
            </div>
        </div>
        <div class="streak grid-item-6">
            <h3>Streak: { Daydata.combo } { Daydata.combo <= 1 ? 'day' : 'days' } combo!</h3>
            <div class="streak-progress-bar">
                <div class="progress"></div>
            </div>
        </div>
    {/if}

    <!-- Daydata Goals -->
    {#if Daydata.goals}
        <h2 class="title">Goal</h2>
            {#each  Daydata.goals as goal}
            <div class="goal-item grid-item">
                <div class="goal-content">
                    <div class="goal-content-left">
                        <div class="goal-logo">🏆</div>
                        <h3 class="goal-name">{ goal.name } { goal.field }</h3>
                    </div>  
                    <p>Time limit : { goal.time_limit.split('T')[0] } (<b>{ calculateDDay(goal.time_limit) }</b>) </p>    
                </div>
                <div class="goal-details">
                    {#each goal.values as value}
                        <div class="goal-value"><p>{ value }</p></div>
                    {/each}
                </div>
            </div>
        {/each}
    {/if}

    <!-- Training -->
    {#if Daydata.day_mission}
        <!-- Training List -->
        <h2 class="title">Training List</h2>
        <div class="training-set">
            <ul>
                {#each Daydata.day_mission as mission}
                <li>
                    <div class="training-name">
                        <p>{ mission.name }</p>
                        <p><i>{ mission.rate }%</i></p>
                    </div>
                    <button class="training-check-box" onclick={() => {
                        mission.completed = !mission.completed;
                        if (mission.completed) {
                            Daydata.updatedAt = new Date().toISOString();
                            mission_progress += mission.rate;
                        } else {
                            Daydata.updatedAt = new Date().toISOString();
                            mission_progress -= mission.rate;
                        }
                    }}>
                        {#if !day_reset && mission.completed}
                            <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
                                <path d="m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z"/>
                            </svg>                    
                        {/if}
                    </button>
                </li>
                {/each}
            </ul>

            <h2>Sence Manage</h2>
            <ul>
                {#each Daydata.extra_mission_skills as mission_skill, i}
                <li>
                    <div class="training-name">
                        <p>{ mission_skill.name } 스킬 프레젠테이션</p>
                        <p><i>{ mission_skill.deactivation_left } days left</i></p>
                    </div>
                    <button 
                        class="training-check-box particle-button"
                        style="background-color: #fad7ac;"
                        onclick={(event) => {
                            //api 요청
                            extra_score += 1;
                            //애니메이션
                            Particle_event(event);
                            //체크표시 -> 애니메이션 -> 게이지 확대 + 색깔 애니메이션
                        }}
                        aria-label="extra-check-button"
                    >
                    </button>
                </li>
                {/each}
            </ul>
        </div>

        <GridAnimateProgress progress={mission_progress}/>

        <div class="streak grid-item">
            <h3>To do at Morning</h3>
            <div class="streak-progress-bar" style="margin: 10px;">
                <div class="progress"
                    style="background: linear-gradient(to right, #fff200, #eae999);
                        transition: all 0.5s ease-in-out;
                        width: {mission_progress}%;"
                ></div>
            </div>
        </div>
    {/if}

    <!-- Breakthrough -->
    {#if Daydata.breakthrough}
    <h2 class="title">Breakthrough</h2>
    <div class="day-break-box training-set">
        <div class="day-break-box-stars stars">
            {#each Array.from({ length: Daydata.breakthrough.grade[0] }) as _, i}
                <!-- 보라색 별 -->
                <svg class="star purple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                </svg>
            {/each}
            {#each Array.from({ length: Daydata.breakthrough.grade[1] }) as _, i}
                <!-- 노란색 별 -->
                <svg class="star yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                </svg>
            {/each}
        
        </div>
        <div class="day-break-rect">
            <p>{ Daydata.breakthrough.name }</p>
        </div>
        <ul>
            {#each Daydata.breakthrough.step as step}
                <li>
                    <div class="training-name">
                        <p>{ step.name }</p>
                        <p><i>{ step.rate }%</i></p>
                    </div>
                    <button 
                        class="training-check-box"
                        style="background-color: #fad7ac;"
                        onclick={(event) => {
                            //api 요청
                            step.completed = !step.completed;
                            if (step.completed) {
                            // Daydata.updatedAt = new Date().toISOString();
                            step_progress += step.rate;
                            } else {
                                // Daydata.updatedAt = new Date().toISOString();
                                step_progress -= step.rate;
                            }
                        }}
                        aria-label="extra-check-button"
                    >
                        {#if step.completed}
                            <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
                                <path d="m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z"/>
                            </svg>                    
                        {/if}
                    </button>

                </li>
            {/each}
        </ul>
    </div>

    <GridAnimateProgress progress={step_progress}/>
    {/if}

    <!-- Project -->
    {#if Daydata.projects}
        <h2 class="title">Project</h2>
        {#each Daydata.projects as project, i}
            
            <div class="project-box">
                <div class="day-break-rect">
                    <p>{ Daydata.breakthrough.name }</p>
                </div>
                <ul>
                    {#each project.steps as step}
                        <li>
                            <div class="training-name">
                                <p>{ step.name }</p>
                                <p><i>{ step.rate }%</i></p>
                            </div>
                            <button 
                                class="training-check-box"
                                style="background-color: #fad7ac;"
                                onclick={(event) => {
                                    //api 요청
                                    step.completed = !step.completed;
                                    if (step.completed) {
                                    // Daydata.updatedAt = new Date().toISOString();
                                    project_progress[i] += step.rate;
                                    } else {
                                        // Daydata.updatedAt = new Date().toISOString();
                                        project_progress[i] -= step.rate;
                                    }
                                }}
                                aria-label="extra-check-button"
                            >
                                {#if step.completed}
                                    <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
                                        <path d="m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z"/>
                                    </svg>                    
                                {/if}
                            </button>

                        </li>
                    {/each}
                </ul>
            </div>
            <GridAnimateProgress progress={project_progress[i]}/>
        {/each}
    {/if}




    <!-- Edit Button -->
    <div class="edit-button">
        <button onclick={() => {editMode = true}}>Edit</button>
    </div>

</main>
{/if}

<style>
    .day-break-box {
        grid-column: span 6; /* 12열 중 3칸 차지 */
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 8px;
        background: #f9f9f9;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        row-gap: 10px; /*박스, 버튼 사이 gap*/
    }

    .day-break-rect {
        position: relative;
        width: 100%;
        height: 80px;
        margin: 0 auto;
        background: #e1d5e7;
        border: 1px solid #ddd;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .day-break-box p {
        font-size: 1.2rem;
    }

    .day-break-box ul {
        margin: 0;
        padding: 0;
    }



    .container {
        overflow-y: scroll;
        height: 100vh; /* 부모 높이 명확히 설정해야 스크롤 가능띠!!  추후에 내비게이션 고려해서 하기*/
    }

    ::-webkit-scrollbar {
    width: 4px;
    }

    ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #6a11cb, #e1d5e7); /* 그라데이션 */
    border-radius: 10px;
    }

    ::-webkit-scrollbar-track {
    background: #e0e0e0; /* 트랙 색상 */
    }


    button.particle-button {
        padding: 10px 20px;
        font-size: 20px;
        border: none;
        background-color: #61dafb;
        color: black;
        cursor: pointer;
        border-radius: 5px;
        position: relative;
        z-index: 1;
        overflow: hidden;
    }

    button.particle-button:focus {
        outline: none;
    }

        
    :global(.particle-fragment) {
        position: absolute;
        width: 5px;
        height: 5px;
        background: #61dafb;
        border-radius: 50%;
        animation: disperse 1s ease-out forwards;
    }

    @keyframes disperse {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(calc(var(--x) * 100px), calc(var(--y) * 100px)) scale(0.5);
        }
    }

    :global(.particle-button.disappear) {
        animation: buttonFadeOut 1s forwards;
    }

    @keyframes buttonFadeOut {
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
</style>