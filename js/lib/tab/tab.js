class Tabs{
	constructor(options){
		let defaultOptions = {
			element:'',
			navSelector:'[data-role="tab-nav"]',
			panesSelector:'[data-role="tab-panes"]',
			activeName:'active',
		}
		this.options = Object.assign({},defaultOptions,options);
		this.checkOptions().bindEvents().setDefaultTab();
	}
	
	checkOptions(){
		if(!this.options.element){
			throw new Error('element is required !');
		}
		return this;
	}

	bindEvents(){
		dom.on('click',this.options.element,`${this.options.navSelector}>li`,(e,el) => {
			let index = dom.index(el);
			let children = this.options.element.querySelector(this.options.panesSelector).children;
			dom.uniqueClass(el,this.options.activeName);
			dom.uniqueClass(children[index],this.options.activeName);
		})
		return this;
	}

	setDefaultTab(){
		this.options.element.querySelector(`${this.options.navSelector}>li:first-child`).click();
		return this;
	}
}