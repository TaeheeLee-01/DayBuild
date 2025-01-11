<script>
    import { onMount, onDestroy } from 'svelte';
    import { on } from 'svelte/events';

    import { getIconsByCategory, getAllCategories, getIconPathById } from '$lib/icon.js';

    let { skill, submit_data, submit_cancel } = $props(); //submit_data, submit_cancel는 콜백함수 : 이벤트 일어나면 이거 실행해!

    let updatedSkill = $state();
    updatedSkill = { ...skill };
    
    //아이콘 팝오버
    let showPopoverIndex = $state(-1);
    let selectedCategory = $state('trophy');

    // 팝오버 외부 클릭 감지
    function handleWindowClick(event) {
        if (showPopoverIndex != -1) {
            const popover = document.querySelector('.popover');
            if (popover && !popover.contains(event.target)) {
                showPopoverIndex = -1;
            }
        }
    }

    // 선택된 값에 따른 색상 매핑
    let colorMap = {
        fundamental: 'red',
        elementary: 'blue',
        'sub-class': 'green'
    };
    
    async function handleSubmit(event) {
        event.preventDefault();
        // 부모에게 받은 콜백함수 실행 - 테스트하기 위해 여기 놓기
        submit_data(updatedSkill);

        try {
            const response = await fetch('/api/skills', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: skill._id, // MongoDB 문서 ID
                    updatedFields: updatedSkill, // 수정된 데이터
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update skill');
            }

            const result = await response.json();
            console.log('Skill updated:', result);

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update skill.');
        }
    }

    // onMount(() => {
    //     updatedSkill.goals = updatedSkill.goals.map(goal => ({
    //         ...goal,
    //         time_limit: goal.time_limit ? goal.time_limit.split('T')[0] : '' // ISO 문자열 처리
    //     }));
    // });
</script>

<!-- popover 컨트롤 -->
<svelte:window onclick={handleWindowClick} />


