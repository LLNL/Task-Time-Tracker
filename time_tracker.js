//
//  Global
//  The ID of the currently running timer interval.
var IntervalID = 0;


//------------------------------------------------------------------------------
//
//  Retrieve the TaskArr JSON string from DOM storage, convert it into a
//  JavaScript object, and return it.  If there is no TaskArr in DOM storage, 
//  return an empty JavaScript object.
//
//------------------------------------------------------------------------------
function RetrieveTaskArr ( ) {
    var TaskArr_JSON = "",
        TaskArr = {};

    if ( localStorage.getItem("TaskArr") )
    {
        TaskArr_JSON = localStorage.getItem("TaskArr");
        TaskArr      = JSON.parse(TaskArr_JSON);
    }

    return ( TaskArr );

} // RetrieveTaskArr


//------------------------------------------------------------------------------
//
//  Convert the TaskArr to JSON and save it to local DOM storage.
//
//------------------------------------------------------------------------------
function SaveTaskArr ( TaskArr ) {
    var TaskArr_JSON = JSON.stringify(TaskArr);

    localStorage.setItem("TaskArr", TaskArr_JSON);

} // SaveTaskArr


//------------------------------------------------------------------------------
//
//  Via CSS, make the task chiclet appear active.
//
//------------------------------------------------------------------------------
function ActivateTask ( TaskName ) {
    var TaskObj = $("#" + TaskName + ">table" );

    if ( TaskObj.hasClass("task_mouseover") )
    {
        TaskObj.removeClass( "task_mouseover" )
               .addClass( "task_current_mouseover" );
    }

} // ActivateTask


//------------------------------------------------------------------------------
//
//  Via CSS, make the task chiclet appear inactive.
//
//------------------------------------------------------------------------------
function DeactivateTask ( TaskName ) {
    var TaskObj = $("#" + TaskName + ">table" );

    if ( TaskObj.hasClass("task_current_mouseover") )
    {
        TaskObj.removeClass( "task_current_mouseover" ).
                addClass( "task_mouseover" );
    }
    else if ( TaskObj.hasClass("task_current") )
    {
        TaskObj.removeClass( "task_current" )
               .addClass( "task_inactive" );
    }

} // DeactivateTask


//------------------------------------------------------------------------------
//
//  Stop the currently active task and, if the user clicked on an inactive task,
//  start that task's timer.
//
//------------------------------------------------------------------------------
function StartTimer ( event ) {
    var TaskName = $(this).attr("id"),
        $this    = $(this),
        Timer;

    if (IntervalID != 0)
    {
        //  Stop the currently running timer
        clearInterval( IntervalID );
        IntervalID = 0;
    }
    
    if ( $this.attr("id") == localStorage.CurrentTask )
    {
        //  User clicked on the current task.  Clear the current task, and be
        //  done.
        DeactivateTask ( localStorage.CurrentTask );
        localStorage.setItem( "CurrentTask", "" );

    }
    else
    {
        //
        //  User clicked on a task other than the current task.  Start the timer
        //  and record which task is the current one.
        IntervalID = setInterval(function () {
            var TaskArr_JSON = "",
                TaskArr      = {},
                TaskSeconds  = 0,
                TaskMinutes  = 0,
                TaskHours    = 0,
                TaskTimer,
                Timer = $this.find( "#timer" );

            TaskArr     = RetrieveTaskArr();
            TaskTimer   = TaskArr[TaskName];
            TaskSeconds = parseInt(TaskTimer.Seconds);
            TaskMinutes = parseInt(TaskTimer.Minutes);
            TaskHours   = parseInt(TaskTimer.Hours);

            //
            //  Add one second to the timer.
            if ( TaskSeconds == 59 )
            {
                TaskSeconds = 0;
                if ( TaskMinutes == 59 )
                {
                    TaskMinutes = 0;
                    TaskHours++;
                }
                else
                {
                    TaskMinutes++;
                }
            }
            else
            {
                TaskSeconds++;
            }

            //
            //  Update the timer in the DOM.
            Timer.text(TaskHours + ":" + TaskMinutes + ":" + TaskSeconds);

            //
            //  Save the updated timer to the TaskArr in local DOM storage.
            TaskTimer.Seconds = TaskSeconds.toString();
            TaskTimer.Minutes = TaskMinutes.toString();
            TaskTimer.Hours   = TaskHours.toString();
            TaskArr[TaskName] = TaskTimer;
            SaveTaskArr ( TaskArr );
        }, 1000); // SetInterval

        //
        //  Deactivate the previously current task, if there was one, record the
        //  new current task's name, and active the new current task.
        if ( localStorage.getItem("CurrentTask") )
        {
            DeactivateTask ( localStorage.CurrentTask );
        }
        localStorage.CurrentTask = $this.attr("id");
        ActivateTask ( localStorage.CurrentTask );

    } // End of if ( $this.attr("id") == localStorage.CurrentTask )

}  // StartTimer


