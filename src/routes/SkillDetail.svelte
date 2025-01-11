<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import SkillForm from './SkillForm.svelte';

    import { getIconPathById } from '$lib/icon.js';
    import { calculateDDay, calculateDayDiff, calculateHourDiffbyendHour } from '$lib/utils/dateUtils.js'
    import Page from './+page.svelte';

    let { skillData, letSkillFocus } = $props();
    
    let editMode = $state(false); // 수정 모드 여부
    let skill = $state({ 
        _id : null,
        name : null,
        skill_class : null, 
        star_grade : null, 
        skill_state : null, 
        level : null, 
        description : null, 
        values : null, 
        goals : null,
        breakthrough : null, 
        training_list : null, 
        trophies : null, 
        mission_list : null, 
        chievement_list : null });
    let left_dayt_to_deactive = $derived(skill.deactive_limit_day ? skill.deactive_limit_day - (calculateDayDiff(skill.updatedAt)) : null);
    let day_reset = $derived(calculateHourDiffbyendHour(skill.updatedAt) > 0 ? true : false);
    
    skill = {...skillData }; //skill 업데이트 하기 

    onMount(() => {
        document.addEventListener('DOMContentLoaded', () => {
            const progressCircle = document.querySelector('.progress-circle');
            const scoreValue = document.getElementById('score-value');
            const scoreCircle = document.querySelector('.score-circle');

            const maxScore = 75; // 목표 점수 (0-100)
            const circumference = 502; // 원의 둘레
            const animationDuration = 1000; // 전체 애니메이션 시간 (밀리초)
            const intervalDuration = 10; // 업데이트 간격 (밀리초)
            const totalSteps = animationDuration / intervalDuration; // 총 단계 수
            const scoreIncrement = maxScore / totalSteps; // 점수 증가 단위
            const full_dashOffsetDecrement = circumference / totalSteps; // 원 차오름 단위
            const dashOffsetDecrement = (maxScore / 100) * circumference / totalSteps; // 원 차오름 단위

            let currentScore = 0;
            let currentOffset = circumference;

            const interval = setInterval(() => {
                if (currentScore < maxScore) {
                    currentScore += scoreIncrement;
                    currentOffset -= dashOffsetDecrement;

                    // Update the circle's dashoffset and the score text
                    progressCircle.style.strokeDashoffset = currentOffset;
                    scoreValue.textContent = Math.floor(currentScore);
                } else {
                    clearInterval(interval); // 애니메이션 종료
                    scoreValue.textContent = maxScore; // 점수 정밀도 보장
                    // removeSurroundingCircles(); // 주변 원 제거 시작
                }
            }, intervalDuration);
            
            // 아코디언 기능 구현
            const accordionHeaders = document.querySelectorAll('.accordion-header');

            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const accordionItem = header.parentElement;

                    // Toggle the active state
                    accordionItem.classList.toggle('active');

                    // Close other accordion items
                    document.querySelectorAll('.accordion-item').forEach(item => {
                        if (item !== accordionItem) {
                            item.classList.remove('active');
                        }
                    });

                    // Check if the content is outside the viewport
                    const content = accordionItem.querySelector('.accordion-content');
                    if (accordionItem.classList.contains('active')) {
                        setTimeout(() => {
                            const contentBottom = content.getBoundingClientRect().bottom;
                            const viewportHeight = window.innerHeight;

                            // If content's bottom is outside the viewport, scroll to it
                            if (contentBottom > viewportHeight) {
                                content.scrollIntoView({
                                    behavior: 'smooth', // Smooth scrolling
                                    block: 'end'        // Align the bottom of the content with the viewport
                                });
                            }
                        }, 300); // Delay to match the CSS animation
                    }
                });
            });


        });
        return () => {
            console.log('스킬디테일 언마운트됨. if문 안맞아서 제거되면 파괴. 여기에 파괴됬을 때 행동! -> focus 돌아가기 등');
        };
    });

    $inspect(skill);
    
    function addSkillExp(exp) {
        if (skill.exp) {
            skill.exp = skill.exp + exp;
            if (skill.exp >= 100) {
                skill.level += 1;
                skill.exp -= 100;
                //애니메이션 함수 넣기
            } else if ( skill.exp < 0 ) {
                if (skill.level > 0) {
                    skill.level -= 1;
                    skill.exp += 100;
                //애니메이션 함수 넣기
                }
            }

        }
    }

    async function syncTrainingSetWithServer(trainingSet) {
        const response = await fetch('/api/sync-training-set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trainingSet })
        });

        if (!response.ok) {
            console.error('Failed to sync training set with server');
        }
    }

    $effect(() => {
        //하루 단위가 지날 경우, 하루 단위 체크 리스크들 리셋시키기
        if (day_reset) {
            console.log('하루 리셋');
            skill.updatedAt = new Date().toISOString();
            skill.training_list.map((training) => {
                training.completed = false;
            });
            // syncTrainingSetWithServer(skill);
            //굳이 이렇게 하지 않고, 그냥 나중에 트레이닝에서 체크 버튼 누를 때마다 skill 잘 업데이트 해주면 될 듯?
        }
    });


