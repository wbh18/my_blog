function onNavClick(url){
	// Highlight current nav item
	var hasCurrent = false;

	//把相对路径解析成绝对路径
	function absolute(href) {
	    var link = document.createElement("a");
	    link.href = href;
	    return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
	}

	//移出所有的菜单的选中样式
	$('#main-nav > li').each(function(){
		$(this).removeClass('current-menu-item current_page_item');
	});
	var links = $('#main-nav > li > a');
	//为什么要从后面往前面遍历？因为首页极有可能是https://xxxxx/,
	//这样的话肯定能够匹配所有的项
	for (var i = links.length; i >= 0; i--) {
		if(url.indexOf(absolute(links[i])) != -1){
			$(links[i]).parent().addClass('current-menu-item current_page_item');
			//为什么还要设置hasCurrent？因为不排除首页是
			//https://xxxx/index.html格式的
			hasCurrent = true;
			break;
		}		
	}
	if (!hasCurrent) {
		$('#main-nav > li:first').addClass('current-menu-item current_page_item');
	}
}



// article toc
var toc = document.getElementById('toc')

if (toc != null) {
	window.addEventListener("scroll", scrollcatelogHandler);
	
}

function scrollcatelogHandler(e) {
	if (!document.getElementById('toc')) {
		window.removeEventListener('scroll', scrollcatelogHandler)
		return
	}
	var tocPosition = 194+25;
	var event = e || window.event,
		target = event.target || event.srcElement;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop > tocPosition) {
	   document.getElementById('toc').classList.add("toc-fixed");
	} else {
	   document.getElementById('toc').classList.remove("toc-fixed");
	}
}

onNavClick(window.location.href)

$('#main-navigation').on('click', function(){
    if ($('#main-navigation').hasClass('main-navigation-open')){
	  $('#main-navigation').removeClass('main-navigation-open');
    } else {
	  $('#main-navigation').addClass('main-navigation-open');
	}
  });

$('#content').on('click', function(){
    if ($('#main-navigation').hasClass('main-navigation-open')){
	  $('#main-navigation').removeClass('main-navigation-open');
    }
  });