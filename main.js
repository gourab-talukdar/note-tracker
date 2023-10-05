const addNoteBtn = document.querySelector(".add-Btn-Container button");
const noteContainer = document.querySelector(".note-container");

let noteTitlesArr = [];
let noteDetailsArr = [];
let noteDateArr = [];

// // ---------------------------------defining the function to SET ALL DATA of NOTE NODES to LOCAL STORAGE
function setDataToLS(){
	
	localStorage.setItem("noteTitlesArr", JSON.stringify(noteTitlesArr));
	localStorage.setItem("noteDetailsArr", JSON.stringify(noteDetailsArr));
	localStorage.setItem("noteDateArr", JSON.stringify(noteDateArr));
}
// // ---------------------------------defining the function to GET ALL DATA FROM A NOTE NODE when clicked on SAVE BUTTON
function getData(index, noteTitleValue, noteDetailsValue, noteDate){
	noteTitlesArr[index] = noteTitleValue;
	noteDetailsArr[index] = noteDetailsValue;
	noteDateArr[index] = noteDate;
	setDataToLS();
}
// // ---------------------------------defining the function to SET NEW DATE, when user creates a new note or saves a note
function setDate(noteNode){
	let today = new Date();
	let day = today.getDate() < 10 ? "0"+today.getDate() : today.getDate(); 
	let month = today.getMonth() < 10 ? "0"+(today.getMonth()+1) : today.getMonth()+1; 
	let year = today.getFullYear();

	noteNode.querySelector(".meta-container small").textContent = `${day}/${month}/${year}`;
	return `${day}/${month}/${year}`;
}
// // ------------------------------------------defining the function to ADD NEW NOTE
function addNewNote(){
	const noteHTML = `<div class="note">
                <div class="meta-container">
                    <small></small>
                    <div class="edit-container">
                        <button class="edit-btn"><i class="far fa-edit"></i></button>
                        <button class="del-btn"><i class="far fa-trash-alt"></i></button>
                    </div>
                </div> 
                
                <div class="note-title-container">
                    <input placeholder="Title here..."></input>
                </div>
                
                <div class="note-details-container">
                    <textarea placeholder="Type your note..."></textarea>
                </div>
                
                <button class="save-btn">Save</button>
            </div>`;

    noteContainer.insertAdjacentHTML("beforeend",noteHTML);
    setDate(noteContainer.lastElementChild);
}

// // ------------------------------------------defining the function to DELETE any NOTE
function deleteNote(){
	let delBtns = noteContainer.querySelectorAll(".edit-container .del-btn");
	
	delBtns.forEach(function(delBtn, index){
		delBtn.onclick = () => {

			noteTitlesArr.splice(index,1);
			noteDetailsArr.splice(index,1);
			noteDateArr.splice(index,1);
			
			delBtn.parentNode.parentNode.parentNode.remove();
			setDataToLS();
			// calling the below function to update index data 
			deleteNote();
			saveNote();
		}
	})
}

// // ------------------------------------------defining the function to SAVE any NOTE
function saveNote(){
	let saveBtns = noteContainer.querySelectorAll(".save-btn");

	saveBtns.forEach((saveBtn, index) =>{
		saveBtn.onclick = () => {
			let noteTitle = saveBtn.parentNode.querySelector(".note-title-container input");
			let noteDetails = saveBtn.parentNode.querySelector(".note-details-container textarea");
			let noteDate = setDate(saveBtn.parentNode);

			noteTitle.disabled = true;
			noteDetails.disabled = true;

			saveBtn.style.display = "none";
			saveBtn.parentNode.querySelector(".edit-container .edit-btn").style.display = "inline-block";

			getData(index, noteTitle.value, noteDetails.value, noteDate);
		}
	});
}

// // ------------------------------------------defining the function to EDIT any NOTE
function editNote(){
	let editBtns = noteContainer.querySelectorAll(".edit-container .edit-btn");

	editBtns.forEach((editBtn) => {
		editBtn.onclick = () => {
			let noteTitle = editBtn.parentNode.parentNode.parentNode.querySelector(".note-title-container input");
			let noteDetails = editBtn.parentNode.parentNode.parentNode.querySelector(".note-details-container textarea");

			noteTitle.disabled = false;
			noteDetails.disabled = false;

			editBtn.style.display = "none";
			editBtn.parentNode.parentNode.parentNode.querySelector(".save-btn").style.display = "block";
		}
	});
}

// //------------------------------------- EVENT LISTENER of ADD NEW NOTE btn
addNoteBtn.addEventListener("click", function(){

	if (noteContainer.lastElementChild === null) {
		addNewNote();
		deleteNote();
		saveNote();
		editNote();
	}
	else if (getComputedStyle(noteContainer.lastElementChild.querySelector(".save-btn")).display === "block" ) {
		setTimeout(function(){
			document.getElementById("error").classList.remove("error-move");
		},4000);
		document.getElementById("error").classList.add("error-move");
	}
	else{
		addNewNote();
		deleteNote();
		saveNote();
		editNote();
	}
	
});






// // ------------------------------------------defining the function to RETRIEVE  NOTE (PREVIOUSLY SAVED)
function retriveNote(i,LSNoteTitle,LSNoteDetail,LSNoteDate){

	const noteHTML = `<div class="note">
                <div class="meta-container">
                    <small>${LSNoteDate}</small>
                    <div class="edit-container">
                        <button class="edit-btn" style="display:inline-block"><i class="far fa-edit"></i></button>
                        <button class="del-btn"><i class="far fa-trash-alt"></i></button>
                    </div>
                </div> 
                
                <div class="note-title-container">
                    <input placeholder="Title here..." value="${LSNoteTitle}" disabled=true></input>
                </div>
                
                <div class="note-details-container">
                    <textarea placeholder="Type your note..." disabled=true>${LSNoteDetail}</textarea>
                </div>
                
                <button class="save-btn" style="display:none">Save</button>
            </div>`;

    noteContainer.insertAdjacentHTML("beforeend",noteHTML);

    // again storing the notes after REFRESHING the browser
   	getData(i, LSNoteTitle, LSNoteDetail, LSNoteDate);
}





// // --------------------------------------------------checking whether the previously saved data is available or not.... if YES then execute the code below---------------------------
const LSNotesTitles = JSON.parse(localStorage.getItem("noteTitlesArr"));
const LSNotesDetails = JSON.parse(localStorage.getItem("noteDetailsArr"));
const LSNotesDates = JSON.parse(localStorage.getItem("noteDateArr"));

if (LSNotesTitles || LSNotesDetails){

	for(let i=0; i<LSNotesTitles.length; i++){
		let LSNoteTitle = LSNotesTitles[i];
		let LSNoteDetail = LSNotesDetails[i];
		let LSNoteDate = LSNotesDates[i];
	
			if(LSNoteTitle === null){
				LSNoteTitle = '';
			}
				retriveNote(i,LSNoteTitle,LSNoteDetail,LSNoteDate);
	}

				deleteNote();
				saveNote();
				editNote();
				 	
}
