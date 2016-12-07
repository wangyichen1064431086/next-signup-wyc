const statusMessage = {
	'emailExists':'请检查您输入的邮箱',
	'submitting':'正在提交...',
	'submitted':'注册成功！',
	'saving':'正在保存...',
	'saved':'保存成功！',
	'email-checking':'检测邮箱是否可用'，
	'email-valid':'邮箱可用'，
	'email-exists':'该邮箱已注册<a href="http://user.ftchinese.com/login">直接登录</a>'
};

class UiItem {
	constructor({ selector,
				labelClass='js-item__label',
				valueClass='js-field__input'
			    }={}){//参见estLearn.md的书籍二，11.5.3
		this.valueClass = valueClass;
		this.labelClass = labelClass;
		this.element=(selector instanceof HTMLElement)? selector:document.querySelector(selector);
	}

	enable(){
		const els = controlElementOf(this);//得到button元素组成的数组
		if(els){//移除这些button元素的disabled属性
			for(let i=0;i<els.length;i++){
				els[i].removeAttribute('disabled');
			}
		}
	}

	disabled(){
		const els = controlElementsOf(this);//得到button元素组成的数组
		if(els){//为这些button元素添加属性'disabled'为'true'
			for(let i = 0; i < els.length; i++) {
				els[i].setAttribute('disabled','true');
			}
		}
	}

	show(){//为当前对象上的元素（this.element)添加class 'is-visible'，移除'in-invisible'
		this.element.classList.remove('is-invisible');
		this.element.classList.add('is-visible');
	}

	hide(){//为this.element添加class 'is-invisible',移除'is-visible'
		this.element.classList.add('is-invisible');
		this.element.classList.remove('is-visible');
	}

	display(){//为this.element移除class 'is-hidden'
		this.element.classList.remove('is-hidden');
	}

	removeFromDisplay(){
		this.element.classList.add()
	}

	get input() { //计算属性 input
		return this.element.querySelector('input');
	}

	setLabelTo(value) {
		/* 为class为labelClass的元素设置innerHTML为statusMessage[value]
		*@parameter value: type String, the key of statusMessaty obj.
		*/
		const label = this.element.querySelector(`.${this.labelClass}`);
		label.innerHTML = statusMessage[value]||value;
	}

	getDefaultLabel(){
		/* 获取class为labelClass的元素的innerHTML的值
		*/
		return this.element.querySelector(`.${this.labelClass}`).innerHTML;
	}


	setStatusTo(status) {
		/*为 this.Element添加class 'is-${status}'
		*/
		this.element.classList.add(`is-${status}`);
	}

	displayError(message) {
		if(message) {
			this.setStatusTo('error');
		}
		this.setLabelTo(message);
		this.display();
		this.element.scrollIntoView();//Element.scrollIntoView() 方法:让当前的元素滚动到浏览器窗口的可视区域内。
	}

	onValueChanged(callback){
		/* 为this.element绑定'change'事件，若this.element的class符合一定条件则设定事件监听函数为callback
		*/
		this.element.addEventListener('change',(event)=>{
			if(event.target.classList.contains(this.valueClass)) {//如果发生change事件的元素的classList包含valueClass
				callback(event.target);//执行callback函数
			}
		});
	}

	onClick(listener) {
		/* 为this.elememt绑定'click'事件，事件监听函数为listener
		*/
		this.element.addEventListener('click',listener);
	}

	hasValue(){
		/* 判断当前类实例有无value,有则返回true
		*/
		return this.value && this.value.length > 0;
	}


	is(state){
		/* 判断元素的boolean属性的状态值，如required,disabled,checked,selected。
		*/
		const elems = controlElementsOf(this);
		if(elems.length){
			const elem = elems[0];
			if(state === 'checked'){
				return elem.checked;//inputHTML.checked=true or false,即返回checked的值
			}
			return elem.getAttribute(state)!== null;//如果state不为checked，则就纯粹判断有没有state这个属性存在，有则为true,反之则为false
		}
		return null;//如果elems不存在，则返回null

	}

	valueElements(){
		/*判断this.element是否拥有class this.valueClass,有的话就返回[this.elemnt]；否则返回this.element下具有this.valueClass这个class的后代元素组成的数组。*/
		return this.element.classList.contains(this.valueClass)?[this.element]:this.element.querySelectorAll(`.${this.valueClass}`);
	}
}

function controlElementsOf(instance){
	//概括地说一下这个函数是啥功能？
	if(instance.element.tagName === 'BUTTON'){
		return [instance.element];//得到的是button元素组成的数组。
	} else if (instance.valueElements()){
		return instance.valueElements();
	} else {
		return false;
	}
}

export default UiItem;