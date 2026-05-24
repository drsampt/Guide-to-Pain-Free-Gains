/**
 * Lead Magnet Funnel — Form Handler
 *
 * Flow:
 *  1. Client-side validation
 *  2. POST lead data to FORM_ENDPOINT (Zapier webhook → Slack #leads)
 *  3. Show success → redirect to /access.html
 *
 * SETUP: Replace FORM_ENDPOINT with your Zapier Catch Hook URL.
 * See README.md for step-by-step instructions.
 */

const FORM_ENDPOINT = 'REPLACE_WITH_ZAPIER_WEBHOOK_URL';

// ─── DOM REFS ────────────────────────────────────────────────
const form       = document.getElementById('leadForm');
const submitBtn  = document.getElementById('submitBtn');
const successEl  = document.getElementById('formSuccess');
const errorMsgEl = document.getElementById('formErrorMsg');

const fields = {
  firstName: { el: document.getElementById('firstName'), errEl: document.getElementById('firstNameError') },
  lastName:  { el: document.getElementById('lastName'),  errEl: document.getElementById('lastNameError')  },
  email:     { el: document.getElementById('email'),     errEl: document.getElementById('emailError')     },
  phone:     { el: document.getElementById('phone'),     errEl: document.getElementById('phoneError')     },
};

// ─── PHONE FORMAT ────────────────────────────────────────────
fields.phone.el.addEventListener('input', (e) => {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) { e.target.value = ''; return; }
  if (digits.length <= 3)  { e.target.value = `(${digits}`; return; }
  if (digits.length <= 6)  { e.target.value = `(${digits.slice(0,3)}) ${digits.slice(3)}`; return; }
  e.target.value = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
});

// ─── REAL-TIME ERROR CLEARING ────────────────────────────────
Object.values(fields).forEach(({ el, errEl }) => {
  el.addEventListener('input', () => {
    el.classList.remove('error-field');
    errEl.textContent = '';
  });
});

// ─── VALIDATION ──────────────────────────────────────────────
function validateForm(data) {
  let valid = true;

  if (!data.firstName || data.firstName.trim().length < 2) {
    setError('firstName', 'Please enter your first name.');
    valid = false;
  }
  if (!data.lastName || data.lastName.trim().length < 2) {
    setError('lastName', 'Please enter your last name.');
    valid = false;
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  }
  const digits = (data.phone || '').replace(/\D/g, '');
  if (digits.length < 10) {
    setError('phone', 'Please enter a valid 10-digit phone number.');
    valid = false;
  }

  return valid;
}

function setError(fieldName, message) {
  fields[fieldName].el.classList.add('error-field');
  fields[fieldName].errEl.textContent = message;
}

// ─── SLACK MESSAGE ────────────────────────────────────────────
function buildSlackMessage(data, timestamp) {
  return {
    text: `🎯 *New Lead Captured*\n*Name:* ${data.firstName} ${data.lastName}\n*Email:* ${data.email}\n*Phone:* ${data.phone}\n*Timestamp:* ${timestamp}\n*Source:* Lead Magnet Funnel`,
    firstName:  data.firstName,
    lastName:   data.lastName,
    email:      data.email,
    phone:      data.phone,
    timestamp:  timestamp,
    source:     'Lead Magnet Funnel',
  };
}

// ─── SUBMIT HANDLER ──────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous messages
  errorMsgEl.style.display = 'none';
  errorMsgEl.textContent   = '';

  const data = {
    firstName: fields.firstName.el.value.trim(),
    lastName:  fields.lastName.el.value.trim(),
    email:     fields.email.el.value.trim(),
    phone:     fields.phone.el.value.trim(),
  };

  if (!validateForm(data)) return;

  // Loading state
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  const timestamp = new Date().toLocaleString('en-US', {
    timeZone:    'America/Denver',
    month:       'short',
    day:         'numeric',
    year:        'numeric',
    hour:        'numeric',
    minute:      '2-digit',
    hour12:      true,
  }) + ' MT';

  const payload = buildSlackMessage(data, timestamp);

  try {
    if (!FORM_ENDPOINT || FORM_ENDPOINT === 'REPLACE_WITH_ZAPIER_WEBHOOK_URL') {
      // Dev/demo mode: log to console, redirect anyway
      console.log('Lead captured (dev mode — no endpoint configured):', payload);
      showSuccess();
      return;
    }

    const res = await fetch(FORM_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showSuccess();

  } catch (err) {
    console.error('Form submission error:', err);
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Give Me My Playbook';
    errorMsgEl.textContent = 'Something went wrong. Please try again.';
    errorMsgEl.style.display = 'block';
  }
});

function showSuccess() {
  successEl.style.display = 'block';
  submitBtn.style.display  = 'none';
  setTimeout(() => {
    window.location.href = 'access.html';
  }, 2000);
}

// ─── SCROLL ANIMATIONS ───────────────────────────────────────
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
