class Pager{
	constructor(options){
		/**
		 * [defaultOptions 配置参数]
		 * @type {Object}
		 */
		let defaultOptions = {
			element:null,
			totalPages:1,
			buttonNum:10,
			currentPage:1,
			pageQuery:'',
			templates:{
				number:'<span>%page%</span>',
				first:'<button class="first">First</button>',
				prev:'<button class="prev">Prev</button>',
				next:'<button class="next">Next</button>',
				last:'<button class="last">Last</button>',
			},
		}
		this.options = Object.assign({},defaultOptions,options);
		this.domRefs = {};
		this.currentPage = parseInt(this.options.currentPage, 10) || 1;
		this.checkOptions().init().bindEvent();
	}

	checkOptions(){
		if(!this.options.element){
			throw new Error('element is require !');
		}
		return this;
	}

	init(){
		let pager = (this.domRefs.pager = document.createElement('nav'));
		this.domRefs.first = dom.creat(this.options.templates.first);
		this.domRefs.prev = dom.creat(this.options.templates.prev);
		this.domRefs.next = dom.creat(this.options.templates.next);
		this.domRefs.last = dom.creat(this.options.templates.last);
		this._checkButtons();
		this.domRefs.navList = this._createNavlist();
		pager.appendChild(this.domRefs.first);
		pager.appendChild(this.domRefs.prev);
		pager.appendChild(this.domRefs.navList);
		pager.appendChild(this.domRefs.next);
		pager.appendChild(this.domRefs.last);
		this.options.element.appendChild(pager);
		return this;
	}

	_checkButtons(){
		if(this.currentPage === 1){
			this.domRefs.first.setAttribute('disabled','');
			this.domRefs.prev.setAttribute('disabled','');
		}else{
			this.domRefs.first.removeAttribute('disabled');
			this.domRefs.prev.removeAttribute('disabled');
		}
		if(this.currentPage === this.options.totalPages){
			this.domRefs.next.setAttribute('disabled','');
			this.domRefs.last.setAttribute('disabled','');
		}else{
			this.domRefs.next.removeAttribute('disabled');
			this.domRefs.last.removeAttribute('disabled');
		}
	}

	_createNavlist(){
		let currentPage = this.currentPage;
		console.log(currentPage);
		let {totalPages,buttonNum} = this.options;
		let startOne = Math.max(currentPage - Math.round(buttonNum / 2),1);
		let endOne = Math.min(startOne + buttonNum - 1,totalPages);
		let endTwo = Math.min(currentPage + Math.round(buttonNum / 2) - 1,totalPages);
		let startTwo = Math.max(endTwo - buttonNum + 1,1);
		let start = Math.min(startOne,startTwo);
		let end = Math.max(endOne,endTwo);
		console.log(startOne,startTwo,endOne,endTwo);

		let ul = dom.creat('<ul data-role="pageNumbers"></ul>');
		for(let i = start;i <= end;i++){
			let li = dom.creat(`<li data-page="${i}">${this.options.templates.number.replace('%page%',i)}</li>`);
			if(i === this.currentPage){
				li.classList.add('current');
				console.log(i+'1111');
			}
			ul.appendChild(li);
		}
		return ul;
	}

	bindEvent(){
		dom.on('click',this.options.element,'ul[data-role="pageNumbers"]>li',(e,el) =>{
			this.gotoPage(parseInt(el.dataset.page),10);
		});
		this.domRefs.first.addEventListener('click',() => {
			this.gotoPage(1);
		});
		this.domRefs.next.addEventListener('click',() => {
			this.gotoPage(this.currentPage + 1);
		});
		this.domRefs.prev.addEventListener('click',() => {
			this.gotoPage(this.currentPage - 1);
		});
		this.domRefs.last.addEventListener('click',() => {
			this.gotoPage(this.options.totalPages);
		});
		return this;
	}

	gotoPage(page){
		if(!page || page > this.options.totalPages || page === this.currentPage){
			return;
		};
		this.currentPage = page;
		this.reRender();
	}

	reRender(){
		this._checkButtons();
		let newNavlist = this._createNavlist();
		console.log(newNavlist);
		let oldNavlist = this.domRefs.navList;
		oldNavlist.parentNode.replaceChild(newNavlist,oldNavlist);
		this.domRefs.navList = newNavlist;
		console.log('success');
	}
}