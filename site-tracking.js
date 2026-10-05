// Almaya — all ad/analytics pixels in one place. Loaded in <head> of every page:
//   <script src="site-tracking.js"></script>
// Conversion pages add one line after it, e.g. the thank-you page:
//   <script>amTrack.booking();</script>
// To add/remove a pixel or turn off OpenAI debug mode, edit only this file.
(() => {
  if (window.__amTracking) return;
  window.__amTracking = true;

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

  window.amTrack = {
    // Free consultation booked (thank-you page)
    booking() {
      fbq('track', 'Schedule');
      oaiq("measure","appointment_scheduled",{type:"customer_action"});
    },
  };
})();
