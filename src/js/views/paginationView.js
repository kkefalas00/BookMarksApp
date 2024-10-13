import View from "./View";
import icons from 'url:../../img/icons.svg'; //Parcel 2

class paginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            //Guard clause
            if(!btn) return;
            //From dataset we can retrive all the custome data attributes we created
            const goToPage = +btn.dataset.goto; //convert the string value to number
            handler(goToPage);
        })
    }
    _generatePrivateMarkUp(){
        const curpage = this._data.page;
        //Round to the next integer
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); 
    
        //page 1, and the are other pages
        if (curpage === 1 && numPages > 1){
            return `
                    <button data-goto="${curpage + 1}" class="btn--inline pagination__btn--next">
                        <span>Page ${curpage + 1}</span>
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                        </svg>
                    </button>
            `;
        }
        // Last page 
        if(curpage === numPages && numPages > 1){
                return `
                    <button data-goto="${curpage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span>Page ${curpage - 1}</span>
                    </button>
                `;
        }
        // Other page
        if(curpage < numPages){
            return `
                    <button data-goto="${curpage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span>Page ${curpage - 1}</span>
                    </button>
                    <button data-goto="${curpage + 1}" class="btn--inline pagination__btn--next">
                        <span>Page ${curpage + 1}</span>
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                        </svg>
                    </button>
                `;
        }
         //Page 1, and there are NO other pages
         return '';
    }

}

export default new paginationView();