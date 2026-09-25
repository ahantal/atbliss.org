/* ==========================================================================
   @ Bliss event data: THE ONE PLACE TO CHANGE A SESSION'S DATE, TIME, OR ZOOM.

   Every page reads its session from here, and computes the visible date and
   time (in English or Turkish), hidden form fields, registration cutoffs, and
   Google / Apple / Outlook calendar links from it. Nothing else to edit.

   start:   the session start as an exact moment in UTC (ends in "Z").
            Example: 6:30 PM New York (EST, UTC-5) = 23:30 UTC.
   minutes: total length of the session.
   zoom:    only for pages that gate the Zoom link behind registration.
            Stored base64-encoded (obscurity, not security).

   After changing a session here, also update that form's Web3Forms auto-reply
   (date, time, Zoom link) in the Web3Forms dashboard.
   ========================================================================== */
window.ATBLISS_EVENTS = {

  /* English /breathwork session: Tuesday, November 17, 2026, 6:30 to 8:00 PM ET */
  'breathwork-en': {
    title: '@ Bliss | Somatic Breathwork Session',
    start: '2026-11-17T23:30:00Z',
    minutes: 90
  },

  /* Turkish /tr/breathwork session: Wednesday, November 18, 2026, 21:00 to 22:30 TSİ */
  'breathwork-tr': {
    title: '@ Bliss | Somatik Nefes Çalışması Seansı',
    start: '2026-11-18T18:00:00Z',
    minutes: 90
  },

  /* Come Breathe With Me (English and Turkish pages share this):
     Monday, September 28, 2026, 9:00 PM Türkiye = 2:00 PM ET */
  'cbwm': {
    title: 'Come Breathe With Me',
    start: '2026-09-28T18:00:00Z',
    minutes: 90,
    zoom: 'aHR0cHM6Ly91czA2d2ViLnpvb20udXMvai84NzI4NTQ1MjAyOT9wd2Q9R1FrMlBPaXpUc2Z4MHVuaDNDZjRRa1dvcTdkUUJMLjE='
  }

};
