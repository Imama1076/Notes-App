//Accessing DOM
let container1=document.querySelector(".container1");
let sav_btn=document.querySelector(".save");
let cancel_btn=document.querySelector(".delete");
let input_title=document.querySelector(".input-title");
let input_txt=document.querySelector(".input-note");
let note_container=document.querySelector(".create-notes");
let back_btn=document.getElementById("back-btn");
let searchValue=document.getElementById("search-input");
let searchBtn=document.getElementById("search-btn");
let note_title=document.querySelector(".note-title"); 
let note_txt=document.querySelector(".note-txt");
let show_successful_result=document.querySelector(".show-successful-result");
show_successful_result.style.display="none";
let colors=["#bfef95","#bce0ff","#ffb2b2","#ffeda5","#ebc09b"];
back_btn.style.display="none";
let clone;
 let cloneObj;
 let noteInfo=[];
window.onload=function(){
    noteInfo=JSON.parse(localStorage.getItem("NoteInfo"))||[];
    console.log(noteInfo);
    RenderResult(noteInfo);
}
//Adding event listener
searchBtn.addEventListener('click',()=>{
    show_successful_result.style.display="none";
    SearchInfo(searchValue.value);
});
input_txt.addEventListener('input',()=>{
   GenerateError(note_title,note_txt,input_txt,input_title);
});
input_title.addEventListener('input',()=>{
     GenerateError(note_title,note_txt,input_txt,input_title);
});
sav_btn.addEventListener("click",()=>{ 
    if(CheckFields(input_title,input_txt)) {
    GenerateError(note_title,note_txt,input_txt,input_title);
    } else{
    show_successful_result.style.display="block";
    show_successful_result.innerHTML="Note added successfully";
    show_successful_result.style.color="green";
        GetDateTime();
        AddNote();
    }  
});
back_btn.addEventListener('click', () => {
    show_successful_result.style.display="none";
    searchValue.value = "";
    back_btn.style.display = "none";
    container1.innerHTML = "";   // sirf notes clear
    container1.appendChild(note_container);
    RenderResult(noteInfo);      // fresh render
});

cancel_btn.addEventListener("click",()=>{
    input_title.value="";
    input_txt.value="";
});
//functions
//Function for adding note
function AddNote(){
    clone=note_container.cloneNode(true); 
    container1.appendChild(clone);
    let title=clone.querySelector(".input-title");
    title.disabled=true;
    let note=clone.querySelector(".input-note");
    note.disabled=true;
    let index=container1.children.length-1;
    let color=colors[index%colors.length];
    console.log(color)
     cloneObj={
    id:Date.now(),
    Title:title.value,
    Note:note.value,
    Color:color
   }
    noteInfo.push(cloneObj);
    clone.style.backgroundColor=color;
    input_title.value="";
    input_txt.value="";
    localStorage.getItem("NoteInfo");
   localStorage.setItem("NoteInfo",JSON.stringify(noteInfo));
//function calling another function to add editing or deleting functionality
CreateEditableBtn(clone,title,note,noteInfo,cloneObj);
}
// Function for searching note
function SearchInfo(info){
    container1.innerHTML="";
     back_btn.style.display="inline-block"; 
   let data=JSON.parse(localStorage.getItem("NoteInfo"));
   console.log(data);
    let filtered;
    filtered=data.filter(note=>note.Title.toLowerCase().includes(info.toLowerCase())||note.Note.toLowerCase().includes(info.toLowerCase()));
    if(!filtered){}
    RenderResult(filtered);
   }
// function for handling delete
   function HandleDelete(cloneObj,clone){
  noteInfo=noteInfo.filter(n=>n.id!=cloneObj.id);
   localStorage.setItem("NoteInfo",JSON.stringify(noteInfo));
    clone.remove();
}
//function for generating errors
let errorTitleMsg=document.createElement("p");
let errorNoteMsg=document.createElement("p");
function GenerateError(note_title,note_txt,note,title){
    let errorHas;
    if(title.value.trim()==""){ 
    errorTitleMsg.textContent="Empty Title Field";
    errorTitleMsg.classList.add("error-msg-styling");  
    note_title.append(errorTitleMsg);  
    errorHas=true;
    console.log("error1");
    }else{
     errorTitleMsg.remove();
    } 
    if(note.value.trim()==""){
    errorNoteMsg.textContent="Empty Note Field";
    errorNoteMsg.classList.add("error-msg-styling");  
    note_txt.append(errorNoteMsg);  
    console.log("error2");
    errorHas=true;
}else{
    errorNoteMsg.remove();
}
return errorHas;
}
function CheckFields(inputTitle,inputTxt){
    let errorHas;
   if(inputTitle.value.trim()==""||inputTxt.value.trim()==""){
   errorHas=true;
   }
else {
   errorHas=false;
   }
   return errorHas;
}

