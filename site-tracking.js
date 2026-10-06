// Almaya — all ad/analytics pixels (Meta, OpenAI, Reddit) in one place. Loaded in <head> of every page:
//   <script src="site-tracking.js"></script>
// Conversion pages add one line after it, e.g. the thank-you page:
//   <script>amTrack.booking();</script>
// To add/remove a pixel or turn off OpenAI debug mode, edit only this file.
(() => {
  if (window.__amTracking) return;
  window.__amTracking = true;

  // Keep booking details (name, time, meeting link) out of pixel page URLs:
  // move them from the thank-you URL into sessionStorage before any pixel loads.
  const BOOK_KEYS = ['first_name', 'appointment_start_time', 'timezone', 'meeting_link'];
  let bookingSig = '';
  try {
    const q = new URLSearchParams(location.search);
    if (BOOK_KEYS.some(k => q.has(k))) {
      bookingSig = q.toString();
      sessionStorage.setItem('am_booking_qs', bookingSig);
      history.replaceState(null, '', location.pathname + location.hash);
    }
  } catch (e) {}

  // Meta Pixel
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1608113310765242');
  fbq('track', 'PageView');

  // OpenAI ads pixel (set debug:false once events show up in the OpenAI dashboard)
  !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
  oaiq("init",{pixelId:"4RHADdKze5Ch2eLcG44MdZ",debug:true});

  // Reddit Pixel (official base code, no advanced matching)
  !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
  rdt('init','a2_jmijmfk27r02');
  rdt('track','PageView');

  // Fires the Reddit conversion once per booking. Requires proof of a completed
  // booking (flag set by booking-modal.js on GHL's booking-complete message, or
  // GHL booking params in the URL); reloads and direct visits do nothing.
  function redditBookingOnce() {
    try {
      const pending = sessionStorage.getItem('am_booking_pending');
      if (!pending && !bookingSig) return;
      sessionStorage.removeItem('am_booking_pending');
      let h = 5381; const s = bookingSig || pending;
      for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
      const key = 'am_rdt_appt_' + (h >>> 0).toString(36);
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch (e) { return; }
    window.rdt?.("track", "Custom", { customEventName: "appointment_scheduled" });
  }

  window.amTrack = {
    // Free consultation booked (thank-you page)
    booking() {
      fbq('track', 'Schedule');
      oaiq("measure","appointment_scheduled",{type:"customer_action"});
      redditBookingOnce();
    },
  };
})();