<form onsubmit={handleSubmit}>
    <label>
        Name:
        <input type="text" bind:value={updatedSkill.name} />
    </label>

    <label>
        skill_class:
        <select bind:value={updatedSkill.skill_class} style="background-color: {colorMap[updatedSkill.skill_class]}" >
            <option value="fundamental">fundamental</option>
            <option value="elementary">elementary</option>
            <option value="sub-class">sub-class</option>
	    </select>
    </label>

    <label>
        Level:
        <input type="number" bind:value={updatedSkill.level} min="0" max="99" />
    </label>

    <label>
        EXP:
        <input type="number" bind:value={updatedSkill.exp} min="0" max="100" />
        <input type="range" bind:value={updatedSkill.exp} min="0" max="100" />
    </label>

    <label>
        Purple Star:
        <input type="number" bind:value={updatedSkill.star_grade[0]} min="0" max="10" />
        Yellow Star:
        <input type="number" bind:value={updatedSkill.star_grade[1]} min="0" max="10" />
    </label>

    <label>
        Description:
        <textarea bind:value={updatedSkill.description}></textarea>
    </label>

    <label>
        Values:
        {#each updatedSkill.values as value, i}
            <input type="text" bind:value={updatedSkill.values[i]} />
            <button
            type="button"
            class="delete-button"
            onclick={() => {updatedSkill.values.splice(i, 1);}}
            >
                ✖
            </button>
        {/each}
        <button type="button" onclick={() => {updatedSkill.values.push('');}}>Add Value</button>
    </label>

    <label>
        Goals:
        {#each updatedSkill.goals as goal, i}
            <input type="text" bind:value={updatedSkill.goals[i].name} />
            <input
                type="datetime-local"
                value={updatedSkill.goals[i].time_limit.slice(0, 16)} 
                onchange={(e) => {
                    updatedSkill.goals[i].time_limit = event.target.value + ':00.000Z';
                }}
            />
            {#each goal.values as value, j}
                <input type="text" bind:value={updatedSkill.goals[i].values[j]} />
                <button
                    type="button"
                    class="delete-button"
                    onclick={() => {updatedSkill.goals[i].values.splice(j, 1);}}
                >
                    ✖
                </button>
            {/each}
            <button type="button" onclick={() => {updatedSkill.goals[i].values.push('');}}>Add Value</button>
            <button
                type="button"
                class="delete-button"
                onclick={() => {updatedSkill.goals.splice(i, 1);}}
            >
                Delete Goal
            </button>
        {/each}
        <button type="button" onclick={() => {
            updatedSkill.goals.push({
            name : '',
            time_limit: new Date().toISOString(),
            values: ['']
            });
        }}>Add Goal</button>
    </label>

    <!-- 트로피 구현 -> 이거는 아이콘등을 카테고리로 불러와서 선택할 수 있게 하는 게 목표 -->

    <!-- 트로피까지 다하면 복붙한 다음에 스타일 적용해달라고 하기 -->

    <!-- 그리고 트로피는 나중에 트로피 전용 페이지 만들어서 svg 올릴 수 있고, 존나 화려한 이미지 포켓 뮤츠 나오는 느낌의 애니메이션으로! -->
    <!-- 전역 클릭 이벤트 감지 -->
    {#if updatedSkill.skill_class == "fundamental"}
    {#each updatedSkill.trophies as trophy, i}
    <div>
        Trophy:
        <button 
            type="button"
            class="trophy-icon-button"
            onclick={() => {
                if (showPopoverIndex !== i) {
                    event.stopPropagation(); // 부모 이벤트 전파 방지
                    showPopoverIndex = i;
                }
            }}
        >
            <img src={getIconPathById(trophy.icon_id)} alt={trophy.icon_id} />
        </button>

        <input type="text" bind:value={trophy.name}/>

        <button
            type="button"
            class="delete-thropy-button"
            onclick={() => {updatedSkill.trophies.splice(i, 1);}}
            >
                ✖
        </button>

        {#if showPopoverIndex == i}
            <div class="popover">
                <!-- 카테고리 필터 -->
                <div class="categories">
                    {#each getAllCategories() as category}
                        <button
                            type="button"
                            class:active={category === selectedCategory}
                            onclick={() => {selectedCategory = category}}
                        >
                            {category}
                        </button>
                    {/each}
                </div>

                <!-- 아이콘 목록 -->
                <div class="icons">
                    {#each getIconsByCategory(selectedCategory) as icon}
                        <button onclick={(event) => {
                            event.stopPropagation(); // 이벤트 버블링 중단
                            updatedSkill.trophies[i] = { ...trophy, icon_id: icon.id };
                            showPopoverIndex = -1; //닫기
                        }}>
                            <img
                            src={icon.svgPath}
                            alt={icon.name}
                            title={icon.name}
                            />
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        </div>
    {/each}
    <button
        type="button"
        onclick={() => {
        
        updatedSkill.trophies.push({
            name : '',
            icon_id : 'trophy-01',
            });
        }}
    >add Trophy</button>
    {/if}
    
    <button type="submit">Save</button>
    <button type="button" onclick={submit_cancel}>Cancel</button>
</form>


<style>
    form {
        display: flex;
        flex-direction: column;
        font-size: 1.1em;
    }

    label, div {
        padding: 10px 10px;
        border: 2px solid black;
    }

    .popover {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        padding: 1rem;
        max-width: 300px;
    }

    .popover img {
        width: 50px;
        height: 50px;
        margin: 5px;
        cursor: pointer;
    }

    .categories {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .categories button {
        background-color: #f0f0f0;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
    }

    .categories button.active {
        background-color: #007bff;
        color: white;
    }

    .trophy-icon-button img{
        width: 40px;
        height: 40px;
    }


</style>






<!-- 
{
    "id": "64fa2c93e6324b1234567890",
    "updatedFields": {
        "name": "Updated Piano Skill",
        "description": "This is the updated description for Piano.",
        "values": ["Focus", "Consistency", "Challenge"]
    }
}

{
    "message": "Skill updated successfully",
    "modifiedCount": 1
}

{ "error": "Skill not found" }

{ "error": "Failed to update skill" }

-->