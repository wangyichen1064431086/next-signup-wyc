import setDefault from './set-default.js';
import validators from './validator.js';
import UiItem from './ui-item.js';

class InputValidator {
	constructor(settings = {}) {//ES6: Simulating Named Parameters in JS
		setDefault(settings).to({
			selector:'',
			fieldClass:'su-field',
			inputClass:'su-field__input',
			validClass:'su-field--valid',
			invalidClass:'su-field--error',
			statusBox:'#emailExistsStatusBox'
		});
	}
}