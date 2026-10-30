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

  /* English /breathwork session: Tuesday, December 1, 2026, 6:30 to 8:00 PM ET */
  'breathwork-en': {
    title: '@ Bliss | Somatic Breathwork Session',
    start: '2026-12-01T23:30:00Z',
    minutes: 90,
    zoom: 'aHR0cHM6Ly91czA2d2ViLnpvb20udXMvai84NzA2NDg1OTU2Nj9wd2Q9ZGlJYURBMWV6ajVtTnFETmlXUTZ3aFZsU3BiSllxLjE='
  },

  /* Turkish /tr/breathwork session: Wednesday, November 25, 2026, 21:00 to 22:30 TSİ */
  'breathwork-tr': {
    title: '@ Bliss | Somatik Nefes Çalışması Seansı',
    start: '2026-11-25T18:00:00Z',
    minutes: 90,
    zoom: 'aHR0cHM6Ly91czA2d2ViLnpvb20udXMvai84MjMyMTQ3MTgyND9wd2Q9ME9qc1dvYzFYcVRqR2gwcXduUFh0aFhnU05XOHZ5LjE='
  },

  /* Come Breathe With Me (English and Turkish pages share this):
     Wednesday, November 25, 2026, 21:00 Türkiye = 13:00 ET */
  'cbwm': {
    title: 'Come Breathe With Me',
    start: '2026-11-25T18:00:00Z',
    minutes: 90,
    zoom: 'aHR0cHM6Ly91czA2d2ViLnpvb20udXMvai84MjMyMTQ3MTgyND9wd2Q9ME9qc1dvYzFYcVRqR2gwcXduUFh0aFhnU05XOHZ5LjE='
  }

};
