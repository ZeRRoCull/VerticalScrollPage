$(function(){
	//Получаем указатели на все наши секции и формируем массив данных об этих секциях ====
	var sectionsArray = [];
	var scrollSections = document.querySelectorAll('.zc--vscroll');

	scrollSections.forEach(function(section,index){
		var height = $(section).outerHeight();
		var offsetTop = $(section).position().top;
		sectionsArray.push({index: index,height: height,offsetTop: offsetTop});
	});
	//====================================================================================

	var docPosition = 0; //Позиция врапера секций
	var $sectWrapper = $('.section-wrapper'); //указатель на врапер секций
	var heightSectWrapper = $sectWrapper.outerHeight();
	var windowHeight = $(window).height();
	var maxScrollDown = heightSectWrapper - windowHeight;

	$(window).resize(function(){
		heightSectWrapper = $sectWrapper.outerHeight();
		windowHeight = $(window).height();
		maxScrollDown = heightSectWrapper - windowHeight;
	});

	$('.wrapper').on('wheel',function(event){
		var dY = event.deltaY; //Узнаём размер и направление прокрутки

		if (docPosition <= 0 && dY > 0) { //Проверяем направление и ограничения позиции по минимуму
			var nextPosition = docPosition - dY; //Проверяем позицию по максимуму
			if ((-1*nextPosition) <= maxScrollDown) {

				var nextSection = calcPosition(sectionsArray,docPosition,true);
				//console.log(calcPosition(sectionsArray,docPosition,true));

				//docPosition-=dY;
				docPosition = (-nextSection.offsetTop);
				//Прокрутка вниз до maxScrollDown ============================
				$sectWrapper.css({
					transform: 'translate(0,'+posToString(docPosition)+')'
				});
				//============================================================
			} else {
				docPosition = -maxScrollDown;
				$sectWrapper.css({
					transform: 'translate(0,-'+posToString(maxScrollDown)+')'
				});
			}
		}

		if (docPosition <= 0 && dY < 0) { //Вращение калёсика мышки вверх
			var nextPosition = docPosition - dY;
			if ((nextPosition) <= 0) {

				var nextSection = calcPosition(sectionsArray,docPosition,false);
				//console.log(calcPosition(sectionsArray,docPosition,false));

				//docPosition-=dY;
				docPosition = (-nextSection.offsetTop);
				//Прокрутка вверх до 0 =======================================
				$sectWrapper.css({
					transform: 'translate(0,'+posToString(docPosition)+')'
				});
				//============================================================
			} else {
				docPosition = 0;
				$sectWrapper.css({
					transform: 'translate(0,0)'
				});
			}
		}

	});

	function calcPosition(sections,currentPos,direction) { //Возвращаем следующую секцию по скроллу вниз или вверх
		var curSection = null;

		if (direction) {
			curSection = currentSection(sections,-currentPos);
			return nextSect(sections,curSection.index,direction);
		} else {
			curSection = currentSection(sections,-currentPos);
			return nextSect(sections,curSection.index,direction);
		}
	}

	function currentSection(sections,currentPos) { //Вычисляем текущую секцию
		return sections.find(function(sect){
				var min = sect.offsetTop;
				var max = sect.offsetTop + sect.height;
				return ((currentPos >= min) && (currentPos < max));
			});
	}

	function nextSect(sections,curIndex,direction) { //Вычисляем следующую секцию на скроле вниз или вверх
		var max = sections.length - 1;
		if (direction) {
			if ((curIndex + 1) <= max) {
				return sections[curIndex + 1]
			}
		} else {
			if ((curIndex - 1) >= 0) {
				return sections[curIndex - 1]
			}
		}
		return false;
	}

	function posToString(pos) {
		return pos+'px';
	}
});