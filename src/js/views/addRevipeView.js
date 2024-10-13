import View from "./View";
import icons from 'url:../../img/icons.svg'; //Parcel 2

class addRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _message = 'Recipe was successfully uploaded!'
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');


    constructor(){
        //We use super because this is a child class of View
        super();
        //We want to call this function while the class of addRecipeView loads
        // this is why we call it into the constructor and we do not interfere it with the controller
        this._addHandlerShowWindow();
        this._addHandleCloseWindow();
    }

    toggleWindow(){
            this._overlay.classList.toggle('hidden');
            this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow(){
        //We use the bind method in order to define that the this method
        // points to the current object, otherwise the this method will point
        //to the event listener that is attached to(here is the button but we want the current object AddRecipeView)
        this._btnOpen.addEventListener('click',this.toggleWindow.bind(this));
    }

    _addHandleCloseWindow(){
        this._btnClose.addEventListener('click',this.toggleWindow.bind(this));
        this._overlay.addEventListener('click',this.toggleWindow.bind(this));
    }

    addHandlerUpLoad(handler){
        this._parentElement.addEventListener('submit',function(e){
            e.preventDefault();
            //Inside the new Form Data we have to determine a form, so we determine the this keyword
            // because we are inside the handler and we point to the form in nthe handler
            // of the event listener
            const dataArr = [...new FormData(this)]; //We spread it into an array in order to be able to handle it
            const data = Object.fromEntries(dataArr); //this method takes an array of entries and converts it to an object
            handler(data);
        });
    }

    _generatePrivateMarkUp(){
       
    }

}

export default new addRecipeView();