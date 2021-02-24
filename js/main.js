var _doc = document;

// 通用函数，获取dom节点
function gId( n ){
	return _doc.getElementById( n );
}

// 飞机移动，
gId( 'wrapId' ).onmousemove = function( e ){
	var eL = e.pageX - gId( 'wrapId' ).offsetLeft -20;   
	var eT = e.pageY - gId( 'wrapId' ).offsetTop - 20;

	gId( 'airplaneId' ).style.left = eL + 'px' ;
	gId( 'airplaneId' ).style.top = eT + 'px';
}

//生成目标,列表数据，xy坐标
function targetListObj(){
	var _arrs = [];
	for(var i=0; i<10; i++){
		var _obj = {};
		_obj._x = Math.floor(Math.random() * 10); 
		_obj._y = Math.floor(Math.random() * 10);
		_arrs.push( _obj );
	}
	console.log( _arrs );
	createTargetFn( _arrs );
	
}
targetListObj();

//生成目标
function createTargetFn( _arrs ){
	for(var i=0; i<_arrs.length; i++){
		var _targetBlock = _doc.createElement('li');
		_targetBlock.setAttribute('class','targetDiv no-boom');//默认情况下未被击中
		_targetBlock.style.left = _arrs[i]._x * 100 + 'px';

		gId( 'wrapId' ).appendChild( _targetBlock );
	}

	//获得所有的li标签
	var _lis = gId( 'wrapId' ).querySelectorAll('li');

	//目标向下移动
	var n = 0; //计数器
	var _s = setInterval(function(){
		for(var j=0; j<_lis.length; j++){
			_lis[j].style.top = (_arrs[j]._y++) * 5 + 'px';
			n++;

			if ( n > 900) {
				clearInterval( _s );
				gId( 'wrapId' ).removeChild( _lis[j] );
			}
		}
	},100);
}

//生成子弹
function createBulletFn( e ){
	var _bullet = _doc.createElement('div');
	_bullet.style.left = e.pageX - gId( 'wrapId' ).offsetLeft + 'px';
	_bullet.style.top = e.pageY - gId( 'wrapId' ).offsetTop + 'px';
	_bullet.setAttribute('class','bulletDiv'); 

	gId( 'wrapId' ).appendChild( _bullet );

	//选出x轴上所有的目标，和子弹在同一横向水平线上，这些都是可能被子弹击中的目标
	var _fireTarget_x = [];
	var _lis = gId( 'wrapId' ).querySelectorAll('li');

	for(var i=0; i<_lis.length; i++){
		if ( _bullet.offsetLeft > _lis[i].offsetLeft 
			&& _bullet.offsetLeft < _lis[i].offsetLeft + 60) {
			_fireTarget_x.push( _lis[i] );
		}
	}

	//子弹向上移动一段距离之后消失
	var n = _bullet.offsetTop;
	// console.log(n);
	var _s = setInterval(function(){
		_bullet.style.top = n-- + 'px';

		//判断，是否击中
		if ( _fireTarget_x.length >= 0 ) {
			for(var i=0; i<_fireTarget_x.length; i++){
				if ( n == _fireTarget_x[i].offsetTop 
					&& _fireTarget_x[i].getAttribute('class') != 'targetDiv yes-boom') {
					_fireTarget_x[i].setAttribute('class', 'targetDiv yes-boom');

					//击中之后，清除子弹计数器
					clearInterval( _s );

					var _c = setTimeout(function(){
						gId('wrapId').removeChild( _bullet );
						clearTimeout( _c );
					},250);
				}
			}
		}

		//子弹未击中，清除
		if ( n <= 0 ) {
			clearInterval( _s );
			gId( 'wrapId' ).removeChild( _bullet ); 
		}
	},10);
}

//射击，创建子弹dom节点
gId( 'wrapId' ).onclick = function( e ){
	createBulletFn( e );
}
