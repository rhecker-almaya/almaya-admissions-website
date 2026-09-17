# Direct advisor booking — parked, not live

As of Sept 2026 every advisor profile ends with **"Want to work with <Name>?" → "Get matched now"**,
which opens the shared free-consultation modal (`booking-modal.js`). Visitors do not pick a time
with a specific advisor on the site. This file records how direct booking worked so it can be
turned back on for one advisor (Neva first) or all of them later.

## What direct booking did

Each profile had a "Work With <Name>" button that opened a modal containing
`<wise-booking>` (`wise-booking.js`): a three-step flow — pick a session type → pick a date/time
from live Wise availability → enter name/email — all in Almaya's UI. Details (API headers, slot
offset decoding, instructor resolution, payments flag) are in `BOOKING.md`. `wise-booking.js` is
still in the repo, untouched and working.

## Per-advisor Wise ids

| Advisor | Wise class id | Course URL |
| --- | --- | --- |
| Neva Hidajat | `6a87ba5cb4e29eabca568d91` | https://learn.almayaadmissions.com/courses/college-guidance-with-neva-6a87ba5cb4e29eabca568d91 |
| Arianna Zarka | `6a87bac12e9f128e2e35e81c` | https://learn.almayaadmissions.com/courses/college-guidance-with-arianna-6a87bac12e9f128e2e35e81c |
| Arjun Jaswal | `6a87b76ab4e29eabca568192` | https://learn.almayaadmissions.com/courses/college-guidance-with-arjun-6a87b76ab4e29eabca568192 |
| Eitan Ginsburg | `6a87ba3ef1c854f803f917db` | https://learn.almayaadmissions.com/courses/college-guidance-with-eitan-6a87ba3ef1c854f803f917db |
| Gabriel Nagel | `6a87b45ab4e29eabca5676dc` | https://learn.almayaadmissions.com/courses/college-consulting-with-gabriel-6a87b45ab4e29eabca5676dc |
| Jacob Feit Mann | `6a87baac2e9f128e2e35e7dc` | https://learn.almayaadmissions.com/courses/college-guidance-with-jacob-6a87baac2e9f128e2e35e7dc |
| Joseph Schlesinger | `6a87ba9a8940d3b6653bd7ca` | https://learn.almayaadmissions.com/courses/college-guidance-with-joseph-6a87ba9a8940d3b6653bd7ca |
| Razi Hecker | `6a87ba448940d3b6653bd653` | https://learn.almayaadmissions.com/courses/college-guidance-with-razi-6a87ba448940d3b6653bd653 |
| Samantha Lofman | `6a87b30ef1c854f803f8fd47` | https://learn.almayaadmissions.com/courses/college-consulting-with-sami-6a87b30ef1c854f803f8fd47 |
| Sarah Rosen | `6a87ba488940d3b6653bd685` | https://learn.almayaadmissions.com/courses/college-guidance-with-sarah-6a87ba488940d3b6653bd685 |
| Jonathan Mizrahi | — none yet | — (used `Jon Booking.dc.html`) |

Known Wise-side gaps: Arianna's course has no session duration set (slot queries fail); Jonathan
has no course. Two test bookings ("Test Verifier", "ZZ IGNORE Verifier Test") should be deleted.

## How to turn it back on for one advisor (e.g. Neva)

In `Neva Hidajat Profile.dc.html`:

1. Replace the CTA block at the bottom of the profile card:

```html
<h2 style="font-family:var(--font-serif-display);font-size:26px;color:var(--forest-900);margin:0 0 4px">Work with Neva</h2>
<p style="font-size:15px;color:var(--text-muted);margin:0 0 12px;max-width:460px;margin-left:auto;margin-right:auto">Book directly with Neva for personalized college admissions guidance.</p>
<a href="https://learn.almayaadmissions.com/courses/college-guidance-with-neva-6a87ba5cb4e29eabca568d91" onClick="{{ onOpenBooking }}" class="am-btn am-btn--dark am-btn--md">Work With Neva</a>
<sc-if value="{{ bookingOpen }}" hint-placeholder-val="{{ false }}">
<div onClick="{{ onCloseBooking }}" style="position:fixed;inset:0;z-index:2000;background:rgba(23,57,47,0.72);display:flex;align-items:flex-start;justify-content:center;padding:32px 20px;overflow:auto">
<div onClick="{{ stopClose }}" style="position:relative;width:100%;max-width:640px;background:var(--ivory);border-radius:8px;box-shadow:0 24px 60px rgba(0,0,0,0.35);margin:auto;max-height:min(88vh,860px);display:flex;flex-direction:column;overflow:hidden">
<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 22px;border-bottom:1px solid var(--border-subtle)">
<span style="font-family:var(--font-serif-display);font-size:19px;color:var(--forest-900)">Book with Neva</span>
<a onClick="{{ onCloseBooking }}" style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:4px;border:1px solid var(--border-subtle);color:var(--forest-900);cursor:pointer;text-decoration:none;font-size:18px">×</a>
</div>
<div style="padding:22px;overflow-y:auto;flex:1 1 auto;min-height:0">
<x-import component-from-global-scope="wise-booking" from="./wise-booking.js" data-class-id="6a87ba5cb4e29eabca568d91" data-advisor-first="Neva" hint-size="100%,360px"></x-import>
</div>
</div>
</div>
</sc-if>
```

2. Replace the logic class at the bottom of the file:

```js
class Component extends DCLogic {
  state = { bookingOpen: false };
  componentDidMount() {
    this.onKey = e => { if (e.key === 'Escape') this.setState({ bookingOpen: false }); };
    window.addEventListener('keydown', this.onKey);
  }
  componentWillUnmount() { if (this.onKey) window.removeEventListener('keydown', this.onKey); }
  renderVals() {
    return {
      bookingOpen: this.state.bookingOpen,
      onOpenBooking: e => { if (e) e.preventDefault(); this.setState({ bookingOpen: true }); },
      onCloseBooking: () => this.setState({ bookingOpen: false }),
      stopClose: e => e.stopPropagation()
    };
  }
}
```

3. When online payments are enabled in Wise, add `data-payments="on"` to the `<x-import>` so the
   last step goes to Stripe checkout instead of emailing info@almayaadmissions.com.

Same recipe for any other advisor — swap the first name, class id, and course URL from the table.