//------------------------------------------------------------------------------
//
//  Remove a task from the DOM and from local DOM storage.
//
//------------------------------------------------------------------------------
function RemoveTask ( event ) {
    var $this     = $(this),
        ID        = $this.attr("id"),
        TaskArr,
        TaskDelim = ID.lastIndexOf('_'),
        TaskName = ID.substring(0,TaskDelim);

    //
    //  Remove the Task from DOM storage.
    TaskArr = RetrieveTaskArr();
    delete TaskArr[TaskName];
    SaveTaskArr( TaskArr );

    if ( localStorage.CurrentTask == TaskName )
    {
        //
        //  If the task we're removing is the CurrentTask,
        //  stop the timer and clear the related IntervalID.
        clearInterval( IntervalID );
        IntervalID = 0;
        localStorage.CurrentTask = "";
    }

    //
    //  By removing the parent DIV, we remove the entire task from the DOM.
    $this.parent().remove();

} // RemoveTask


//------------------------------------------------------------------------------
//
//  Via CSS, highlight the task chiclet currently under the curser.
//
//------------------------------------------------------------------------------
function MouseEnterTask ( event ) {
    var $this = $(this);

    if ( $this.hasClass("task_inactive") )
    {
        $this.removeClass( "task_inactive" )
             .addClass( "task_mouseover" );
    }
    else if ( $this.hasClass("task_current") )
    {
        $this.removeClass( "task_current" )
             .addClass( "task_current_mouseover" );
    }

} // MouseEnterTask


//------------------------------------------------------------------------------
//
//  Set the CSS of the task chiclet to un-highlighted.
//
//------------------------------------------------------------------------------
function MouseLeaveTask ( event ) {
    var $this = $(this);

    if ( $this.hasClass("task_mouseover") )
    {
        $this.removeClass( "task_mouseover" )
             .addClass( "task_inactive" );
    }
    else if ( $this.hasClass("task_current_mouseover") )
    {
        $this.removeClass( "task_current_mouseover" )
             .addClass( "task_current" );
    }

} // MouseLeaveTask


//------------------------------------------------------------------------------
//
//  Add a task to the TaskArr in local DOM storage and to the DOM.
//
//------------------------------------------------------------------------------
function AddTask ( TaskName, Timer ) {
    var CloseButton,
        MainTaskDiv,
        Task,
        TaskArr_JSON,
        TaskArr = {};

    if ( TaskName.length > 0 )
    {
        //
        //  Retrieve the TaskArr from local DOM storage and check whether this
        //  task already exists.
        TaskArr = RetrieveTaskArr();

        if ( $("#" + TaskName).length > 0 )
        {
            //
            //  Let the user know that this task already exists.
            alert ( "That task already exists!" );
            return;
        }
        else
        {
            //
            //  If we haven't yet run across this task, save it into local DOM
            //  storage.
            //  Note:  the task may be in local DOM storage from a previous page
            //  instance even though it's not in the DOM.
            if ( ! (TaskName in TaskArr) )
            {
                TaskArr[TaskName] = Timer;
                SaveTaskArr ( TaskArr );
            }

            //
            //  Add the task chiclet to the DOM.
            MainTaskDiv = $( '<div id="' + TaskName +
                             '_main" class="main_task_div"></div>' );
            CloseButton = $( '<div id="' + TaskName + '_remove"' +
                             'class="close_task_div">&otimes;</div>' );
            Task = $( '<div id="' + TaskName + '" class="task_div">' +
                      '  <table class="task_inactive">'              +
                      '      <tr>'                +
                      '          <td>' + TaskName + '</td>'          +
                      '      </tr>'               +
                      '      <tr>'                +
                      '          <td id="timer">' +
                                    Timer.Hours   + ':' +
                                    Timer.Minutes + ':' +
                                    Timer.Seconds +
                      '          </td>'           +
                      '      </tr>'               +
                      '  </table>'                +
                      '</div>' );
            MainTaskDiv.append ( CloseButton );
            MainTaskDiv.append ( Task );

            //
            //  Add click handlers.
            CloseButton.click ( RemoveTask );
            Task.click ( StartTimer );
            Task.children('table').hover( MouseEnterTask, MouseLeaveTask );

            //
            //  Add to the DOM.
            $( "#TaskList" ).append( MainTaskDiv );

        } // End of if ( $("#" + TaskName).length > 0 )

    } // End of if ( TaskName.length > 0 )

} // AddTask 


//------------------------------------------------------------------------------
//
//  Submit handler for task submission form at top of page.
//
//------------------------------------------------------------------------------
function SubmitTask ( event ) {
    var TaskName = $( "#TaskName" ).val();

    event.preventDefault();
    event.stopPropagation();

    //
    //  Add the task to local DOM storage and to the DOM.
    AddTask ( TaskName, { Hours: 0, Minutes: 0, Seconds: 0 } );

} // SubmitTask


//------------------------------------------------------------------------------
//
//  Run once the DOM is fully rendered.  This is basically main().
//
//------------------------------------------------------------------------------
$(document).ready(function () {
    var TaskArr;

    //
    //  Submit handler for the task form.
    $( "#TaskForm" ).submit( SubmitTask );

    //
    //  Looks like a previous instance of this program stored some tasks in DOM
    //  storage.  Retrieve and display them.
    TaskArr = RetrieveTaskArr();
    for ( var Task in TaskArr )
    {
        AddTask ( Task, TaskArr[Task] );
    }

}); // $(document).ready()

//
// vim: ts=4 sw=4 expandtab
//
