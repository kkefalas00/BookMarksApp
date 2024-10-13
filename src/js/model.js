//we keep all the business logic here!! we apply the MVC architecture
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE , API_KEY} from './config';
import { AJAX } from './helper.js';

//The state should contain all the data about the application
export const state = {
    recipe :{},
    search: {
        query :"",
        results : [],
        page:1,
        resultsPerPage : RES_PER_PAGE,
    },
    bookmarks:[],
}

const createRecipeObject = function(data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        //If the first part exists then the destructuring happens and the key is returned (conditionally add properies to an object)
        ...(recipe.key && {
            key : recipe.key
        }),
    };
};

export const loadRecipe = async function(id){
    try{
       const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
        //Construct a recipe
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark=>bookmark.id === id)) state.recipe.bookmarked = true
        else state.recipe.bookmarked = false;

    }catch (err){
        //We throw the error and not only console log it
        throw err;
    }
};

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        // we wiil create an array of objects of the different recipes of the search results each time
      state.search.results = data.data.recipes.map(rec =>{
            return {
                id:rec.id,
                title:rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {
                    key : rec.key
                }),
            };
        });
        state.search.page = 1;
    }catch(err){
        //We throw the error and not only console log it
        throw err;
    }
};

//Get results Per Page
export const getResultPage = function(page = state.search.page){
        //return only results the first 10 results
        state.search.page = page;
        const start = (page - 1)*state.search.resultsPerPage //0;
        const end = page*state.search.resultsPerPage //9;
        return state.search.results.slice(start,end);
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity = (ing.quantity * newServings ) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings
    });
    state.recipe.servings = newServings;
}

//Storing bookmarks in local storage 
const persistBookmarks = function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){

    //Add the recipe object to the bookmark array
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
    if(recipe.id == state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function(id){

    //Remove bookmark
    const index = state.bookmarks.findIndex(el=>el.id === id);
    state.bookmarks.splice(index,1);

    //Mark current recipe as not bookmarked
    if(id == state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}

init();

const clearBookMarks = function(){
    localStorage.clear('bookmarks');
}

export const upLoadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(entry=> entry[0].startsWith('ingredient') && entry[1] !== '').map(ing=>{
            const ingArr = ing[1].split(',').map(el=>el.trim());
            if(ingArr.length !== 3) throw new Error('Wrong ingredient format');
            
               const [quantity, unit, description] = ingArr
               return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description
                };
            });

            const recipe = {
                title:newRecipe.title,
                 source_url : newRecipe.sourceUrl,
                 image_url : newRecipe.image,
                 publisher : newRecipe.publisher,
                 cooking_time : +newRecipe.cookingTime,
                 servings : +newRecipe.servings,
                 ingredients,
             };
            const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
            state.recipe = createRecipeObject(data);
            addBookmark(state.recipe);
    }catch(err){
        throw err
    }

    
};