</script>

<div class="wrapper" id="skill_detail"  transition:fade>
    {#if editMode}
    <!-- // 자식에서 inflate 이벤트 발생 시 실행할 콜백 -->
        <SkillForm
            skill={skill}
            submit_data = { (updatedSkill) => {
                skill = { ...skill, ...updatedSkill}; // 데이터 업데이트
                editMode = false; // 수정 모드 종료
            }}
            submit_cancel = { () => {
                editMode = false;
            }} />
    {:else}     
    <main class="container" >
        <!-- Skill Name, Rating, Level -->
        {#if skill.skill_class == 'fundamental'}
            <div class="skill-header grid-item">
                <div class="skill-info">
                    <h1>{ skill.name }</h1>
                    <div class="stars">
                        {#each Array.from({ length: skill.star_grade[0] }) as _, i}
                            <!-- 보라색 별 -->
                            <svg class="star purple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                            </svg>
                        {/each}
                        {#each Array.from({ length: skill.star_grade[1] }) as _, i}
                            <!-- 노란색 별 -->
                            <svg class="star yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                            </svg>
                        {/each}
                    </div>
                    <div class="skill-grade">{ skill.skill_class }</div>
                </div>
                <div class="skill-level">Level. { skill.level }</div>
            </div>
        {/if}
        {#if skill.skill_class == 'sub-class'}
            <div class="skill-header grid-item">
                <div class="skill-info">
                    <h1>{ skill.name }</h1>
                    <h1>Lv. { skill.level } ({ skill.exp }%)</h1>
                    <div class="skill-grade">{ skill.skill_class }</div>
                </div>
                <button 
                    class="skill-level"
                    onclick={(e) => {
                        letSkillFocus(true);
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = '';
                    }}
                >➕</button>
                <button 
                    class="skill-level"
                    onclick={(e) => {
                        letSkillFocus(false);
                        e.target.style.display = 'none';
                        e.target.previousElementSibling.style.display = '';
                    }}
                    style="display: none;"
                >➖</button>
            </div>
        {/if}

        <!-- skill state -->
        {#if skill.combo && skill.deactive_limit_day}
            <!-- State -->
            <h2 class="title">State</h2>
            <div class="deactivation grid-item-6">
                <h3>Until deactivation: { left_dayt_to_deactive } {left_dayt_to_deactive <= 1 ? 'day' : 'days'}</h3>
                <div class="deact-progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
            <div class="streak grid-item-6">
                <h3>Streak: { skill.combo } { skill.combo <= 1 ? 'day' : 'days' } combo!</h3>
                <div class="streak-progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
        {/if}

        <!-- skill Goals -->
        {#if skill.goals}
            <h2 class="title">Goal</h2>
             {#each  skill.goals as goal}
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
        {#if skill.training_list}
        <!-- Training List -->
        <h2 class="title">Training List</h2>
        <div class="training-set">
            <ul>
                {#each skill.training_list as training_set}
                <li>
                    <div class="training-name">
                        <p>{ training_set.name }</p>
                        <p><i>{ training_set.exp }</i></p>
                    </div>
                    <button class="training-check-box" onclick={() => {
                        training_set.completed = !training_set.completed;
                        if (training_set.completed) {
                            addSkillExp(training_set.exp);   //exp 증가
                        } else {
                            addSkillExp(-training_set.exp);  //exp 감소
                        }
                    }}>
                        {#if !day_reset && training_set.completed}
                            <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
                                <path d="m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z"/>
                            </svg>                    
                        {/if}
                    </button>
                </li>
                {/each}
            </ul>
        </div>

        <div class="streak grid-item">
            <h3>To do at Morning</h3>
            <div class="streak-progress-bar" style="margin: 10px;">
                <div class="progress" style="background: linear-gradient(to right, #fff200, #eae999); width: 60%;"></div>
            </div>
        </div>
        {/if}

        <!-- Mission Left List -->
        {#if skill.mission_list}
        <h2 class="title">Left List</h2>
        {#each skill.mission_list as mission}
            <div class="left-set grid-item">
                <div class="left-name">
                    <p>{mission.name}</p>
                </div>
                <div class="streak left-streak">
                    <div class="streak-progress-bar" style="margin: 10px;">
                        <div class="progress" style="background: linear-gradient(to top, #d8b7d6, #fa23e8); width: 70%;"></div>
                    </div>
                    <p>{ calculateDDay(mission.time_limit) } left</p>
                </div>
            </div>
        {/each}
        {/if}

        <!-- trophy -->
        {#if skill.trophies}
        <h2 class="title">Trophy</h2>
            {#each skill.trophies as trophy}
                <div class="trophy">
                    <img 
                    src={ getIconPathById(trophy.icon_id) } 
                    alt={ trophy.name }
                    style="aspect-ratio: 1; width: 100%;"
                    />
                    <div>
                        { trophy.name }
                    </div>
                </div>
            {/each}

        {/if}

        <!-- Main Values & Chart -->
        {#if skill.values}
        <div class="values-list grid-item-6">
            <h2>Main Values</h2>
            <ul>
                {#each  skill.values as value}
                    <li>{ value }</li>
                {/each}
            </ul>
        </div>
        <div class="my-score grid-item-6">
            <h2>My Score</h2>
            <div class="score-circle">
                <svg class="score-svg" viewBox="0 0 200 200">
                    <!-- Background Circle -->
                    <circle cx="100" cy="100" r="80" class="bg-circle"></circle>
                    <!-- Animated Score Circle -->
                    <circle cx="100" cy="100" r="80" class="progress-circle"></circle>
                </svg>
                <div class="score-text">
                    <span id="score-value">0</span>점
                </div>
            </div>
        </div>
        {/if}


        <!-- Breakthrough -->
        {#if skill.breakthrough}
        <h2 class="title">Breakthrough</h2>
        {#each skill.breakthrough as box}
            <div class="breakthrough-box">
                <div class="breakthrough-square">
                    <div class="breakthrough-stars stars">
                        {#each Array.from({ length: box.grade[0] }) as _, i}
                            <!-- 보라색 별 -->
                            <svg class="star purple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                            </svg>
                        {/each}
                        {#each Array.from({ length: box.grade[1] }) as _, i}
                            <!-- 노란색 별 -->
                            <svg class="star yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
                            </svg>
                        {/each}
                    
                    </div>
                    <p>{ box.name }</p>
                </div>
                <div class="buttons">
                    <button>Start</button>
                    <button>Details</button>
                </div>
            </div>
        {/each}
        {/if}
        
        
        <!-- Achievement List -->
        {#if skill.achievement_list}
        <h2 class="title">Achievement List</h2>
            
        <div class="achievement-item">
            <div class="achievement-logo">🏆</div>
            <h3 class="achievement-name">모든 장, 단조 스케일 miss 없이 1회</h3>
            <div class="achievement-details">
                <div class="achievement-belonging">하농 연습</div>
                <p>Time limit : 2024-11-20 (<b>5 days</b> left) </p>
            </div>
        </div>
        <div class="achievement-item">
            <div class="achievement-logo">🏆</div>
            <div class="achievement-details">
                <p>Name: Achievement 1</p>
                <p>Objective: Complete X</p>
                <p>Time Limit: 2 Days</p>
            </div>
        </div>
        <div class="achievement-item">
            <div class="logo">🏆</div>
            <div class="details">
                <p>Name: Achievement 1</p>
                <p>Objective: Complete X</p>
                <p>Time Limit: 2 Days</p>
            </div>
        </div>
        {/if}


        <!-- Edit Button -->
        <div class="edit-button">
            <button onclick={() => {editMode = true}}>Edit</button>
        </div>

    </main>
    {/if}
</div>


<style>
    #skill_detail {
        display: block;
        position: fixed;
        top: 50%;
        left: 10%;
        width: 450px;
        /* width: 65%;
        min-width: 400px; */
        height: 80%;
        transform: translateY(-50%);
        background: white;
        /* border: 2px solid black; */
        z-index: 1100;
        border-radius: 4%;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
        overflow-y: scroll; /* 수직 스크롤 활성화 */
        overflow-x: hidden;
    }
</style>