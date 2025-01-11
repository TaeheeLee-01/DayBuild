<script>
    //Components
    import Tree from './Tree.svelte';
    import Cursor from './Cursor.svelte';
    import SkillDetail from './SkillDetail.svelte';    
    
    let skill_name = $state('');
    let loading = $state(false);
    let error = $state(null);
    let skillData = $state();
    let skillFocusMode = $state(false);

    function letSkillFocus(mode) {
        if (mode) {
            skillFocusMode = true;
            const wrapper = document.querySelector('.wrapper');
            wrapper.style.display = 'contents';
            wrapper.firstChild.style.height = `${window.innerHeight - 60}px`; //일단 임시로 이렇게 하자. 네비게이션 60px 뺸거임
            wrapper.firstChild.style.overflow = 'auto';
        } else {
            skillFocusMode = false;
            const wrapper = document.querySelector('.wrapper');
            wrapper.style.display = 'block';
            wrapper.firstChild.style.height = '';
            wrapper.firstChild.style.overflow = '';
        }

    }

    async function fetchSkillData(name) {
        if (name) {
            if (!name.trim()) {
                throw new Error("Name do not exist");
            }
        } else {
            skillData = null;
            return;
        }

        loading = true;
        error = '';
        skillData = null;

        try {
            const res = await fetch(`/api/skills/${name}`);
            if (!res.ok) throw new Error('Skill not found');
            skillData = await res.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        fetchSkillData(skill_name);
    });

    // $inspect(skillData);
</script>

{#if !skillFocusMode}
<Tree bind:focus_skill={skill_name} />
{/if}

{#if error}
    <p class="error">{error}</p>
{:else if loading}
    <p>Loading...</p>
{:else if skillData}
    <SkillDetail skillData={skillData} letSkillFocus={letSkillFocus}/>
{/if}

<!-- <Cursor /> -->
