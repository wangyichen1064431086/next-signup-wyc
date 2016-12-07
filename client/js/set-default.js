const setDefault = function(obj){
	/* 这里的写法是 增强的模块模式，见《JS高级》P191。
	* 这样这个setDefault方法执行之后得到的这个obj,有一些私有变量是外界访问不到的，如_target,targetIsKey,外界能访问到的只有.of和.to两个公有方法/特权方法。
	*/
	let _target;
	let targetIsKey = false;
	const svc = {};

	svc.of = function (target) {
		_target = target;
		targetIsKey = true;
		return svc;
	};

	svc.to = function (value) {
		if(targetIsKey) {
			if(_target[obj] === undefined){
				_target[obj] = value;
			}
		} else {
			if(obj === undefined) {
				obj = value;
			}
			else {
				let prop;
				for(prop in value) {
					if(obj[prop] === undefined) {
						obj[prop] = value[prop];
					}
				}
			}
			return obj;
		}
	};

	return svc;
	
};

export default setDefault;