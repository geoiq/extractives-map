// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function() {
    var cache = {};
    this.tmpl = function tmpl(str, data) {
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, " ")
         .replace(/'(?=[^%]*%>)/g,"\t")
         .split("'").join("\\'")
         .split("\t").join("'")
         .replace(/<%=(.+?)%>/g, "',$1,'")
         .split("<%").join("');")
         .split("%>").join("p.push('")
         + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();

table_templates = {
    tr : '<tr><%= row %></tr>',
    th : '<th id="th-header-<%= id %>"><%= header %></th>',
    td : '<td><%= cell %></td>',
    project: '<tr id="row_<%= id %>" class="<%= even %> rowsector_<%= sector_code %>" data-project-name="<%= project_name %>" data-project-id="<%= id %>"><td><%= project_name %></td><td><%= id %></td><td>$<%= totalamt %> million</td><td><%= mjsector1 %></td><td><%= boardapprovaldate %></td><td><%= prodlinetext %></td></tr>',
    mine: '<tr id="row_<%= id %>" class="<%= even %>" data-project-id="<%= Company_name %>"><td><a href="<%= CompanyURL %>" target="_new"><%= Company_name %></a></td><td><%= mineral_type %></td><td><%= Total_company_payments %></td><td><%= Total_government_receipts %></td><td><%= Total_difference %></td><td><a href="<%= CSR_url %>" target="_new"><%= Sustainability_reports_available %></a></td></tr>'
};

Textify = {
 this_many_words: function(s,count) {  
    if (s == null || !s.length) return ''
    if (s.split(' ').length <= count) return s 
    return s.split(' ').slice(0,count).join(' ') + '...'
  },
  
  short_enough: function(s,count) {
    if (count) {s = Textify.this_many_words(s,count)}
    s = s.replace(/[^ ]{40,}/,'[edited]')
    return s
  },
  
  /**
   * Truncate and add elipses if string exceeds a certain character length
   */
  elide_after: function(s, count, symbol) {
     symbol = (symbol == null ? "&hellip;" : symbol);
    if (s.length > count) {
      return s.substr(0, count-1) + symbol;
    } else {
      return s;
    }
  },

 elide_during: function(s, max, symbol) {
     symbol = (symbol == null ? "&hellip;" : symbol);
    if (s.length > max) {
         var diff = s.length - max;
         var start_gap = parseInt((s.length / 2) - (diff / 2));
         var end_gap = start_gap + diff;
      return s.substr(0, start_gap) + symbol + s.substr(end_gap, s.length-1);
    } else {
      return s;
    }
 },
 
 elide_during_long_stuff: function(s, max, symbol) {
   var matches = s.match(/[^ ]{10,}/g)
   jq.each(matches||[], function(){
     s = s.replace(new RegExp(this), Textify.elide_during(this, max, symbol||'...'))
   })
   return s
 }

}

var Numify
;(function(){
  Numify = function(num) {  //constructor
    this.num = num;
    this.to_s = "";
    return this
  }
  Numify.prototype = {
    humanize: function() {
       n = parseInt(this.num,10)
       var l = (n+'').length
       if      (l<=6)  {  this.to_s = this.num.toFixed(2)+'' } 
       else if (l<=7)  {  this.to_s = (n/1e6 ).toFixed(1) + "mil" }
       else if (l<=8)  {  this.to_s = (n/1e6 ).toFixed(1) + "mil" }
       else if (l<=9)  {  this.to_s = (n/1e6 ).toFixed(1) + "mil" }
       else if (l<=10) {  this.to_s = (n/1e9 ).toFixed(1) + "bil" }
       else if (l<=11) {  this.to_s = (n/1e9 ).toFixed(1) + "bil" }
       else if (l<=12) {  this.to_s = (n/1e9 ).toFixed(1) + "bil" }
       else if (l<=13) {  this.to_s = (n/1e13).toFixed(1) + "tr"  }
       else if (l<=14) {  this.to_s = (n/1e13).toFixed(1) + "tr"  }
       else if (l<=15) {  this.to_s = (n/1e13).toFixed(1) + "tr"  }
       else {             this.to_s = (n / Math.pow(10,l-1)).toFixed(2) + ("e"+(l-1)) }
       return this
     },

     commify: function() {
       if (this.to_s == "") this.to_s = (this.num+'')
     var x = this.to_s.split('.'),
         x1 = x[0],
         x2 = x.length > 1 ? '.' + x[1] : '',
         rgx = /(\d+)(\d{3})/
     while (rgx.test(x1)) {
         x1 = x1.replace(rgx, '$1' + ',' + '$2');
     }
     this.to_s = x1 + x2;
     return this
     },
     
     // keep "5.23mil" but turn "5.00mil" into simply "5mil".
     flatten: function() {
       if (this.to_s == "") this.to_s = (this.num+'')
       this.to_s = this.to_s.replace(/(\.[0]+)\d?/g,'')
       return this
     }
     
  }
})()


// Expandy: Simple Jquery thingy that expands the div reffered to by
// any .expandy element's rel attribute. Example: 
//  <a href="#" class="expandy" rel="#jackpot"/>
//  <div id="jackpot" style="display:none">Expandable!</div>
Expandy = {
  initialize: function() {
    jq('.expandy').click(function() {
      jq(jq(this).attr('rel')).toggle('blind')
      return false
    })
  }
}