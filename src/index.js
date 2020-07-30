document.addEventListener(`DOMContentLoaded`, function(){
    console.log("DOM Content Loaded 👍🏻")
    fetchUser();
  })
  
  
  // ************ FETCH USER ***********************************************************************
  function fetchUser (){
     fetch("http://localhost:3007/users")
    .then(response => response.json())
    .then(function(data){
      data.forEach(user => {
        renderUserOnDom(user)
      });
  
    });
  }
  // ************ FETCH ADVICE ***********************************************************************
  function fetchAdvice(){
  fetch(`https://api.adviceslip.com/advice`)
  .then(response => response.json())
  .then(renderAdvice)
  }
  // ************* GLOBAL CONST **********************************************************************
  const userDiv = document.getElementById("user-div")
  const mainDiv = document.getElementById("main")
  const pTag = document.createElement("p")
  mainDiv.append(pTag)
  
  const saveBtn = document.createElement("button")
  saveBtn.className = "save-btn"
  saveBtn.innerText = "SAVE"
  mainDiv.append(saveBtn)
  
  const savedAdvice = document.getElementById("saved-advice")
  const userform = document.querySelector("#new-user-form")
  const body = document.querySelector("body")
  
  // ************** NEW USER **********************************************************************
  function newUser(){
  console.log("Nice!");
    let name = document.querySelector(".form-name").value
    console.log("newUser ✅");
    fetch(`http://localhost:3007/users`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
          name: name
      })
    })
    .then(resp => resp.json())
    .then(fetchUser)
  }
  // ************** RENDER USER **********************************************************************
  function renderUserOnDom(user){
  console.log("renderUserOnDom ✅");
    const p = document.createElement('p')
    p.className = `userClass`
    p.id = user.id
    saveBtn.id = user.id
    p.innerHTML =
    `
    <button class = "btn btn-danger"> Goodbuy ${user.name} </button>
    `
    userDiv.append(p)
    userform.remove()
  
    function renderAdviceBtn(){
    const giveAdviceBtn = document.createElement("button")
    // giveAdviceBtn.innerText = "Give Me Advice"
    giveAdviceBtn.className = "cookie"
    giveAdviceBtn.id = user.id
    userDiv.append(giveAdviceBtn)
  }
    renderAdviceBtn();
  }
  // *************** DELETE USER + LISTENER *********************************************************************
  userDiv.addEventListener("click" , function(){
    const userId = event.target.parentElement.id
  
    if (event.target.className == "btn btn-danger"){
      deleteUser(userId);
    }
  })
  
  function deleteUser(userId){
  
    fetch(`http://localhost:3007/users/${userId}`,{
      method: "DELETE",
    })
    .then(res => res.json())
    .then(event.target.parentElement.remove())
  
    location.reload()
  }
  // ***************** RENDER ADVICE *******************************************************************
  function renderAdvice (data){
    let i = data.slip.advice;
    console.log(i)
    pTag.innerHTML = `${i}`
  };
  // ***************** SAVE ADVICE *******************************************************************\
  
  saveBtn.addEventListener('click', saveThisAdvice)
  
  function saveThisAdvice (event) {
    console.log("You are inside listener function")
  
    event.preventDefault()
    if (event.target.classList.contains("save-btn")) {
  
    fetch(`http://localhost:3007/advices`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: pTag.innerHTML, user_id: saveBtn.id}) //<-------------------------------
    })
    .then(response => response.json())
    .then(fetchUserAdvices)
    }
  }
  
  function fetchUserAdvices(){
  console.log("fetchUserAdvices ✅")
  fetch(`http://localhost:3007/users/${saveBtn.id}`)
  .then(response => response.json())
  .then(renderUserAdvices)
  }
  
  function renderUserAdvices (data) {
  savedAdvice.innerHTML = ``
  console.log(data.advices)
  
  data.advices.forEach(function(advice) {
    const userAdvice = document.createElement("p")
    const userAdviceDiv = document.createElement("div")
    const deleteAdviceBtn = document.createElement("button")
    const likeAdviceBtn = document.createElement("button")
  
    savedAdvice.append(userAdviceDiv)
    userAdviceDiv.append(userAdvice, deleteAdviceBtn, likeAdviceBtn)
    userAdvice.innerText = advice.content
    deleteAdviceBtn.innerText = "♻️"
    deleteAdviceBtn.className = "btn btn-outline-info"
    likeAdviceBtn.innerText = `${advice.likes}`
    likeAdviceBtn.className = "btn btn-outline-warning"  //<----------------------------- LIKES
    deleteAdviceBtn.id = `delete-${advice.id}`
    likeAdviceBtn.id = `like-${advice.id}`
  })
  }
  // *************** DELETE and LIKE ADVICE *********************************************************************
  
  function deleteOrLikeAdvice (event) {
    const adviceId = event.target.id
    let likesNowBtn = document.getElementById(`${adviceId}`)
    let likesNowBtnValue = likesNowBtn.innerText
    likesNowBtnValue++
  
    splitAdviceId = adviceId.split("-")[1]
    console.log(likesNowBtnValue)
  
    if (event.target.innerText == "♻️") {
      event.target.parentElement.remove()
      fetch(`http://localhost:3007/advices/${splitAdviceId}`,{ method: "DELETE"})
    } else {
  
      fetch(`http://localhost:3007/advices/${splitAdviceId}`, {
          method: "PATCH",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
          likes: likesNowBtnValue
          })
      })
      .then(res => res.json())
      .then(renderNewLikes)
  
    }
  }
  
  function renderNewLikes(data){
  let newLikesNowBtn = document.getElementById(`like-${data.id}`)
  newLikesNowBtn.innerHTML = data.likes
  console.log(data)
  }
  // *************** LISTENERS *********************************************************************
  // DELETE and LIKE ADVICE
  savedAdvice.addEventListener("click", deleteOrLikeAdvice)
  // GIVE ADVICE
  userDiv.addEventListener("click" , function(){
    event.preventDefault();
  
    if (event.target.className === "cookie")
    {
  
      fetchAdvice();
    }
  })
  // SUBMIT USER
  userform.addEventListener("click" , function(){
    event.preventDefault();
    if (event.target.innerText == "Submit")
    {
      newUser();
    }
  })
  // ************************************************************************************
  