//sub functions
//function to get correct time
function GetDateTime(){  
    let dateTime=new Date();
    let date=dateTime.toLocaleDateString();
    let hours=dateTime.getHours()%12||12;// in case of 0 false  condition 
    let min=dateTime.getMinutes().toString().padStart(2,"0");
    let ampm=`${hours}:${min}${dateTime.getHours()>=12?" PM " :" AM "} `;
document.getElementById("show_date_time").innerText=date+' , '+ampm;
   }
function RenderResult(filtered){
    filtered.forEach(element => {
    clone=note_container.cloneNode(true); 
    let title=clone.querySelector(".input-title");
    title.value=element.Title;
    let note=clone.querySelector(".input-note");
    note.value=element.Note;
    note.disabled=true;
    title.disabled=true;
    container1.appendChild(clone); 
    clone.style.backgroundColor=element.Color;
    CreateEditableBtn(clone,title,note,noteInfo,element);
});
}
function CreateEditableBtn(clone,title,note,noteInfo,cloneObj){
//adding button
let edit_btn=document.createElement("button");
     edit_btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
     </svg>`
     edit_btn.title="Edit";
     edit_btn.classList.add("save");
let del_btn=document.createElement("button");
     del_btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>`
     del_btn.title="Delete";
     del_btn.classList.add("delete");

//handling visibility of note container and buttons
const save=clone.querySelector(".save");
save.style.display="none";
const cancel=clone.querySelector(".delete");
cancel.style.display="none";
clone.appendChild(edit_btn);
clone.appendChild(del_btn);
//adding event listener to edit btn
//adding event listener when user click save or delete after editing on clone template
edit_btn.addEventListener("click",()=>{
    show_successful_result.style.display="none";
    edit_btn.style.display="none";
    del_btn.style.display="none";
    save.style.display="inline-block";
    cancel.style.display="inline-block";
    note.disabled=false;
    title.disabled=false;

});
save.addEventListener(('click'),()=>{
    clone_title_box=clone.querySelector(".note-title");
    clone_note_box=clone.querySelector(".note-txt");
     if(CheckFields(title,note)) {
    console.log("error");
     note.addEventListener('input',()=>{
   GenerateError(clone_title_box,clone_note_box,note,title);
   });
  title.addEventListener('input',()=>{
     GenerateError(clone_title_box,clone_note_box,note,title);
   });
   GenerateError(clone_title_box,clone_note_box,note,title);
    }
    else{
    show_successful_result.style.display="inline-block";
    show_successful_result.innerHTML="Note updated successfully";
    show_successful_result.style.color = "green";
    cloneObj.Title=title.value;
    cloneObj.Note=note.value;
    let index=noteInfo.findIndex(n=>n.id==cloneObj.id);
    noteInfo[index]=cloneObj;
    localStorage.setItem("NoteInfo",JSON.stringify(noteInfo));
    Visibility(save,cancel,title,note,edit_btn,del_btn);
    }
});
cancel.addEventListener(('click'),()=>{
    show_successful_result.style.display="none";
    errorTitleMsg.remove();
    errorNoteMsg.remove();
    title.value=cloneObj.Title;
    note.value=cloneObj.Note;
    Visibility(save,cancel,title,note,edit_btn,del_btn);
});
del_btn.addEventListener('click',()=>{  
    show_successful_result.style.display="inline-block"; 
   show_successful_result.innerHTML="Note deleted successfully";
   show_successful_result.style.color = "red";
  HandleDelete(cloneObj,clone);
});
}
function Visibility(save,cancel,title,note,edit_btn,del_btn){
    save.style.display="none";
    cancel.style.display="none";
    title.disabled=true;
    note.disabled=true;
    edit_btn.style.display="inline-block";
    del_btn.style.display="inline-block";
}
