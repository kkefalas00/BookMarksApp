import * as model from "./model.js";
import recipeView from './views/recipeView.js';
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRevipeView from "./views/addRevipeView.js";
import { MODAL_CLOSE_WINDOW } from "./config.js";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//API Documentation
// https://forkify-api.herokuapp.com/v2

//Event handllers remain at the controller (these are the subscribers - code that wants to react. Simply are functions which are passing as argument s to the publisher functions)

//Controller about the rendering of one recipe
const controlRecipes = async function() {
  
    try {
      const id = window.location.hash.slice(1);
      // Guard clause
      if (!id) return;
       
        //we did not pass the renderSpinner function to model because this is a application logic not a business logic
        recipeView.renderSpinner();

        //0) Update results view to mark selected search result
        resultsView.update(model.getResultPage());
        bookmarksView.update(model.state.bookmarks);

         //1)Loading recipe
        await  model.loadRecipe(id);

        //2) Rendering recipe
        recipeView.render(model.state.recipe);

    } catch (error) {
      //Handling errors
        recipeView.renderError();
    }
};

//Second Controller about rendering the search results
const  controlSearchResults = async function() {
    try{

      //Loading Spinner at search results view
      resultsView.renderSpinner();

      //1) get search query
      const query = searchView.getQuery();
      //Guard clause
      if (!query) return ;

      //2) Load Search results
      await model.loadSearchResults(query);

      //3) Render results
      resultsView.render(model.getResultPage());

      //4) Render initial Pagination buttons
      paginationView.render(model.state.search);

    }catch(error){
      console.log(error);
    }
}

//third controler to handle the click buttons of the pagination
const controlPagination = function(goToPage){

      //1) Render New results for the Pagination after user clicking the pagination buttons
      resultsView.render(model.getResultPage(goToPage));

      //2) Re Render for the new Pagination buttons
      paginationView.render(model.state.search);
  
}

const controlServings = function(newServings) {

  //Update the recipe servings (in state)
    model.updateServings(newServings);
  //Update the recipe view(update only this part of the recipe and not only the entire view)
  recipeView.update(model.state.recipe);
}

//controller for adding bookmark
const controlAddBookmark = function(){
  //1)Add or Remove Bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  //2) upDate recipe View
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{

    //Show Render spinner
    addRevipeView.renderSpinner();
    //uploads a new Recipe
    await model.upLoadRecipe(newRecipe);
    //Render recipe
    recipeView.render(model.state.recipe);

    //Render success Message
    addRevipeView.renderMessage();

    // Render bookmar view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Going back to last page if needed
    //window.history.back();

    //Close form window
    setTimeout(function(){
      addRevipeView.toggleWindow();
    },MODAL_CLOSE_WINDOW * 1000);

  }catch(error){
    addRevipeView.renderError(error.message);
  }
}

const init = function(){
  //The subscriber is the controler 
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerbookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRevipeView.addHandlerUpLoad(controlAddRecipe);
}

init();