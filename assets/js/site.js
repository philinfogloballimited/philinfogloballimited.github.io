/* ==========================================================================
   [AGENCY NAME] — site behaviour
   Alpine.js components + small progressive enhancements.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     Config — point formEndpoint at your backend to make forms truly live.
     Leave it empty and forms validate + show a success state locally.
     ------------------------------------------------------------------------ */
  window.SITE_CONFIG = {
    formEndpoint: '', // e.g. 'https://api.example.com/contact'
    // The home-page film. Drop the file in assets/video/ and name it VID.mp4.
    // A YouTube or Vimeo embed URL also works here.
    videoUrl: 'assets/video/VID.mp4'
  };

  /* ======================================================================
     1. HEADER — two states, switch when scrollY > 60
     ====================================================================== */
  window.siteHeader = function siteHeader() {
    return {
      scrolled: false,
      mobileOpen: false,
      get menuOpen() { return this.mobileOpen; },

      init: function () {
        var self = this;
        var ticking = false;

        var apply = function () {
          var y = window.scrollY || window.pageYOffset;
          self.scrolled = y > 60;
          // keep any open menu anchored to the visible bar
          if (self.scrolled === true && self.mobileOpen === false) {
            self.mobileOpen = false;
          }
          ticking = false;
        };

        var onScroll = function () {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(apply);
        };

        apply();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Close the mobile menu on desktop resize
        window.addEventListener('resize', function () {
          if (window.innerWidth >= 1024) self.mobileOpen = false;
        });

        // Publish the header height so page content can offset itself
        this.$nextTick(function () {
          window.setHeaderHeight();
        });
      }
    };
  };

  window.setHeaderHeight = function () {
    var full = document.getElementById('header-full');
    var slim = document.getElementById('header-slim');
    if (!full) return;
    // Measure the state that is currently at the top of the page
    var h = (full.querySelector('.mx-auto') || full).getBoundingClientRect().height;
    if (slim) {
      var slimH = slim.querySelector('.mx-auto');
      if (slimH && window.scrollY > 60) h = slimH.getBoundingClientRect().height;
    }
    // On mobile the full bar only shows the logo row
    document.documentElement.style.setProperty('--header-h', Math.round(h) + 'px');
    document.documentElement.style.setProperty('--header-slim-h', Math.round((slim && slim.querySelector('.mx-auto') ? slim.querySelector('.mx-auto').getBoundingClientRect().height : h)) + 'px');
  };
  window.addEventListener('load', window.setHeaderHeight);
  window.addEventListener('resize', function () {
    window.clearTimeout(window.__headerResize);
    window.__headerResize = window.setTimeout(window.setHeaderHeight, 150);
  });

  /* ======================================================================
     2. HERO CAROUSEL — crossfade, 8s autoplay, hover/focus pause,
        keyboard arrows, touch swipe, honour reduced motion
     ====================================================================== */
  window.heroCarousel = function heroCarousel(total) {
    return {
      index: 0,
      total: total,
      timer: null,
      paused: false,
      touchStartX: 0,
      touchStartY: 0,
      get interval() { return prefersReducedMotion.matches ? 0 : 8000; },

      init: function () {
        this.start();
        if (prefersReducedMotion.matches) {
          // No autoplay for reduced-motion users; arrows/dots still work.
          this.stop();
        }
      },

      start: function () {
        var self = this;
        this.stop();
        if (prefersReducedMotion.matches) return;
        this.timer = window.setInterval(function () {
          if (!self.paused) self.next(false);
        }, 8000);
      },

      stop: function () {
        if (this.timer) {
          window.clearInterval(this.timer);
          this.timer = null;
        }
      },

      pause: function () { this.paused = true; },
      resume: function () { this.paused = false; },

      goTo: function (i) {
        this.index = (i + this.total) % this.total;
      },
      next: function (restart) {
        this.index = (this.index + 1) % this.total;
        if (restart !== false) this.start();
      },
      prev: function () {
        this.index = (this.index - 1 + this.total) % this.total;
        this.start();
      },

      onTouchStart: function (event) {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartY = event.changedTouches[0].clientY;
        this.pause();
      },
      onTouchEnd: function (event) {
        var dx = event.changedTouches[0].clientX - this.touchStartX;
        var dy = event.changedTouches[0].clientY - this.touchStartY;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          dx < 0 ? this.next() : this.prev();
        }
        this.resume();
      }
    };
  };

  /* ======================================================================
     3. VIDEO MODAL
     ====================================================================== */
  window.videoModal = function videoModal() {
    return {
      open: false,
      unavailable: false,
      lastFocus: null,
      videoUrl: (window.SITE_CONFIG && window.SITE_CONFIG.videoUrl) || '',

      init: function () {
        var self = this;
        window.addEventListener('open-video-modal', function () {
          self.lastFocus = document.activeElement;
          self.open = true;
          document.documentElement.style.overflow = 'hidden';
          self.$nextTick(function () {
            if (self.$refs.closeBtn) self.$refs.closeBtn.focus();
            var v = self.$refs.video;
            if (v && self.videoUrl && v.play) {
              var p = v.play();
              if (p && p.catch) p.catch(function () { /* autoplay blocked — controls remain */ });
            }
          });
        });
      },

      close: function () {
        this.open = false;
        document.documentElement.style.overflow = '';
        var v = this.$refs.video;
        if (v) { try { v.pause(); } catch (e) {} }
        if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
      }
    };
  };

  /* ======================================================================
     4. FORMS — shared validation helpers
     ====================================================================== */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var PHONE_RE = /^[+()\d][\d\s().-]{6,19}$/;

  var rules = {
    required: function (value) {
      return String(value || '').trim() ? '' : 'This field is required.';
    },
    name: function (value) {
      var v = String(value || '').trim();
      if (!v) return 'Please enter your name.';
      if (v.length < 2) return 'Please enter at least 2 characters.';
      return '';
    },
    email: function (value) {
      var v = String(value || '').trim();
      if (!v) return 'Please enter your email address.';
      if (!EMAIL_RE.test(v)) return 'That email address looks incomplete.';
      return '';
    },
    phone: function (value) {
      var v = String(value || '').trim();
      if (!v) return 'Please enter a phone number.';
      if (!PHONE_RE.test(v)) return 'Use digits, spaces, +, - or ( ) only.';
      return '';
    },
    min: function (value, size) {
      var v = String(value || '').trim();
      if (!v) return 'This field is required.';
      if (v.length < size) return 'Please write at least ' + size + ' characters.';
      return '';
    },
    password: function (value) {
      var v = String(value || '');
      if (!v) return 'Please enter your password.';
      if (v.length < 8) return 'Passwords are at least 8 characters.';
      return '';
    },
    accepted: function (value) {
      return value ? '' : 'Please accept to continue.';
    }
  };

  function makeForm(initial, schema) {
    return {
      fields: Object.assign({}, initial),
      errors: {},
      touched: {},
      status: 'idle', // idle | sending | success | error
      serverMessage: '',

      validateField: function (name) {
        var checks = schema[name] || [];
        var message = '';
        for (var i = 0; i < checks.length; i++) {
          var parts = checks[i].split(':');
          var fn = rules[parts[0]];
          if (!fn) continue;
          message = fn(this.fields[name], parts[1] ? Number(parts[1]) : undefined);
          if (message) break;
        }
        this.errors[name] = message;
        return !message;
      },

      blur: function (name) {
        this.touched[name] = true;
        this.validateField(name);
      },

      input: function (name) {
        if (this.touched[name]) this.validateField(name);
      },

      validateAll: function () {
        var vm = this;
        var ok = true;
        var firstBad = null;
        Object.keys(schema).forEach(function (name) {
          vm.touched[name] = true;
          if (!vm.validateField(name)) {
            ok = false;
            if (!firstBad) firstBad = name;
          }
        });
        if (firstBad) {
          var el = document.querySelector('[data-field="' + firstBad + '"]');
          if (el && el.focus) el.focus();
        }
        return ok;
      },

      reset: function () {
        var keys = Object.keys(initial);
        for (var i = 0; i < keys.length; i++) this.fields[keys[i]] = initial[keys[i]];
        this.errors = {};
        this.touched = {};
        this.status = 'idle';
      },

      send: function () {
        var vm = this;
        if (!this.validateAll()) return;

        this.status = 'sending';
        var payload = Object.assign({}, this.fields, {
          form: this.$el.getAttribute('data-form-name') || 'form',
          page: window.location.pathname,
          sentAt: new Date().toISOString()
        });

        var done = function () {
          vm.status = 'success';
        };

        if (window.SITE_CONFIG.formEndpoint) {
          fetch(window.SITE_CONFIG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
            .then(function (res) {
              if (!res.ok) throw new Error('Request failed');
              done();
            })
            .catch(function () {
              vm.status = 'error';
              vm.serverMessage = 'Something went wrong. Please call or email us instead.';
            });
        } else {
          // No backend configured yet: simulate a short round-trip.
          window.setTimeout(done, 900);
        }
      }
    };
  }

  window.contactForm = function () {
    return makeForm(
      { name: '', email: '', phone: '', message: '' },
      {
        name: ['name'],
        email: ['email'],
        phone: ['phone'],
        message: ['min:10']
      }
    );
  };

  window.applyForm = function () {
    var form = makeForm(
      {
        firstName: '', lastName: '', email: '', phone: '',
        position: '', location: '', experience: '',
        cvName: '', cover: '', consent: false
      },
      {
        firstName: ['name'],
        lastName: ['name'],
        email: ['email'],
        phone: ['phone'],
        position: ['required'],
        location: ['required'],
        experience: ['required'],
        cvName: ['required'],
        cover: ['min:20'],
        consent: ['accepted']
      }
    );

    // CV picker: keep the chosen file name in the model, guard the size
    form.cvError = '';
    form.pickCv = function (event) {
      var input = event.target;
      var file = input.files && input.files[0];
      this.cvError = '';
      if (!file) {
        this.fields.cvName = '';
        return;
      }
      var maxMb = 5;
      var allowed = /\.(pdf|doc|docx|rtf|txt)$/i;
      if (!allowed.test(file.name)) {
        this.cvError = 'Please upload a PDF, DOC or DOCX file.';
        this.fields.cvName = '';
        input.value = '';
        return;
      }
      if (file.size > maxMb * 1024 * 1024) {
        this.cvError = 'That file is larger than ' + maxMb + 'MB.';
        this.fields.cvName = '';
        input.value = '';
        return;
      }
      this.fields.cvName = file.name;
      this.validateField('cvName');
    };

    return form;
  };

  window.loginForm = function () {
    var form = makeForm(
      { email: '', password: '', remember: true },
      { email: ['email'], password: ['password'] }
    );
    form.showPassword = false;
    form.togglePassword = function () { this.showPassword = !this.showPassword; };
    return form;
  };

  /* ======================================================================
     5. Vacancy prefill — apply.html?job=barista preselects the role + country
     ====================================================================== */
  var JOB_PREFILL = {
    barista:          { position: 'Barista', location: 'Saudi Arabia' },
    'barista-assistant': { position: 'Barista Assistant', location: 'Saudi Arabia' },
    nanny:            { position: 'Nanny', location: 'Saudi Arabia' },
    qatar:            { position: 'Housemaid', location: 'Qatar' },
    housemaid:        { position: 'Housemaid', location: 'Qatar' },
    'lady-driver':    { position: 'Lady Driver', location: 'Qatar' },
    'lady-barista':   { position: 'Lady Barista', location: 'Qatar' },
    cleaner:          { position: 'Cleaner (House-to-House)', location: 'Saudi Arabia' },
    'cleaner-urgent': { position: 'Cleaner (Urgent – Female)', location: 'Saudi Arabia' },
    'dubai-security':  { position: 'Security Guard', location: 'Dubai (UAE)' },
    'security-guard':  { position: 'Security Guard', location: 'Dubai (UAE)' },
    scaffolder:        { position: 'Scaffolder', location: 'Dubai (UAE)' },
    carpenter:         { position: 'Carpenter', location: 'Dubai (UAE)' },
    'dubai-construction': { position: 'Construction Helper', location: 'Dubai (UAE)' }
  };

  window.applyJobPrefill = function applyJobPrefill() {
    var form = document.querySelector('form[data-form-name="application"]');
    if (!form) return;

    var key = (new URLSearchParams(window.location.search).get('job') || '').toLowerCase();
    var preset = JOB_PREFILL[key];
    if (!preset) return;

    var apply = function () {
      var setSelect = function (id, value) {
        var el = document.getElementById(id);
        if (!el) return;
        el.value = value;
        // keep Alpine's x-model in sync
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setSelect('a-position', preset.position);
      setSelect('a-location', preset.location);

      var note = document.getElementById('apply-prefill-note');
      if (note) {
        var label = note.querySelector('span') || note;
        label.textContent = 'Applying for: ' + preset.position + ' — ' + preset.location;
        note.hidden = false;
      }
    };

    // Alpine may already have initialised by the time this runs; handle both cases.
    if (window.Alpine && window.Alpine.version) {
      requestAnimationFrame(apply);
    } else {
      document.addEventListener('alpine:initialized', apply, { once: true });
    }
  };

  window.partnerForm = function () {
    return makeForm(
      {
        company: '', industry: '', country: '', website: '',
        contactName: '', jobTitle: '', email: '', phone: '',
        roles: '', headcount: '', timeline: '', message: '', consent: false
      },
      {
        company: ['required'],
        industry: ['required'],
        country: ['required'],
        contactName: ['name'],
        email: ['email'],
        phone: ['phone'],
        roles: ['min:4'],
        headcount: ['required'],
        timeline: ['required'],
        consent: ['accepted']
      }
    );
  };

  /* ======================================================================
     5b. Gallery lightbox — keyboard, focus restore, scroll lock
     ====================================================================== */
  window.galleryBox = function () {
    return {
      open: false,
      index: 0,
      items: [],
      lastFocus: null,

      init: function () {
        var self = this;
        this.items = Array.prototype.map.call(
          this.$el.querySelectorAll('[data-gallery-item]'),
          function (el) {
            return {
              el: el,
              full: el.getAttribute('data-full') || el.getAttribute('data-src') || '',
              caption: el.getAttribute('data-caption') || ''
            };
          }
        );
        this.$watch('open', function (isOpen) {
          document.documentElement.classList.toggle('u-scroll-lock', isOpen);
        });
      },

      show: function (trigger) {
        var self = this;
        var i = -1;
        for (var k = 0; k < this.items.length; k++) {
          if (this.items[k].el === trigger) { i = k; break; }
        }
        this.lastFocus = trigger || document.activeElement;
        this.index = i < 0 ? 0 : i;
        this.open = true;
        this.$nextTick(function () {
          var closeBtn = self.$refs && self.$refs.closeBtn;
          if (closeBtn && closeBtn.focus) closeBtn.focus();
        });
      },

      hide: function () {
        this.open = false;
        var back = this.lastFocus;
        this.lastFocus = null;
        this.$nextTick(function () {
          if (back && back.focus) back.focus();
        });
      },

      next: function () {
        if (!this.items.length) return;
        this.index = (this.index + 1) % this.items.length;
      },

      prev: function () {
        if (!this.items.length) return;
        this.index = (this.index - 1 + this.items.length) % this.items.length;
      }
    };
  };

  /* ======================================================================
     6. Small enhancements — back to top, external links, demo notices
     ====================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    // Back to top
    document.querySelectorAll('[data-back-to-top]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var reduce = prefersReducedMotion.matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    });

    // Security: any external link opens in a new tab, safely.
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      if (a.hostname !== window.location.hostname) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });

    // Vacancy prefill for apply.html?job=... links
    window.applyJobPrefill();

    // Set header offset after fonts settle
    window.setHeaderHeight();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(window.setHeaderHeight);
    }
  });
})();
