<script lang="ts">
  interface Student {
    id: number;
    name: string;
    email: string;
    grade: string;
  }

  interface Props {
    initialCount?: number;
  }

  let { initialCount = 0 }: Props = $props();

  let count = $state(initialCount);

  const students: Student[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@school.edu', grade: '10A' },
    { id: 2, name: 'Bob Smith', email: 'bob@school.edu', grade: '10B' },
    { id: 3, name: 'Carol Williams', email: 'carol@school.edu', grade: '11A' },
    { id: 4, name: 'David Brown', email: 'david@school.edu', grade: '9C' },
    { id: 5, name: 'Eve Davis', email: 'eve@school.edu', grade: '12A' },
    { id: 6, name: 'Frank Miller', email: 'frank@school.edu', grade: '10A' },
    { id: 7, name: 'Grace Wilson', email: 'grace@school.edu', grade: '11B' },
  ];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'];
</script>

<section>
  <h1>Hello from Students MFE</h1>
  <p>Federated Svelte component with local <code>$state</code> to prove interactivity through MF.</p>
  <button onclick={() => count++}>Clicked {count} times</button>

  <ul>
    {#each students as s, i (s.id)}
      <li>
        <span class="avatar" style="background: {colors[i % colors.length]}">
          {s.name.split(' ').map((n) => n[0]).join('')}
        </span>
        <div class="info">
          <div class="name">{s.name}</div>
          <div class="email">{s.email}</div>
        </div>
        <span class="grade">{s.grade}</span>
      </li>
    {/each}
  </ul>
</section>

<style>
  section { padding: 24px; font-family: system-ui, sans-serif; }
  h1 { margin: 0; color: #16a34a; }
  p { margin-top: 8px; color: #475569; }
  button {
    margin-top: 12px;
    padding: 8px 16px;
    background: #16a34a; color: white;
    border: 0; border-radius: 6px; cursor: pointer;
  }
  ul {
    margin-top: 24px; list-style: none; padding: 0;
    background: white; border: 1px solid #e2e8f0;
    border-radius: 10px; overflow: hidden; max-width: 640px;
  }
  li {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
  }
  li:last-child { border-bottom: none; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    color: white; display: inline-flex; align-items: center;
    justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;
  }
  .info { flex: 1; }
  .name { font-size: 14px; font-weight: 600; color: #0f172a; }
  .email { font-size: 12px; color: #64748b; }
  .grade {
    font-size: 12px; font-weight: 600; color: #475569;
    background: #f1f5f9; padding: 4px 10px; border-radius: 999px;
  }
</style>
