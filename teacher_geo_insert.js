
function teacherSection(numCls,title,bodyHtml){
  var icons={g:'1',a:'2',c:'3',m:'4',t:'5'};
  var ic={g:'📋',a:'🎯',c:'📐',m:'🔢',t:'✓'}[numCls]||'•';
  return '<div class="teacher-block"><motion class="teacher-block-hd"><span class="teacher-num '+numCls+'">'+ic+'</span><span class="teacher-hd-title">'+title+'</span></div><div class="teacher-block-bd">'+bodyHtml+'</div></div>';
}
function teacherSection(numCls,title,bodyHtml){
  var ic={g:'📋',a:'🎯',c:'📐',m:'🔢',t:'✓'}[numCls]||'•';
  return '<motion class="teacher-block"><div class="teacher-block-hd"><span class="teacher-num '+numCls+'">'+ic+'</span><span class="teacher-hd-title">'+title+'</span></div><div class="teacher-block-bd">'+bodyHtml+'</div></div>';
}
