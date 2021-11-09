
let totalQuestions = 20;
 let totalSeconds = 0;
 let name = "";

 const appState = {
   current_view: "#intro_view",
   current_question: -1,
   current_model: {},
   current_quiz: "",
   total_incorrect: 0,
   total_correct: 0

 }


 async function fetch_question(questionId, quizChoice) {
   let api_endpoint_url = "";

   if (quizChoice == "quiz1") {
     api_endpoint_url = 'https://my-json-server.typicode.com/jrameau3/Quiz1/'
   }
   else if (quizChoice == "quiz2") {
     api_endpoint_url = 'https://my-json-server.typicode.com/jrameau3/Quiz2/'
   }

   let api_endpoint = `${api_endpoint_url}/${quizChoice}/${questionId}`
   const response = await fetch(api_endpoint);
   const data = await response.json();

   appState.current_model = data;

   setQuestionView(appState);
   update_view(appState);

   document.getElementById("questionsAnswered").innerHTML = appState.total_correct + appState.total_incorrect;
   if (questionId == 1) {
     document.getElementById("currentScore").innerHTML = 0;
   }
   else {
     document.getElementById("currentScore").innerHTML = +(((appState.total_correct / (appState.total_correct + appState.total_incorrect)) * 100).toFixed(2));
   }

   return (data);
 }


 document.addEventListener('DOMContentLoaded', () => {
   appState.current_view = "#intro_view";
   appState.current_model = {
     action: "quiz1",
     action2: "quiz2"
   }

   update_view(appState);

   document.querySelector("#widget_view").onclick = (e) => {
     handle_widget_event(e)
   }
 });


 let minutesLabel = "";
 let secondsLabel = "";
 let timer = 0;

 function setTime() {
   ++totalSeconds;
   secondsLabel.innerHTML = pad(totalSeconds % 60);
   minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
 }

 function pad(val) {
   var valofString = val + "";
   if (valofString.length < 2) {
     return "0" + valofString;
   } else {
     return valofString;
   }
 }


 function handle_widget_event(e) {
   if (appState.current_view == "#intro_view") {
     userName = document.getElementById("userName").value;
     if (userName == "") {
       userName = "";
     }

     if (e.target.dataset.action == "quiz1") {
       timer = setInterval(setTime, 1000);
       minutesLabel = document.getElementById("minutes");
       secondsLabel = document.getElementById("seconds");

       appState.current_quiz = "quiz1";
       appState.current_question = 0;
       fetch_question(appState.current_question + 1, appState.current_quiz);
     }
     else if (e.target.dataset.action == "quiz2") {
       timer = setInterval(setTime, 1000);
       minutesLabel = document.getElementById("minutes");
       secondsLabel = document.getElementById("seconds");

       appState.current_quiz = "quiz2";
       appState.current_question = 0;
       fetch_question(appState.current_question + 1, appState.current_quiz);
     }
   }


   if (appState.current_view == "#question_view_multiple_choice") {
     if (e.target.dataset.action == "submit") {
       let choices = document.getElementsByName("choice");
       let user_response;

       for (let i = 0; i < choices.length; i++) {
         if (choices[i].checked) {
           user_response = choices[i].value;
         }
       }

       isCorrect = check_user_response(user_response, appState.current_model);
       if (isCorrect) {
         appState.total_correct++;
       }
       else {
         appState.total_incorrect++;
       }

       setFeedbackView(isCorrect);
       update_view(appState);

     }
   }




   if (appState.current_view == "#question_view_true_false") {
     if (e.target.dataset.action == "answer") {
       isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       if (isCorrect) {
         appState.total_correct++;
       }
       else {
         appState.total_incorrect++;
       }

       setFeedbackView(isCorrect);
       update_view(appState);

     }
   }


   if (appState.current_view == "#question_view_text_input") {
     if (e.target.dataset.action == "submit") {
       user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;

       isCorrect = check_user_response(user_response, appState.current_model);
       if (isCorrect) {
         appState.total_correct++;
       }
       else {
         appState.total_incorrect++;
       }

       setFeedbackView(isCorrect);
       update_view(appState);
     }
   }




   if (appState.current_view == "#end_view") {
     clearInterval(timer);

     let finalScore = +(((appState.total_correct / (appState.total_incorrect + appState.total_correct)) * 100).toFixed(2));
     if (finalScore >= 80) {
       document.getElementById("endMessage").innerHTML = "Final Score: " + finalScore + "%<br>Congrats, " + userName + " - you passed!";
     }
     else {
       document.getElementById("endMessage").innerHTML = "Final Score: " + finalScore + "%<br>Sorry, " + userName + " - you failed.";
     }

     if (e.target.dataset.action == "home_page") {
       totalSeconds = 0;
       secondsLabel.innerHTML = pad(0);
       minutesLabel.innerHTML = pad(0);

       appState.current_view = "#intro_view";
       appState.current_question = -1,
         appState.current_quiz = "",
         appState.current_model = {},
         appState.total_correct = 0,
         appState.total_incorrect = 0
       appState.current_model = {
         action: "quiz1",
         action2: "quiz2"
       }
       update_view(appState);
     }
     else if (e.target.dataset.action == "retake") {
       totalSeconds = 0;
       secondsLabel.innerHTML = pad(0);
       minutesLabel.innerHTML = pad(0);
       timer = setInterval(setTime, 1000);

       appState.current_question = 0,
         appState.total_correct = 0,
         appState.total_incorrect = 0
       fetch_question(appState.current_question + 1, appState.current_quiz);
     }
   }

 }


 function check_user_response(user_answer, model) {
   if (appState.current_model.questionType == "multiple_choice" || appState.current_model.questionType == "true_false") {
     if (JSON.stringify(user_answer) === JSON.stringify(model.correctAnswer)) {
       return true;
     }
   }
   else {
     if (user_answer == model.correctAnswer) {
       return true;
     }
   }
   return false;
 }

 function updateQuestion(appState) {
   if (appState.current_question < (totalQuestions-1)) {
     appState.current_question = appState.current_question + 1;
     fetch_question(appState.current_question + 1, appState.current_quiz);
   }
   else {
     appState.current_question = -2;
     appState.current_model = {};
   }
 }

 function setQuestionView(appState) {
   if (appState.current_question == -2) {
     appState.current_view = "#end_view";
     return;
   }

   if (appState.current_model.questionType == "true_false") {
     appState.current_view = "#question_view_true_false";
   }
   else if (appState.current_model.questionType == "text_input") {
     appState.current_view = "#question_view_text_input";
   }
   else if (appState.current_model.questionType == "multiple_choice") {
     appState.current_view = "#question_view_multiple_choice";
   }


 }


  function setFeedbackView(isCorrect) {
   if (isCorrect == true) {
     appState.current_view = "#correct_feedback_view";
   } else {
     appState.current_view = "#incorrect_feedback_view";
   }
 }





 function nextQuestion(e) {
   updateQuestion(appState);
   setQuestionView(appState);
   update_view(appState);
 }


 function update_view(appState) {
   const html_element = render_widget(appState.current_model, appState.current_view)

   document.querySelector("#widget_view").innerHTML = html_element;
 }

 const render_widget = (model, view) => {
   template_source = document.querySelector(view).innerHTML;
   var template = Handlebars.compile(template_source);
   var html_widget_element = template({ ...model, ...appState })

   return html_widget_element
 }
