/**
 * @param {String} el
 * @param {String} classNames
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param {..array} dataAttr
 * 
 */

 export default function create(el, classNames, child, parent, ...dataAttr) { //dataattr -> ['id', 'menu'] , ['code', '']
  let element = null;     
  try{
    element = document.createElement(el);
  } catch (error){
    throw new Error ('Can not create Element!');
  }
  if (classNames) element.classList.add(...classNames.split(' ')); //['class1', 'class2'] создаем массив и сразу ... высыпаем  массив
  if(child && Array.isArray(child)){
    child.forEach((childElement)=> childElement && element.appendChild(childElement));
  } else if (child && typeof child === 'object'){
    element.appendChild(child);
  } else if (child && typeof child === 'string'){
    element.innerHTML = child;
  } 
  if(parent){
    parent.appendChild(element);
  }
  //<span id=''(нативный аттр) data-code=''(кастомный аттрибут через el.dataset.code) disabled ></span>
  if(dataAttr.length){ //есть массив и он не пустой
    dataAttr.forEach(([attrName, attrValue]) => {
      if(attrValue === ''){
        element.setAttribute(attrName, '');
      } else {
        if(attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)){
          element.setAttribute(attrName, attrValue);
        } else {
          //значит data attr
          element.dataset[attrName] = attrValue;
        }
      }
    });
  }
  return element;
}

