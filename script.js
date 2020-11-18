'use strict';
import create from './utils/create.js';
//все элементы методы и функции внутри объекта
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const input = document.querySelector(".output");

const Keyboard = {
    elements:{ //это пропетис - свойство
        main: null,
        keysContainer: null,
        keys: [],
        keyboard: null,
        input: '',
        audio: null
    },
    eventHandlers:{
        getInput: null,
        getClosed: null
    },
    properties:{ //текущие состояния
        value: "",
        capsLock: false,
        shift: false,
        language: false,
        record: false,
        sound: false,
        start: 0,
        end: 0,
    }, 

    init(){ 
        const main  = create('main', '', input );
        this.elements.keyboard = create('div', 'keyboard keyboard--hidden', null, main);
        const container = create('div', 'keyboard__keys', this._createKeys(), this.elements.keyboard);

        this.elements.keysContainer = container;
        this.elements.keys = container.querySelectorAll(".keyboard__key");
        document.body.appendChild(main);

        //use keyboard for elements with .use-input class
        document.querySelectorAll('.use-input').forEach(element =>{
            element.addEventListener('focus', ()=>{
                this.open(element.value, currentValue=>{
                    element.value = currentValue;
                });
            });
            element.addEventListener('click', () => {
                this.properties.start = input.selectionStart;
                this.properties.end = input.selectionEnd;
            });
            
            element.addEventListener("keydown", key => {
            this.properties.value += key.key;
            this.open(element.value, currentValue => {
                if (this.properties.start > element.value.length) {
                element.value += currentValue.substring(currentValue.length - 1, currentValue.length);
                }
                else {
                element.value = element.value.substring(0, this.properties.start-1)
                    + currentValue.substring(this.properties.start-1, this.properties.end) 
                    + element.value.substring(this.properties.end-1, element.value.length);
                }
            });
            this.properties.start++;
            this.properties.end++;
            });
        })
    },

    _createKeys(){ //приватный метод, делает весь html
        const fragment= document.createDocumentFragment();
        
        const keyLayoutEn = [
            ['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=','+'], "Backspace",
            "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ['[', '{'], [']', '}'], 
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", [';', ':'], ["'", '"'],  "Enter",
             "Shift", "z", "x", "c", "v", "b", "n", "m", [',', '<'], ['.', '>'], ['/', '?'],
            'sound', "done", 'ru', 'record', "space", 'ArrowLeft', 'ArrowRight'
          ];
      
          const keyLayoutRu = [
            'ё', ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=','+'], "Backspace",
            "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", 'х', 'ъ', 
            "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", 'ж', 'э', "Enter",
             "Shift", "я", "ч", "с", "м", "и", "т", "ь", 'б', 'ю', ['.', ','],
            'sound', "done", 'en', 'record', "space", 'ArrowLeft', 'ArrowRight'
          ];
          //create HTML for an icon
          const createIconHtml = (iconName) =>{
              return `<i class="material-icons">${iconName}</i>`;
          };
    
        
        const updateCursorPosition = (newCursorPosition)=>{
            input.selectionStart = newCursorPosition;
            input.selectionEnd = newCursorPosition;
        };
        const moveCursor = (direction) =>{
            if (direction === 'left') {
              if (input.selectionStart !== 0) {
                input.selectionStart--;
                input.selectionEnd = input.selectionStart;
              }
            } else {
              if (input.selectionStart !== input.textLength) {
                input.selectionStart++;
                input.selectionEnd = input.selectionStart;
              }
            }

            console.log(`input.selectionStart: ${input.selectionStart}`);
        };
       

        let keyLayout;
        if(this.properties.language){
        keyLayout = keyLayoutEn;
        } else keyLayout = keyLayoutRu;
        
        keyLayout.forEach(key => {
            const keyElement =  create('button', 'keyboard__key', null, fragment,['type', 'button']);
            const insertLineBreak = ["Tab", "CapsLock", "Shift" ,'done'].indexOf(key) !== -1
                        
                    //Add real keyboard keydown     
            window.addEventListener("keydown", e => {
                if(this.properties.sound) this._startSound();
                if(typeof key === 'string') {
                if (key === e.key) {
                    keyElement.classList.add("keyboard__key-active");
                    setTimeout(() => {
                        keyElement.classList.remove("keyboard__key-active");
                    }, 150);
                   
                }
                } else {
                    if (key[0]=== e.key) {
                        keyElement.classList.add("keyboard__key-active");
                        setTimeout(() => {
                            keyElement.classList.remove("keyboard__key-active");
                        },150);
                    } 
                }
            })

           switch(key){
               case "Backspace":
                   keyElement.classList.add('keyboard__key--wide')
                   keyElement.innerHTML = createIconHtml("backspace");
  
                   keyElement.addEventListener('click',e=>{
                       this._triggerEvents("getInput")
                       let currentCursorPosition = input.selectionStart;
                       if (currentCursorPosition > 0) {
                         this.properties.value = this.properties.value.substring(0, currentCursorPosition - 1) + this.properties.value.substring(currentCursorPosition);
                         this._triggerEvents("getInput");
                         updateCursorPosition(currentCursorPosition-1);
                       }
                       
                       if(this.properties.sound) this._startSound("back");
                       input.focus(); 
                   });
                break;

                case "Tab":
                    keyElement.classList.add('keyboard__key--wide')
                    keyElement.innerHTML = createIconHtml("keyboard_tab");
   
                    keyElement.addEventListener('click',e=>{
                        let currentCursorPosition = input.selectionStart;
                        this.properties.value = this.properties.value.substring(0, currentCursorPosition) + '\t' + this.properties.value.substring(currentCursorPosition);
                        updateCursorPosition(currentCursorPosition);
                        this._triggerEvents("getInput");
                        input.focus(); 
                    });
                 break;
            
                case "en":
                keyElement.innerText = 'en';
                keyElement.addEventListener("click", () => {
                    this.properties.language = !this.properties.language;
                    this.properties.shift = false;
                    this.properties.capsLock = false;
                    if(this.properties.record) {
                        this._stopRecord(); 
                        this.properties.record = false;
                    }   
                    

                while (this.elements.keysContainer.children.length > 0) {
                    this.elements.keysContainer.children[0].remove(); 
                }
                this.elements.keysContainer.appendChild(this._createKeys());
                this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");  
                input.focus(); 
                if(this.properties.sound) this._startSound('en');  
                });
            
                break;

                case "ru":
                keyElement.innerText = 'ru';
                keyElement.addEventListener("click", () => {
                this.properties.language = !this.properties.language;
                this.properties.shift = false;
                this.properties.capsLock = false; 
                if(this.properties.record) {
                    this._stopRecord(); 
                    this.properties.record = false
                }               
                while (this.elements.keysContainer.children.length > 0) {
                this.elements.keysContainer.children[0].remove();
                }
                this.elements.keysContainer.appendChild(this._createKeys());
                this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
                input.focus(); 
                if(this.properties.sound) this._startSound('ru');
                });
                break;

                case "CapsLock":
                  keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                  keyElement.innerHTML = createIconHtml("keyboard_capslock");
  
                  keyElement.addEventListener('click',e=>{
                        this._toggleCaps();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock)
                        input.focus(); 
                       if(this.properties.sound) this._startSound("caps");

                  })
                  
                break;

             case "Shift":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                keyElement.innerHTML = '&#8679';

                keyElement.addEventListener('click',e=>{
                    this._toggleShift();
                    for (let i = 0; i<keyLayout.length; i++) {
                        if (typeof keyLayout[i] !== 'string') { 
                          keyLayout[i].reverse();
                            for (const key of this.elements.keys) {
                                  if (key.textContent === keyLayout[i][1]) {
                                    key.textContent = keyLayout[i][0];
                                  }
                            }
                        } 
                    }
                keyElement.classList.toggle('keyboard__key--active', this.properties.shift)
                if(this.properties.sound) this._startSound("shift");
                input.focus(); 
              });
              
                break;

            case "Enter":
                keyElement.classList.add('keyboard__key--wide')
                keyElement.innerHTML = createIconHtml("keyboard_return");

                keyElement.addEventListener('click',e=>{
                    let currentCursorPosition = input.selectionStart;
                    this.properties.value = this.properties.value.substring(0, currentCursorPosition) + "\n" + this.properties.value.substring(currentCursorPosition);
                    this._triggerEvents("getInput")
                    input.focus();                     
                    if(this.properties.sound) this._startSound("enter");
                });
                
                break;

             case "space":
              keyElement.classList.add('keyboard__key--extra-wide')
              keyElement.innerHTML = createIconHtml("space_bar");
  
              keyElement.addEventListener('click',e=>{
                let currentCursorPosition = input.selectionStart;
                this.properties.value = this.properties.value.substring(0, currentCursorPosition) + " " + this.properties.value.substring(currentCursorPosition);
                this._triggerEvents("getInput")
                input.focus()
                if(this.properties.sound) this._startSound("space");
              });
              
                break;

            case "sound":
                keyElement.classList.add("keyboard__key", "keyboard__key--activatable");
                keyElement.innerHTML = createIconHtml("volume_down");
                keyElement.addEventListener("click", () => {
                    this.properties.sound = !this.properties.sound;
                    this._startSound();
                    
                    keyElement.classList.toggle("keyboard__key--active", this.properties.sound);
                    input.focus(); 
                });
                break;
            
            case "record":
            keyElement.classList.add("keyboard__key", "keyboard__key--activatable");
            keyElement.innerHTML = createIconHtml("mic")
            keyElement.addEventListener("click", () => {
                this.properties.record = !this.properties.record;
                this.properties.record ? this._startRecord() : this._stopRecord();
                console.log('click on rec', this.properties.record);
                keyElement.classList.toggle("keyboard__key--active", this.properties.record);
                input.focus(); 
                })  
                      
                break;

            case "done":
              keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark')
              keyElement.innerHTML = createIconHtml("keyboard_hide");
              keyElement.addEventListener('click',e=>{
                this.close();
                this._triggerEvents("getClosed")
              })
                break;

            case 'ArrowLeft': 
                keyElement.classList.add('keyboard__key--wide', 'arrow');
                keyElement.innerHTML = '&#8701';
                keyElement.addEventListener('click',e=>{
                    moveCursor('left');
                    
                    input.focus();
                });
                break;

            case 'ArrowRight': 
                keyElement.classList.add('keyboard__key--wide','arrow');
                keyElement.innerHTML = '&#8702';
                keyElement.addEventListener("click", () => {
                    input.focus();
                    moveCursor('right');

                  });
                
                break;

            default:
                
                if(typeof key === 'string'){
                    keyElement.textContent = key.toLowerCase();
                    
                } else {
                    keyElement.textContent = !this.properties.shift ? key[0] : keyElement.textContent = key[1];
                    input.focus();
                }
                keyElement.addEventListener('click',e=>{
                   
                    input.focus();
                    let currentCursorPosition = input.selectionStart;
                    if(typeof key === 'string'){
                        if(this.properties.capsLock && this.properties.shift){

                            this.properties.value = this.properties.value.substring(0, currentCursorPosition) + key.toLowerCase() + this.properties.value.substring(currentCursorPosition);
                            } else if (this.properties.capsLock || this.properties.shift) {
                                    this.properties.value = this.properties.value.substring(0, currentCursorPosition) + key.toUpperCase() + this.properties.value.substring(currentCursorPosition);
                            } else {
                        this.properties.value = this.properties.value.substring(0, currentCursorPosition) + key.toLowerCase() + this.properties.value.substring(currentCursorPosition);
                        }
                                
                    } else {
                        this.properties.value = this.properties.value.substring(0, currentCursorPosition) + key[0] + this.properties.value.substring(currentCursorPosition);
                    }
                    
                    this._triggerEvents('getInput');
                    updateCursorPosition(currentCursorPosition+1);
                    
                    
                    if(this.properties.sound) this._startSound(key);

          
                });
                      
                break;
           }
           fragment.appendChild(keyElement);

           if (insertLineBreak) {
            fragment.insertBefore(document.createElement("br"), keyElement);
          }
    });
    return fragment;    
    },

    _triggerEvents(eventHandler){
        if(typeof this.eventHandlers[eventHandler] == 'function'){
            this.eventHandlers[eventHandler](this.properties.value);
          }
    },
    _toggleCaps(){
        this.properties.capsLock = !this.properties.capsLock;
        for( const key of this.elements.keys){
            if (key.textContent.match(/[0-9]/g) || key.childElementCount === 0){
                if(this.properties.shift){
                    key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
                } else {
                    key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }
        }
    },
    _toggleShift(){
        this.properties.shift = !this.properties.shift;
        for( const key of this.elements.keys){
            if (key.textContent.match(/[0-9]/g) || key.childElementCount === 0){
                if(this.properties.capsLock){
                    key.textContent = this.properties.shift ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
                } else 
                key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },
    _recordLanguage() {
        recognition.lang = this.properties.language ? "en-US" : "ru-RU";
    },
    
    _startRecord() {
        recognition.interimResults = true;
        this._recordLanguage();
        console.log('start rec')
      
        recognition.addEventListener("result", e => {
          const transcript = Array.from(e.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join("");
          
            //console.log(result.transcript)

            if (e.results[0].isFinal) {
              input.value += `${transcript}`;
            }
        
        });
       
            recognition.addEventListener("end", recognition.start);
            recognition.removeEventListener("end", recognition.start);
            recognition.start();
    },
      
    _stopRecord() {
        console.log('stop rec')
       // recognition.abort();
        recognition.stop();
        recognition.removeEventListener('end', recognition.start);
    },
    _startSound(key){
        if(this.properties.sound){
            // if(!key.match(/Ent|Back|Shift|Caps/) && this.container.dataset.language === 'en')  {
            switch(key){
                case "shift":
                this.elements.audio = document.querySelector('audio[data-code = "shift"]');
                break;
                case "enter":
                this.elements.audio = document.querySelector('audio[data-code = "enter"]');
                break;
                case "back":
                this.elements.audio = document.querySelector('audio[data-code = "back"]');
                case "caps":
                this.elements.audio = document.querySelector('audio[data-code = "caps"]');
                break;
                case "en":
                case "ru":
                this.elements.audio = document.querySelector('audio[data-code = "lang"]');
                    
                break;
                default:
                    this.elements.audio = document.querySelector('audio[data-code = "letter"]');
            }
            this.elements.audio.play();
            }
    },
    open(initialValue, getInput, getClosed){
        this.properties.value = initialValue || "";
        this.eventHandlers.getInput = getInput;
        this.eventHandlers.getClosed = getClosed;
        this.elements.keyboard.classList.remove('keyboard--hidden');
       
    },
    close(){
        this.properties.value = "";
        // this.eventHandlers.getInput = getInput;
        // this.eventHandlers.getClosed = getClosed;
        this.elements.keyboard.classList.add('keyboard--hidden');

    }
};
window.addEventListener("DOMContentLoaded", function(){
    Keyboard.init();     
})

        
