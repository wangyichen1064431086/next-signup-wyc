import setDefault from './set-default.js';
import validators from './validator.js';
import UiItem from './ui-item.js';

class InputValidator {
	constructor(settings = {}) {//ES6: Simulating Named Parameters in JS
		setDefault(settings).to({ //这个作用就是为参数setting这个对象提供默认值。然后调用的时候设置setting的时候可以省略一些setting的属性。
			selector:'',
			fieldClass:'su-field',
			inputClass:'su-field__input',
			validClass:'su-field--valid',
			invalidClass:'su-field--error',
			statusBox:'#emailExistsStatusBox'
		});

		let field = getFieldElement();//选择出 class为 'su-field'的第一个元素，本项目中为邮箱区域div

		this.settings = settings;
		this.field = field;
		this.validators = getValidators();//得到对于这个field元素的'data-validate'属性中的各指标validators验证结果，详见getValidators()函数。
		console.log(this.validators);
		this.input = this.field.querySelector(`.${settings.inputClass}`);//得到该field元素下的input元素，其是具有class'su-field__input'的。
		this.remoteUrl = this.field.getAttribute('data-remote-validate');//得到该field元素的'data-remote-validate'属性值，该值是后台判定该邮箱是否已存在的php地址。
		if(this.remoteUrl) { 
			this.emailExistsStatusBox = new UiItem({
				selector: this.settings.statusBox
			});//通过UiItem类构建了一个id为statusBox（默认为#emailExistsStatusBox）的元素实例。该实例具有valueClass、labelClass和element三个属性和一系列方法，其中element就是该元素本身，valueClass和labelClass为默认值。
		}

		function getFieldElement() {
			/*
			* 选择出document中class为 'su-field'的第一个元素，在本项目中一个邮箱区域/一个密码区域为一个su-field
			*/

			if(settings.selector instanceof HTMLElement) {//如果settings.selector是一个HTMLElement,则返回这个HTMLElement
				return settings.selector;
			}
			return settings.selector.length? document.querySelector(settings.selector): document.querySelector(`.${settings.fieldClass}`);//否则返回 以 settings.selector为选择器选出的元素，或返回以settings.fieldClass为选择器选出的元素。
		}

		function getValidators() {
			/*
			* 如果field元素具有'data-validate'属性，就对'data-validate中的各个指标进行validators验证，对各指标分别进行判定后返回判定结果boolean值组成的数组'
			* Eg: field元素的'data-validate'属性值可能为'required email'，那么返回值可能为[true,true],就是说它确实填了邮箱且邮箱符合邮箱正则。
			*/
			return field.hasAttribute('data-validate')
			 ? field.getAttribute('data-validate').split(',').map((name) => {
					return validators[name];
				})
			 : null;
		}
	}

	enableValidate() {
		this.input.addEventListener('blur',(event) => { //为该su-field区域下的input元素绑定blur事件
			this.sanitise();
			this.validate();
		});

		this.input.addEventListener('focus',(event) => {//为该su-field区域下的input元素绑定focus事件
			this.removeFlag();
		});

		if(!this.remoteUrl) {
			return; //如果该'su-field'元素不具有'data-remote-validate'属性，则返回
		}

		this.input.addEventListener('change',(event) => {//为该su-field区域下的input元素绑定change事件
			if(this.validate({silent:true})){
				this.remoteValidate()
					.catch(error => {
						console.log(error);
					});
			}
		});
	}

	remoteValidate() {
		this.field.classList.add('remote-validating');//给当前'su-field'元素添加'remote-validating'class
		this.emailExistsStatusBox.hide();//隐藏'#emailExistsStatusBox'元素（隐藏方法来自UiItem类的实例emailExistsStatusBox）
		return fetch(`${this.remoteUrl}?e=${this.input.value}`,{
			method:'GET'
		})
		.then((response) => {
			return response.text();
		}, (error) => {
			return Promise.reject('userCheckFailed');
		})
		.then((result) => {
			this.field.classList.remove('remote-validating');
			if(result === 'yes') {
				this.emailExistsStatusBox.show();
				return Promise.reject('emailExists')
			}
		}, (error) => {
			return Promise.reject(error);
		});

	}
}