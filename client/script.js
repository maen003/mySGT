/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);
/**
 * Define all global variables here.  
 */
var student_array =[];
var calledResult = null;
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

var inputIDs = [$('#studentName'),$('#course'),$('#studentGrade')];
var student_obj = {};
var addElement = null;
var cancelElement = null;
var averageGrade = null;
var callAPI = null;
/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
    handleAddClicked(addElement);
    handleCancelClick(cancelElement);
    handleCallClicked(callAPI);
}


/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    console.log('click function is working');
    $("#addButton").click(function(){
        addElement = event.target;
    })
    $("#cancelButton").click(function(){
        cancelElement = event.target;
    })
    $('#callAPI').click(function(){
        $('.student-list-container tbody').html('');
        $('#spinner').css('display','initial');
        handleCallClicked(callAPI);
    })
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event){
    console.log('handleaddclicked working')
    $("#addButton").click(function(){
        console.log(this);
        addStudent();
        addDataToServer();
        refreshArray();
        clearAddStudentFormInputs();
    });

}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    $("#cancelButton").click(function(){
        console.log(this);
        $('#studentName').val('');
        $('#course').val('');
        $("#studentGrade").val('');
    });
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){

    if ($('#studentName').val() !== '' && $('#course').val() !== '' && $('#studentGrade').val() !== '') {
        student_obj = {
            name: $('#studentName').val(),
            course: $('#course').val(),
            grade: $('#studentGrade').val()
        };
        student_array.push(student_obj);
        updateStudentList(student_array);
    }

    // console.log(student_array.indexOf(student_obj));
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    console.log('clear func ran');
    $('#studentName').val('');
    $('#course').val('');
    $("#studentGrade").val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentobj){
        var newRow = $("<tr>");
        var newName = $('<td>').text(student_obj.name).addClass('col-xs-3 col-md-2');
        newRow.append(newName);
        var newCourse = $('<td>').text(student_obj.course).addClass('col-xs-3 col-md-2');
        newRow.append(newCourse);
        var newGrade = $('<td>').text(student_obj.grade).addClass('col-xs-3 col-md-2');
        newRow.append(newGrade);
        var newButtonDiv = $('<td>').addClass('col-xs-3 col-md-2');
        var newButton = $('<button>').addClass('btn btn-danger button').text('Remove').bind('click',deleteDataFromServer);
        newButtonDiv.append(newButton);
        newRow.append(newButtonDiv);
        $('.student-list-container tbody').append(newRow);


        var self = this;
        var targetElement = $(self).parents('button');
        var objectIndex = null;
        // console.log(targetElement);


    //
    // function removeStudent() {
    //     console.log(this.parentNode.parentNode);
    //     console.log('remove student running');
    //     var targetElement = $(this).parents('tr');
    //     $(targetElement).remove();
    //     var objectIndex = ($(this).parents('tr').index());
    //     student_array.splice(objectIndex);
    //     deleteDataFromServer()
    // }
                function deleteDataFromServer (studentObj) {
                        // refreshArray();
                    console.log('delete function running');
                    var targetElement = $(this).parents('tr');
                    var objectIndex = ($(this).parents('tr').index());
                    var delete_info = {
                        api_key: "5ImxZ0E0qV",
                        student_id: student_array[objectIndex].id
                    };
                    $.ajax({
                        dataType: 'json',
                        method: 'post',
                        url: "http://s-apis.learningfuze.com/sgt/delete",
                        data: delete_info,
                        success: function(result){
                            console.log("student deleted from database");
                            if(result.success === false) {
                                console.log('cannot delete')
                            }
                            else {
                                $(targetElement).remove();
                                student_array.splice(objectIndex);
                            }
                        }
                    })
                }



}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(arr){
    renderStudentOnDom(student_obj);
    calculateGradeAverage(student_array);
    renderGradeAverage(averageGrade);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(student_array){
    var calculatingAverage = null;
    for (var i=0;i<student_array.length;i++){
        calculatingAverage += parseFloat(student_array[i].grade);
        // $(student_array[i]).attr('id',i);
    }
    // var trimmedGrade = calculatingAverage/student_array.length;
    averageGrade = calculatingAverage/student_array.length;
    console.log(averageGrade);
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(avg){
    $(".avgGrade").text(averageGrade.toFixed(2));
}
/***************************************************************************************************
* @params {array} students   the array of students
* @returns {number} the average of all the students
function calculateGradeAverage(){
}*/


function handleCallClicked(event){
    console.log('Populate button working');
        var startingTime = (new Date()).getTime();
        console.log(this);
        $.ajax({
            dataType: 'json',
            url: 'localhost:8888/students',
            data: {
                api_key: '5ImxZ0E0qV',
                // 'force-failure':'server',
                // 'force-failure':'request'
                'force-failure':'timeout',
            },
            method: 'post',
            success: function(result){
                if (result.success === true){
                // console.log('ajax call working');
                // console.log('AJAX Success function called, with the following result:', result);
                        var activationTime = (new Date()).getTime();
                        var totalTime = activationTime - startingTime;
                calledResult = result;
                callAPI = result;
                var resultsLength = calledResult.data.length;
                    for (var i=0;i<resultsLength;i++) {
                        var name = calledResult.data[i].name;
                        var grade = calledResult.data[i].grade;
                        var course = calledResult.data[i].course;
                        var id = calledResult.data[i].id;
                     //        student_obj = {
                     //            name : $('#studentName').val(name),
                     // grade : $('#studentGrade').val(grade),
                     //    course : $('#course').val(course),
                     //        };
                        student_obj = calledResult.data[i];
                        addStudent(calledResult.data[i]);
                        student_array.push(student_obj);
                        updateStudentList(student_array);
                        // console.log(student_obj);
                        clearAddStudentFormInputs();
                    }
                    console.log(totalTime);

                console.log('List done populating');             //when ajax call is done
                timer();
                // console.log(window.performance);
            }
            else if (result.success === false) {
                $('.modal-content').text(result.error[0]);
                $('.modal').modal('show');
                }
            },
            error: function(error) {console.log('ajax call not running');
                if (error.responseText === ''){
                    $('.modal-content').text(error.statusText);
                    $('.modal').modal('show');
                }
            }
        });
}

            function timer() {
                $('#spinner').css('display','none');
            }


        function addDataToServer () {
            console.log('data function running');
            var student_info = {
                api_key: "5ImxZ0E0qV",
                name: $('#studentName').val(),
                course: $('#course').val(),
                grade: $('#studentGrade').val(),
            };
            $.ajax({
                dataType: 'json',
                url: "http://s-apis.learningfuze.com/sgt/create",
                data: student_info,
                method: 'post',
                success: function(response){
                    if ($('#studentName').val() !== '' && $('#course').val() !== '' && $('#studentGrade').val() !== '') {
                        console.log('student added');
                        $('.student-list-container tbody').append(response);
                        student_array = [];
                        student_array = calledResult.data;
                }
                else {
                        console.log('NO EMPTY BOXES!!!!!');
                        $('.modal').modal('show')
                    }
                },
                error: function(err){
                    console.log('student not added')
                }
            })

        }


            function refreshArray(){
                console.log('refreshed');
                console.log(this);
                $.ajax({
                    dataType: 'json',
                    url: 'http://s-apis.learningfuze.com/sgt/get',
                    data: {
                        api_key: '5ImxZ0E0qV'
                    },
                    method: 'post',
                    success: function(result){
                        // console.log('ajax call working');
                        // console.log('AJAX Success function called, with the following result:', result);
                        // calledResult = result;
                        // callAPI = result;
                        // var resultsLength = calledResult.data.length;
                        // for (var i=0;i<resultsLength;i++) {
                        //     student_obj = calledResult.data[i];
                        //     student_array.push(student_obj);
                        //     console.log(student_obj);
                        //     clearAddStudentFormInputs();
                        // }
                        console.log('second call working');
                        student_array = result.data;
                        // console.log(student_array)
                    },
                    error: function(err) {console.log('ajax call not running')}
                });
            }
