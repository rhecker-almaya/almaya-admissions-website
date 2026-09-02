/* Almaya booking widget — native UI over Wise public API.
   <wise-booking class-id="..." advisor-name="Neva" advisor-first="Neva"></wise-booking> */
(function () {
  const API = 'https://na-api.wiseapp.live';
  const NAMESPACE = 'almaya-admissions';
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
  const HEADERS = {
    accept: 'application/json, text/plain, */*',
    'x-api-key': 'web:aff7589260fd9f8ba437674d25225728',
    'x-wise-namespace': NAMESPACE,
    'x-wise-platform': 'web',
    'x-wise-timezone': TZ
  };

  const money = a => a ? '$' + (a.value / 100).toLocaleString('en-US', { minimumFractionDigits: a.value % 100 ? 2 : 0, maximumFractionDigits: 2 }) : '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const monthParam = d => String(d.getMonth() + 1).padStart(2, '0') + '-' + d.getFullYear();

  async function get(path) {
    const r = await fetch(API + path, { headers: HEADERS });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j) throw new Error((j && j.message) || ('Request failed (' + r.status + ')'));
    return j.data;
  }
  async function post(path, body) {
    const r = await fetch(API + path, {
      method: 'POST',
      headers: Object.assign({ 'content-type': 'application/json' }, HEADERS),
      body: JSON.stringify(body)
    });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j) { const e = new Error((j && j.message) || ('Request failed (' + r.status + ')')); e.payload = j; throw e; }
    return j.data;
  }

  const CSS = `
  .wb{font-family:var(--font-sans-body,'Jost',system-ui,sans-serif);color:var(--charcoal,#2E2A26);text-align:left}
  .wb *{box-sizing:border-box}
  .wb-steps{display:flex;gap:8px;align-items:center;margin-bottom:22px;flex-wrap:wrap}
  .wb-step{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted,#6F6A63)}
  .wb-step b{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:999px;background:var(--sand-100,#EFE7D7);color:var(--forest-900,#17392F);font-size:12px;font-weight:600}
  .wb-step.on{color:var(--forest-900,#17392F);font-weight:500}
  .wb-step.on b{background:var(--copper,#B85C3D);color:#fff}
  .wb-step.done b{background:var(--forest-900,#17392F);color:#fff}
  .wb-sep{flex:1;min-width:12px;height:1px;background:var(--border-subtle,rgba(46,42,38,.14))}
  .wb-h{font-family:var(--font-serif-display,'Cormorant',Georgia,serif);font-size:24px;color:var(--forest-900,#17392F);margin:0 0 4px}
  .wb-sub{font-size:14.5px;color:var(--text-muted,#6F6A63);margin:0 0 18px}
  .wb-plans{display:grid;gap:12px}
  .wb-plan{display:flex;justify-content:space-between;align-items:center;gap:16px;width:100%;padding:18px 20px;background:#fff;border:1px solid var(--border-subtle,rgba(46,42,38,.14));border-radius:6px;cursor:pointer;text-align:left;font:inherit;color:inherit;transition:border-color .15s,box-shadow .15s}
  .wb-plan:hover{border-color:var(--copper,#B85C3D)}
  .wb-plan[aria-pressed=true]{border-color:var(--copper,#B85C3D);box-shadow:0 0 0 1px var(--copper,#B85C3D)}
  .wb-plan-t{display:block;font-size:16px;font-weight:500;color:var(--forest-900,#17392F)}
  .wb-plan-d{display:block;font-size:13.5px;color:var(--text-muted,#6F6A63);margin-top:3px}
  .wb-plan-p{font-family:var(--font-serif-display,'Cormorant',Georgia,serif);font-size:22px;color:var(--forest-900,#17392F);white-space:nowrap}
  .wb-cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .wb-cal-m{font-size:15px;font-weight:500;color:var(--forest-900,#17392F)}
  .wb-nav{display:flex;gap:6px}
  .wb-ico{width:32px;height:32px;border-radius:4px;border:1px solid var(--border-subtle,rgba(46,42,38,.14));background:#fff;cursor:pointer;font-size:15px;line-height:1;color:var(--forest-900,#17392F)}
  .wb-ico:disabled{opacity:.35;cursor:default}
  .wb-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
  .wb-dow{text-align:center;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted,#6F6A63);padding-bottom:6px}
  .wb-day{aspect-ratio:1;min-height:38px;border:1px solid transparent;border-radius:4px;background:transparent;font:inherit;font-size:14px;color:var(--text-muted,#6F6A63);cursor:default}
  .wb-day.open{background:#fff;border-color:var(--border-subtle,rgba(46,42,38,.14));color:var(--forest-900,#17392F);cursor:pointer;font-weight:500}
  .wb-day.open:hover{border-color:var(--copper,#B85C3D)}
  .wb-day[aria-pressed=true]{background:var(--forest-900,#17392F);border-color:var(--forest-900,#17392F);color:var(--ivory,#F7F3EA)}
  .wb-times{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;margin-top:18px;max-height:210px;overflow:auto;padding-right:2px}
  .wb-time{padding:10px 8px;border:1px solid var(--border-subtle,rgba(46,42,38,.14));border-radius:4px;background:#fff;font:inherit;font-size:14px;color:var(--forest-900,#17392F);cursor:pointer}
  .wb-time:hover{border-color:var(--copper,#B85C3D)}
  .wb-time[aria-pressed=true]{background:var(--copper,#B85C3D);border-color:var(--copper,#B85C3D);color:#fff}
  .wb-tz{font-size:12.5px;color:var(--text-muted,#6F6A63);margin-top:12px}
  .wb-field{display:block;margin-bottom:14px}
  .wb-field span{display:block;font-size:13px;color:var(--forest-900,#17392F);margin-bottom:5px}
  .wb-field input{width:100%;padding:11px 13px;border:1px solid var(--border-subtle,rgba(46,42,38,.14));border-radius:4px;background:#fff;font:inherit;font-size:15px;color:var(--charcoal,#2E2A26)}
  .wb-field input:focus{outline:none;border-color:var(--copper,#B85C3D)}
  .wb-row{display:flex;gap:8px;align-items:flex-end}
  .wb-row .wb-field{flex:1;margin-bottom:0}
  .wb-summary{background:var(--sand-100,#EFE7D7);border-radius:6px;padding:16px 18px;margin:18px 0;font-size:14.5px}
  .wb-line{display:flex;justify-content:space-between;gap:12px;padding:3px 0}
  .wb-line.total{border-top:1px solid rgba(46,42,38,.14);margin-top:8px;padding-top:9px;font-weight:600;color:var(--forest-900,#17392F)}
  .wb-actions{display:flex;gap:10px;align-items:center;margin-top:22px;flex-wrap:wrap}
  .wb-btn{padding:13px 28px;border:0;border-radius:4px;background:var(--copper,#B85C3D);color:#fff;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
  .wb-btn:hover{background:var(--copper-600,#9E4B2F)}
  .wb-btn:disabled{opacity:.45;cursor:default}
  .wb-ghost{padding:13px 20px;border:1px solid var(--border-subtle,rgba(46,42,38,.14));border-radius:4px;background:transparent;color:var(--forest-900,#17392F);font:inherit;font-size:15px;cursor:pointer}
  .wb-msg{font-size:14px;padding:12px 14px;border-radius:4px;margin-top:14px}
  .wb-err{background:#FBEDE8;color:#8C3A1E}
  .wb-ok{background:#E9F0EA;color:var(--forest-900,#17392F)}
  .wb-skel{height:14px;border-radius:3px;background:linear-gradient(90deg,rgba(46,42,38,.07),rgba(46,42,38,.13),rgba(46,42,38,.07));background-size:200% 100%;animation:wbsh 1.2s infinite}
  @keyframes wbsh{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @media (max-width:560px){.wb-plan{flex-direction:column;align-items:flex-start;gap:8px}.wb-times{grid-template-columns:repeat(auto-fill,minmax(88px,1fr))}}
  `;

  class WiseBooking extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      const at = n => this.getAttribute(n) || this.getAttribute('data-' + n);
      this.classId = at('class-id');
      this.first = at('advisor-first') || at('advisor-name') || 'your advisor';
      this.payments = /^(on|true|1|yes)$/i.test(at('payments') || '');
      this.contact = at('contact-email') || 'info@almayaadmissions.com';
      this.state = { step: 0, loading: true, error: '', plan: null, month: new Date(), slotsByDay: {}, day: null, slot: null, duration: 60, coupon: null, couponMsg: '', busy: false };
      if (!document.getElementById('wb-css')) {
        const s = document.createElement('style'); s.id = 'wb-css'; s.textContent = CSS; document.head.appendChild(s);
      }
      this.className = 'wb';
      this.render();
      this.load();
    }

    async load() {
      try {
        const d = await get('/public/classes/' + this.classId + '?populateInstitute=true&showClassroomFee=true&showTeacherPublicProfile=true&populateCoTeacher=true&showRegistrationForm=true');
        this.classroom = d.classroom || {};
        this.teacherId = (this.classroom.userId && this.classroom.userId._id) || null;
        this.options = ((d.classFees || {}).paymentOptions) || [];
        const sb = ((this.classroom.settings || {}).studentSlotBooking) || {};
        this.durations = (sb.slotDurations && sb.slotDurations.length) ? sb.slotDurations : null;
        this.state.duration = this.durations ? this.durations[0] : null;
        this.cancellationNote = sb.cancellationPolicyNote || '';
        this.state.plan = this.options.find(o => o.type === 'PAYG_PREPAID') || this.options[0] || null;
        this.state.loading = false;
        this.render();
        this.loadSlots();
      } catch (e) {
        this.state.loading = false;
        this.state.error = e.message || 'Could not load availability.';
        this.render();
      }
    }

    async loadSlots() {
      const m = monthParam(this.state.month);
      this.state.slotsLoading = true; this.render();
      try {
        let q = '/public/getClassroomSlots?classId=' + this.classId + '&month=' + m;
        if (this.state.duration) q += '&duration=' + this.state.duration;
        const d = await get(q);
        const sd = d.slotDetails || {};
        if (!this.state.duration) {
          const dur = ((d.classroom || d.demoRoom || {}).durations || [])[0];
          if (dur) this.state.duration = dur;
        }
        const base = new Date(sd.tsStart);
        const by = {};
        (sd.availableSlots || []).forEach(s => {
          const start = new Date(base.getTime() + s.d * 1000);
          const k = ymd(start);
          (by[k] = by[k] || []).push({ d: s.d, start });
        });
        Object.values(by).forEach(a => a.sort((x, y) => x.start - y.start));
        this.state.slotsByDay = by;
        this.state.slotsLoading = false;
        this.render();
      } catch (e) {
        this.state.slotsLoading = false;
        this.state.error = e.message || 'Could not load availability.';
        this.render();
      }
    }

    planLabel(o) {
      if (!o) return '';
      if (o.type === 'PACKAGE') {
        const c = (o.metadata || {}).sessionCredits;
        return c ? c + ' sessions, booked as you go' : 'Package';
      }
      return 'Single ' + (this.state.duration || 60) + '-minute session';
    }
    planAmount(o) { return o && o.metadata && o.metadata.amount ? o.metadata.amount : null; }

    total() {
      const a = this.planAmount(this.state.plan);
      if (!a) return null;
      const disc = this.state.coupon ? this.state.coupon.discountAmount.value : 0;
      return { value: Math.max(0, a.value - disc), currency: a.currency };
    }

    async applyCoupon(code) {
      const a = this.planAmount(this.state.plan);
      if (!code || !a) return;
      this.state.couponMsg = 'Checking…'; this.render();
      try {
        const d = await post('/public/classes/' + this.classId + '/validateCouponCode', { couponCode: code, amount: a });
        if (d && d.valid) {
          this.state.coupon = { code, discountAmount: d.discountAmount, description: (d.coupon || {}).description || '' };
          this.state.couponMsg = '';
        } else { this.state.coupon = null; this.state.couponMsg = 'That code is not valid.'; }
      } catch (e) { this.state.coupon = null; this.state.couponMsg = e.message || 'That code is not valid.'; }
      this.render();
    }

    slotPayload() {
      const s = this.state.slot;
      if (!s) return null;
      const end = new Date(s.start.getTime() + (this.state.duration || 60) * 60000);
      return { d: s.d, scheduledStartTime: s.start.toISOString(), scheduledEndTime: end.toISOString() };
    }

    async submit(name, email) {
      const slot = this.slotPayload();
      if (!this.payments) { this.request(name, email); return; }
      this.state.busy = true; this.state.error = ''; this.render();
      try {
        const av = await post('/public/classes/' + this.classId + '/checkTeacherAvailabilityForSessions', { sessions: [slot] });
        const free = (av.availability || []).filter(a => a.availableSessions > 0);
        if (!free.length) throw new Error('That time was just taken. Please choose another.');
        const teacherId = (free[0].userId && free[0].userId._id) || this.teacherId;
        const body = {
          name: name, email: email, namespace: NAMESPACE,
          classroomData: {
            paymentOptionId: this.state.plan._id,
            teacherId: teacherId,
            sessionBooking: { slots: [slot] }
          },
          answers: [{ questionId: 'user_name', answer: name }, { questionId: 'user_email', answer: email }],
          returnURL: location.href,
          timezone: TZ
        };
        if (this.state.coupon) body.couponCode = this.state.coupon.code;
        const d = await post('/public/classes/' + this.classId + '/initiateFeePayment', body);
        const url = d && (d.paymentLink || d.url || d.checkoutUrl || d.redirectUrl || (d.payment && d.payment.url));
        if (url) { location.href = url; return; }
        this.state.busy = false;
        this.state.error = (d && d.paymentRequired === false)
          ? 'Wise accepted the booking but did not ask for payment, which means online payments are still switched off on this course. Nothing has been charged — please email ' + this.contact + ' to confirm.'
          : 'Checkout did not open. Nothing has been charged. Please email ' + this.contact + ' and we will confirm this time for you.';
        this.render();
      } catch (e) {
        this.state.busy = false;
        const m = e.message || 'Something went wrong.';
        this.state.error = /not being accepted/i.test(m)
          ? 'Online payments are turned off on this course in Wise, so checkout can\'t open. Please email info@almayaadmissions.com and we\'ll book this time for you.'
          : m;
        this.render();
      }
    }

    request(name, email) {
      const s = this.state.slot;
      const when = s.start.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      const body = ['Name: ' + name, 'Email: ' + email, 'Advisor: ' + this.first,
        'Session: ' + this.state.plan.title + ' (' + money(this.planAmount(this.state.plan)) + ')',
        'Requested time: ' + when + ' (' + TZ + ')'].join('\n');
      this.requestLink = 'mailto:' + this.contact + '?subject=' + encodeURIComponent('Session request — ' + this.first + ' — ' + name) + '&body=' + encodeURIComponent(body);
      this.state.requested = { name: name, when: when };
      this.render();
      try { window.location.href = this.requestLink; } catch (e) {}
    }

    go(n) { this.state.step = n; this.state.error = ''; this.render(); }

    render() {
      const s = this.state;
      if (s.loading) {
        this.innerHTML = '<div style="display:grid;gap:10px"><div class="wb-skel" style="width:40%"></div><div class="wb-skel" style="width:70%"></div><div class="wb-skel" style="height:70px"></div><div class="wb-skel" style="height:70px"></div></div>';
        return;
      }
      if (s.requested) {
        this.innerHTML = '<h3 class="wb-h">Request sent</h3>' +
          '<p class="wb-sub">We\'ve opened an email to ' + esc(this.contact) + ' with your details and ' + esc(s.requested.when) +
          '. Send it and we\'ll confirm the session and payment directly. Nothing has been charged.</p>' +
          '<div class="wb-actions"><a class="wb-btn" style="text-decoration:none" href="' + esc(this.requestLink) + '">Open the email again</a></div>';
        return;
      }
      if (s.done) {
        this.innerHTML = '<h3 class="wb-h">Booking started</h3><p class="wb-sub">Check your email for confirmation from Almaya Admissions.</p>';
        return;
      }
      const steps = ['Session', 'Time', 'Details'];
      let h = '<div class="wb-steps">';
      steps.forEach((t, i) => {
        h += (i ? '<div class="wb-sep"></div>' : '') +
          '<div class="wb-step ' + (i === s.step ? 'on' : i < s.step ? 'done' : '') + '"><b>' + (i < s.step ? '✓' : i + 1) + '</b>' + t + '</div>';
      });
      h += '</div>';

      if (s.step === 0) {
        h += '<h3 class="wb-h">Choose your session</h3><p class="wb-sub">Book directly with ' + esc(this.first) + '.' + (this.payments ? ' Payment is handled securely at checkout.' : '') + '</p><div class="wb-plans">';
        this.options.forEach(o => {
          h += '<button class="wb-plan" data-plan="' + o._id + '" aria-pressed="' + (s.plan && s.plan._id === o._id) + '">' +
            '<span><span class="wb-plan-t">' + esc(o.title) + '</span><span class="wb-plan-d">' + esc(this.planLabel(o)) + '</span></span>' +
            '<span class="wb-plan-p">' + money(this.planAmount(o)) + '</span></button>';
        });
        h += '</div>';
        if (!this.options.length) h += '<div class="wb-msg wb-err">No session options are published for ' + esc(this.first) + ' yet.</div>';
        h += '<div class="wb-actions"><button class="wb-btn" data-next="1"' + (s.plan ? '' : ' disabled') + '>Choose a time</button></div>';
      }

      if (s.step === 1) {
        const m = s.month, today = new Date(); today.setHours(0, 0, 0, 0);
        const first = new Date(m.getFullYear(), m.getMonth(), 1);
        const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
        const canBack = first > new Date(today.getFullYear(), today.getMonth(), 1);
        h += '<h3 class="wb-h">Pick a time</h3><p class="wb-sub">' + (s.duration || 60) + '-minute session with ' + esc(this.first) + '.</p>';
        h += '<div class="wb-cal-head"><div class="wb-cal-m">' + m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) +
          '</div><div class="wb-nav"><button class="wb-ico" data-mv="-1"' + (canBack ? '' : ' disabled') + '>‹</button><button class="wb-ico" data-mv="1">›</button></div></div>';
        h += '<div class="wb-grid">' + ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => '<div class="wb-dow">' + d + '</div>').join('');
        for (let i = 0; i < first.getDay(); i++) h += '<div></div>';
        for (let d = 1; d <= days; d++) {
          const dt = new Date(m.getFullYear(), m.getMonth(), d);
          const k = ymd(dt);
          const open = (s.slotsByDay[k] || []).some(x => x.start > new Date());
          h += '<button class="wb-day' + (open ? ' open' : '') + '" data-day="' + k + '" aria-pressed="' + (s.day === k) + '"' + (open ? '' : ' disabled') + '>' + d + '</button>';
        }
        h += '</div>';
        if (s.slotsLoading) h += '<div class="wb-skel" style="height:40px;margin-top:18px"></div>';
        else if (s.day) {
          const list = (s.slotsByDay[s.day] || []).filter(x => x.start > new Date());
          h += '<div class="wb-times">' + list.map(x =>
            '<button class="wb-time" data-slot="' + x.d + '" aria-pressed="' + (s.slot && s.slot.d === x.d) + '">' +
            x.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + '</button>').join('') + '</div>';
        } else if (!Object.keys(s.slotsByDay).length) {
          h += '<div class="wb-msg wb-ok">No open times this month. Try the next month.</div>';
        }
        h += '<div class="wb-tz">Times shown in ' + esc(TZ.replace(/_/g, ' ')) + '.</div>';
        h += '<div class="wb-actions"><button class="wb-ghost" data-next="0">Back</button><button class="wb-btn" data-next="2"' + (s.slot ? '' : ' disabled') + '>Continue</button></div>';
      }

      if (s.step === 2) {
        const a = this.planAmount(s.plan), t = this.total();
        h += '<h3 class="wb-h">Your details</h3><p class="wb-sub">We\'ll send confirmation here.</p>';
        h += '<label class="wb-field"><span>Full name</span><input id="wb-name" type="text" autocomplete="name" placeholder="Your name"></label>';
        h += '<label class="wb-field"><span>Email</span><input id="wb-email" type="email" autocomplete="email" placeholder="you@example.com"></label>';
        h += '<div class="wb-row"><label class="wb-field"><span>Discount code (optional)</span><input id="wb-coupon" type="text" placeholder="Code"></label><button class="wb-ghost" data-coupon="1">Apply</button></div>';
        if (s.couponMsg) h += '<div class="wb-msg wb-err">' + esc(s.couponMsg) + '</div>';
        h += '<div class="wb-summary"><div class="wb-line"><span>' + esc(s.plan.title) + '</span><span>' + money(a) + '</span></div>';
        h += '<div class="wb-line"><span>' + s.slot.start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' at ' +
          s.slot.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + '</span><span>' + (s.duration || 60) + ' min</span></div>';
        if (s.coupon) h += '<div class="wb-line"><span>' + esc(s.coupon.description || s.coupon.code) + '</span><span>−' + money(s.coupon.discountAmount) + '</span></div>';
        h += '<div class="wb-line total"><span>Total</span><span>' + money(t) + '</span></div></div>';
        if (this.cancellationNote) h += '<div style="font-size:12.5px;color:var(--text-muted,#6F6A63);white-space:pre-line;margin-bottom:6px">' + esc(this.cancellationNote) + '</div>';
        if (!this.payments) h += '<div class="wb-msg wb-ok">Card payment isn\'t switched on yet, so we\'ll confirm this time and take payment directly. Nothing is charged now.</div>';
        h += '<div class="wb-actions"><button class="wb-ghost" data-next="1">Back</button><button class="wb-btn" data-pay="1"' + (s.busy ? ' disabled' : '') + '>' + (s.busy ? 'Working…' : (this.payments ? 'Continue to payment' : 'Request this time')) + '</button></div>';
      }

      if (s.error) h += '<div class="wb-msg wb-err">' + esc(s.error) + '</div>';
      this.innerHTML = h;
      this.wire();
    }

    wire() {
      this.querySelectorAll('[data-plan]').forEach(b => b.onclick = () => {
        this.state.plan = this.options.find(o => o._id === b.dataset.plan);
        this.state.coupon = null; this.render();
      });
      this.querySelectorAll('[data-next]').forEach(b => b.onclick = () => this.go(+b.dataset.next));
      this.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => {
        const d = new Date(this.state.month); d.setMonth(d.getMonth() + (+b.dataset.mv));
        this.state.month = d; this.state.day = null; this.state.slot = null; this.loadSlots();
      });
      this.querySelectorAll('[data-day]').forEach(b => b.onclick = () => {
        this.state.day = b.dataset.day; this.state.slot = null; this.render();
      });
      this.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => {
        const list = this.state.slotsByDay[this.state.day] || [];
        this.state.slot = list.find(x => String(x.d) === b.dataset.slot);
        this.render();
      });
      const cb = this.querySelector('[data-coupon]');
      if (cb) cb.onclick = () => this.applyCoupon((this.querySelector('#wb-coupon').value || '').trim());
      const pay = this.querySelector('[data-pay]');
      if (pay) pay.onclick = () => {
        const n = (this.querySelector('#wb-name').value || '').trim();
        const e = (this.querySelector('#wb-email').value || '').trim();
        if (!n) { this.state.error = 'Please enter your name.'; return this.render(); }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { this.state.error = 'Please enter a valid email.'; return this.render(); }
        this.submit(n, e);
      };
    }
  }
  if (!customElements.get('wise-booking')) customElements.define('wise-booking', WiseBooking);
})();
