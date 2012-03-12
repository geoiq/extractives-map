// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

function initializeTipsy() {
    
    function Tipsy(element, options) {
        this.jqelement = jq(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    }
    
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var jqtip = this.tip();
                
                jqtip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                jqtip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                jqtip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
                
                var pos = jq.extend({}, this.jqelement.offset(), {
                    width: this.jqelement[0].offsetWidth,
                    height: this.jqelement[0].offsetHeight
                });
                
                var actualWidth = jqtip[0].offsetWidth, actualHeight = jqtip[0].offsetHeight;
                var gravity = (typeof this.options.gravity == 'function')
                                ? this.options.gravity.call(this.jqelement[0])
                                : this.options.gravity;
                
                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                
                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                jqtip.css(tp).addClass('tipsy-' + gravity);
                
                if (this.options.fade) {
                    jqtip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    jqtip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { jq(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        fixTitle: function() {
            var jqe = this.jqelement;
            if (jqe.attr('title') || typeof(jqe.attr('original-title')) != 'string') {
                jqe.attr('original-title', jqe.attr('title') || '').removeAttr('title');
            }
        },
        
        getTitle: function() {
            var title, jqe = this.jqelement, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = jqe.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call(jqe[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*jq)/, "");
            return title || o.fallback;
        },
        
        tip: function() {
            if (!this.jqtip) {
                this.jqtip = jq('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            }
            return this.jqtip;
        },
        
        validate: function() {
            if (!this.jqelement[0].parentNode) {
                this.hide();
                this.jqelement = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    jq.fn.tipsy = function(options) {
        
        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) tipsy[options]();
            return this;
        }
        
        options = jq.extend({}, jq.fn.tipsy.defaults, options);
        
        function get(ele) {
            var tipsy = jq.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, jq.fn.tipsy.elementOptions(ele, options));
                jq.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };
        
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };
        
        if (!options.live) this.each(function() { get(this); });
        
        if (options.trigger != 'manual') {
            var binder = options.live ? 'live' : 'bind',
                eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    jq.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };
    
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return jq.extend({}, options, {gravity: jq(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    jq.fn.tipsy.elementOptions = function(ele, options) {
        return jq.metadata ? jq.extend({}, options, jq(ele).metadata()) : options;
    };
    
    jq.fn.tipsy.autoNS = function() {
        return jq(this).offset().top > (jq(document).scrollTop() + jq(window).height() / 2) ? 's' : 'n';
    };
    
    jq.fn.tipsy.autoWE = function() {
        return jq(this).offset().left > (jq(document).scrollLeft() + jq(window).width() / 2) ? 'e' : 'w';
    };
    
}

