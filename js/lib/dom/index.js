let dom = {
	/**
	 * [on description]
	 * @param  {[string]}   eventType [事件]
	 * @param  {[object]}   element   [dom节点]
	 * @param  {[object]}   selector  [dom节点]
	 * @param  {Function} fn        [回调函数]
	 * @return {[object]}             [dom节点]
	 */
	on(eventType, element, selector, fn){
		/* 为节点添加事件，这里是委托事件，如果需要添加事件的节点中有子节点，那么点击后会冒泡到被委托者element节点，假如找不到，那么就会跳出循环并返回element节点，否则执行回调函数。*/
		element.addEventListener(eventType, e => {
			let el = e.target;
			while(!el.matches(selector)){
				if(el === element){
					el = null;
					break;
				}
				el = el.parentNode;
			}
			el && fn.call(el,e,el);
		});
		return element;
	},

	/**
	 * [onSwipe 移动端操作]
	 * @param  {[object]}   element [dom节点]
	 * @param  {Function} fn      [description]
	 * @return {[type]}           [description]
	 */
	onSwipe(element,fn){
		let x0,y0;
		element.addEventListener('touchstart',e => {
			x0 = e.touches[0].clientX;
			y0 = e.touches[0].clientY;
		});
		element.addEventListener('touchmove',e => {
			if(!x0 || !y0){
				return;
			}
			let xDiff = e.touches[0].clientX - x0;
			let yDiff = e.touches[1].clientY - y0;

			if(Math.abs(xDiff) > Math.abs(yDiff)){
				if(xDiff > 0){
					fn.call(element,e,'right');
				}else{
					fn.call(element,e,'left');
				}
			}else{
				if(yDiff > 0){
					fn.call(element,e,'down');
				}else{
					fn.call(element,e,'up');
				}
			}
			x0 = null;
			y0 = null;
		})
	},

	/**
	 * [index 返回节点在兄弟节点中的位置索引]
	 * @param  {[object]} element [dom]
	 * @return {[number]}         [description]
	 */
	index(element){
		let siblings = element.parentNode.children;
		for(let i = 0;i < siblings.length;i++){
			if(siblings[i] === element){
				return i;
			}
		}
		return -1;
	},

	uniqueClass(element,className){
		let children = element.parentNode.children;
		dom.every(children,el => {
			el.classList.remove(className);
		});
		element.classList.add(className);
		return element;
	},

	every(nodeList,fn){
		for(let i = 0;i < nodeList.length;i++){
			fn.call(null,nodeList[i],i);
		}
		return nodeList;
	},

	creat(html,children){
		let template = document.createElement('template');
		template.innerHTML = html.trim();
		let node = template.content.firstChild;
		if(children){
			dom.append(node,children);
		}
		return node;
	},

	append(parent,children){
		if(children.length === undefined){
			children = [children];
		}
		for(let i = 0;i < children.length;i++){
			parent.appendChild(children[i]);
		}
		return parent;
	}
}