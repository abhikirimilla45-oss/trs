const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();
$('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(a => a.addEventListener('click', () => $('#mainNav').classList.remove('open')));

// Demo-only search for the sample activity cards.
$('#activitySearch').addEventListener('input', (event) => {
  const term = event.target.value.trim().toLowerCase();
  let visible = 0;
  $$('.activity-row').forEach(row => {
    const match = row.textContent.toLowerCase().includes(term);
    row.hidden = !match;
    if (match) visible++;
  });
  let empty = $('#activityEmpty');
  if (!visible) {
    if (!empty) {
      empty = document.createElement('div'); empty.id = 'activityEmpty'; empty.className = 'no-results';
      empty.textContent = 'No matching activity cards. Live records require the backend connection.';
      $('#activityList').append(empty);
    }
  } else if (empty) empty.remove();
});

// This prototype stores reports only in this browser's localStorage. It does NOT transmit reports to a server.
$('#issueForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const makeRef = () => 'ASB-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const issue = {
    reference: makeRef(), title: String(data.get('title') || '').trim(), category: String(data.get('category') || ''),
    date: String(data.get('date') || ''), mandal: String(data.get('mandal') || '').trim(), village: String(data.get('village') || '').trim(),
    description: String(data.get('description') || '').trim(), contact: String(data.get('contact') || '').trim(),
    status: 'Submitted (demo)', createdAt: new Date().toISOString()
  };
  try {
    const records = JSON.parse(localStorage.getItem('trsAsifabadDemoIssues') || '[]');
    records.unshift(issue); localStorage.setItem('trsAsifabadDemoIssues', JSON.stringify(records));
    const confirmation = $('#issueConfirmation');
    confirmation.hidden = false;
    confirmation.textContent = `Demo submission saved in this browser. Reference: ${issue.reference}. This is not sent to the party or any public authority. Do not use this prototype for urgent or official complaints.`;
    form.reset();
    confirmation.scrollIntoView({behavior:'smooth', block:'nearest'});
  } catch (err) {
    const confirmation = $('#issueConfirmation'); confirmation.hidden = false;
    confirmation.textContent = 'This browser could not save the demo submission. No report was sent to a server.';
  }
});
