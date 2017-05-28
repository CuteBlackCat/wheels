class FullPage{
	constructor(options){
		let defaultOptions = {
			element:'',
			duration:'1s',
		}
		this.currentIndex = 0;
		this.options = Object.assign({},defaultOptions,options);
		this.animate = false;
		this.checkOption().init().bindEvent();
	}

	checkOption(){
		if(!this.options.element){
			throw new Error('element is require !');
		}
		return this;
	}

	init(){
		this.options.element.style.overflow = 'hidden';
		dom.every(this.options.element.children,section =>{
			section.style.transition = `all ${this.options.duration}`;
		})
		return this;
	}

	bindEvent(){
		this.options.element.addEventListener('mousewheel',(e)=>{
			let targetIndex = this.currentIndex + (e.deltaY > 0 ? 1 : -1);
			this.gotoSection(targetIndex).then(
				()=>{
					this.currentIndex = targetIndex;
				},
				()=>{}
			);
		})
		return this;
	}

	gotoSection(targetIndex){
		return new Promise((resolve,reject) => {
			if(this.animate){
				reject();
			}else if(targetIndex < 0){
				reject();
			}else if(targetIndex >= this.options.element.children.length){
				reject();
			}else{
				this.animate = true;
				let that = this;
				// 当执行了移动后，再执行resolve()，随后执行then使得currentIndex++;
				this.options.element.children[0].addEventListener('transitionend', function callback() {
					          this.removeEventListener('transitionend', callback);
						          that.animate = false;
						          resolve();
					 });
				dom.every(that.options.element.children, section =>{
					section.style.transform = `translateY(${-100 * targetIndex}%)`;
				})
			}
		})
	}
}