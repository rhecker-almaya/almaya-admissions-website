# Advisor booking widget — how it works

`wise-booking.js` renders Almaya's own booking UI on advisor profile pages and
talks to the Wise public API directly. No Wise-branded page, no iframe.

## Turning on card payments

Right now the widget does **not** create bookings. Online payments are switched
off on the Wise account, and Wise's API expresses that by accepting the booking
without asking for money (`{"paymentRequired": false}`) — which would mean free
sessions. So until payments are enabled, the last step emails
info@almayaadmissions.com instead.

Once Stripe / online payments are enabled in Wise, switch the widget over by
adding `data-payments="on"` to the `<x-import>` tag on each profile page:

    <x-import component-from-global-scope="wise-booking" from="./wise-booking.js"
      data-class-id="..." data-advisor-first="Neva" data-payments="on" ...>

With that flag on, the widget requires a real checkout URL back from Wise and
shows an error if it doesn't get one. It will never show a success screen
without payment.

## Endpoints used

All on `https://na-api.wiseapp.live`, no auth token, but these headers are
**required** — without them every call returns "Course not found!":

    x-api-key: web:aff7589260fd9f8ba437674d25225728
    x-wise-namespace: almaya-admissions
    x-wise-platform: web

- `GET  /public/classes/{classId}?showClassroomFee=true&…` — session options, prices, slot duration, cancellation note
- `GET  /public/getClassroomSlots?classId=…&month=MM-YYYY&duration=60` — open slots.
  `slotDetails.availableSlots[].d` is a **seconds offset from `slotDetails.tsStart`**.
  Do not pass `teacherId` — the courses are owned by Eitan's account, so the
  course owner is not the advisor and Wise rejects it as "Invalid instructor id".
- `POST /public/classes/{id}/checkTeacherAvailabilityForSessions` — confirms the slot
  and returns the **real** instructor id, which is what the booking must use
- `POST /public/classes/{id}/validateCouponCode` — discount codes
- `POST /public/classes/{id}/initiateFeePayment` — creates the booking and should
  return a Stripe checkout URL. **This call books the session**, so it only runs
  when `data-payments="on"`.

## Per-advisor setup

`data-class-id` is the 24-character id at the end of the advisor's course URL,
e.g. `…/college-guidance-with-neva-6a87ba5cb4e29eabca568d91`.

Each course needs slot booking configured in Wise (a session duration set).
Arianna's course currently returns "The slot duration does not match the demo
duration" because hers has none.
