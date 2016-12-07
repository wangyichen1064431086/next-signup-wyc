/*
	validators模块用于判断各个字段值是否符合要求。
*/

const validators = {
	'required':function(value){//疑问，这是因为safari等浏览器不支持HTML5的required，所以重新自己定义了一下吗？
		return value.length > 0;//value存在，requred为true
	},

	'email':function(value) {
		const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const lengthOk = value.length >0 && value.length <= 40;
		return pattern.test(value) && lengthOk;//当value符合pattern正则，且长度在(0,40]之间时，'email'为true
	},

	'password':function(value) {
		const pattern = /^[A-Za-z0-9\\-]+$/;
		const lengthOk = value.length >= 6 && value.length <= 20;
		return pattern.test(value) && lengthOk;//当value符合pattern正则，且长度在[6,20],'password'为true
	},

	'checked':function(value,input) {
		return input.checked;//checked直接为input.checked属性的值。
	}
};

export default validators;