import 'promise-polyfill';//来自bower_component
import 'fetch';

import ShowPassword from './js/show-password.js';
import SignupForm from './js/signup-form.js';

import Tracker from './js/tracker.js';

window.addEventListener('load',function(){
	ga('set','page','/Register/Loaded');
	ga('send','pageview');
});

ShowPassword.init();
SignupForm.init();
