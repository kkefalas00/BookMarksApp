// we export immediately this claas beacuse we will not create any instances of this class! 
//We will use it as a parent class of the other child view classes.
import icons from 'url:../../img/icons.svg'; //Parcel 2
export default class View{

    _data;
    render(data,render = true){
        //Guard clause for empty data
        if(!data || ( (Array.isArray(data) && data.length === 0 ) ) ) return this.renderError();

        this._data = data;
        const markup = this._generatePrivateMarkUp();

        if(!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    update(data){
        
        this._data = data;
        const newMarkup = this._generatePrivateMarkUp();

        //we have to compare this newMarkup with the exist Dom Element and if are different then we change the view
        //For this reason we have to ytransform the string newMarkup to a DOM object in order to make the comparison
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl,i)=>{
            const curEl = curElements[i];
            //console.log(curEl,newEl.isEqualNode(curEl));
            //Check if the first child of the node has empty string text value, if so then we change this text.
            // In that way we do not change the entire dom but only this text

            //update text
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = newEl.textContent;
            }

            //Update changed attributes
            if(!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(attr=>curEl.setAttribute(attr.name,attr.value));
            
        });
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        const markup = `
                    <div class="spinner">
                      <svg>
                        <use href="${icons}#icon-loader"></use>
                      </svg>
                    </div>
                  `;
                  this._clear();
                  this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    renderError(message = this._errorMessage){
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>    
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
        
    }
    renderMessage(message = this._message){
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>    
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

}