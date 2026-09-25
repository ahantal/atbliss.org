/* Helpers that turn an entry in events.js into text, form values, cutoffs, and
   calendar links. Pages mark where a date belongs with, for example:
     <span data-event="cbwm" data-tpl="{date-en}"></span>
     <input type="hidden" name="session_info" data-event="cbwm" data-tpl="{date-en}, {time-tr-en} Turkish Time ({time-et} ET)">
   and fill() writes the computed text (or value) in. No other copy of a date
   should exist in the page. */
(function () {
  var NY = 'America/New_York';
  var IST = 'Europe/Istanbul';

  function fmt(d, locale, tz, opts) {
    var o = { timeZone: tz };
    for (var k in opts) o[k] = opts[k];
    return new Intl.DateTimeFormat(locale, o).format(d);
  }

  /* Tokens usable inside data-tpl="..." */
  var TOKENS = {
    'date-en':     function (e) { return fmt(e.startDate, 'en-US', NY, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); },
    'weekday-en':  function (e) { return fmt(e.startDate, 'en-US', NY, { weekday: 'long' }); },
    'monthday-en': function (e) { return fmt(e.startDate, 'en-US', NY, { year: 'numeric', month: 'long', day: 'numeric' }); },
    'time-et':     function (e) { return fmt(e.startDate, 'en-US', NY, { hour: 'numeric', minute: '2-digit' }); },
    'end-et':      function (e) { return fmt(e.endDate, 'en-US', NY, { hour: 'numeric', minute: '2-digit' }); },
    'time-tr-en':  function (e) { return fmt(e.startDate, 'en-US', IST, { hour: 'numeric', minute: '2-digit' }); },
    'clock-tr-en': function (e) { return fmt(e.startDate, 'en-US', IST, { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/, ''); },
    'date-tr':     function (e) { return fmt(e.startDate, 'tr-TR', IST, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); },
    'weekday-tr':  function (e) { return fmt(e.startDate, 'tr-TR', IST, { weekday: 'long' }); },
    'monthday-tr': function (e) { return fmt(e.startDate, 'tr-TR', IST, { year: 'numeric', month: 'long', day: 'numeric' }); },
    'time-tr':     function (e) { return fmt(e.startDate, 'tr-TR', IST, { hour: '2-digit', minute: '2-digit' }); },
    'end-tr':      function (e) { return fmt(e.endDate, 'tr-TR', IST, { hour: '2-digit', minute: '2-digit' }); },
    'time-et-tr':  function (e) { return fmt(e.startDate, 'tr-TR', NY, { hour: '2-digit', minute: '2-digit' }); },
    'minutes':     function (e) { return String(e.minutes); }
  };

  function get(id) {
    var raw = (window.ATBLISS_EVENTS || {})[id];
    if (!raw) return null;
    var e = {};
    for (var k in raw) e[k] = raw[k];
    e.startDate = new Date(raw.start);
    e.endDate = new Date(e.startDate.getTime() + raw.minutes * 60000);
    e.endMs = e.endDate.getTime();
    e.zoomUrl = raw.zoom ? atob(raw.zoom) : '';
    return e;
  }

  function render(tpl, e) {
    return tpl.replace(/\{([a-z-]+)\}/g, function (m, t) { return TOKENS[t] ? TOKENS[t](e) : m; });
  }

  function fill(root) {
    (root || document).querySelectorAll('[data-event][data-tpl]').forEach(function (el) {
      var e = get(el.getAttribute('data-event'));
      if (!e) return;
      var text = render(el.getAttribute('data-tpl'), e);
      if ('value' in el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) el.value = text;
      else el.textContent = text;
    });
  }

  /* Calendar formats, all computed from the same UTC moment */
  function utcCompact(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); } // 20261117T233000Z
  function utcIso(d) { return d.toISOString().replace(/\.\d{3}Z$/, '+00:00'); }                   // 2026-11-17T23:30:00+00:00

  function googleUrl(e, o) {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(o.title || e.title)
      + '&dates=' + utcCompact(e.startDate) + '/' + utcCompact(e.endDate)
      + '&details=' + encodeURIComponent(o.details || '')
      + '&location=' + encodeURIComponent(o.location || 'Online via Zoom');
  }

  function outlookUrl(e, o) {
    return 'https://outlook.live.com/calendar/0/deeplink/compose'
      + '?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent'
      + '&subject=' + encodeURIComponent(o.title || e.title)
      + '&startdt=' + encodeURIComponent(utcIso(e.startDate))
      + '&enddt=' + encodeURIComponent(utcIso(e.endDate))
      + '&body=' + encodeURIComponent(o.details || '')
      + '&location=' + encodeURIComponent(o.location || 'Online via Zoom');
  }

  function downloadIcs(e, o) {
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AtBliss//Events//EN',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@atbliss.org',
      'DTSTAMP:' + utcCompact(new Date()),
      'DTSTART:' + utcCompact(e.startDate),
      'DTEND:' + utcCompact(e.endDate),
      'SUMMARY:' + (o.title || e.title),
      'DESCRIPTION:' + (o.details || '').replace(/\n/g, '\\n'),
      'LOCATION:' + (o.location || 'Online via Zoom'),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = o.filename || 'event.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  window.AtBlissEvent = { get: get, fill: fill, render: render, googleUrl: googleUrl, outlookUrl: outlookUrl, downloadIcs: downloadIcs };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { fill(); });
  else fill();
})();
