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
}

function SaveTaskArr ( TaskArr ) {
    var TaskArr_JSON = JSON.stringify(TaskArr);

    localStorage.setItem("TaskArr", TaskArr_JSON);
}

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
        //  User clicked on the current task.  Just stop the timer,
        //  clear the current task, and be done.
        localStorage.CurrentTask = "";
    }
    else
    {
        // User clicked on a task other than the current task.  Start the timer
        // and record which task is the current one.
        Timer = $this.find( "#timer" );
        IntervalID = setInterval(function () {
            var TaskArr_JSON = "",
                TaskArr      = {},
                TaskTime;

            TaskArr = RetrieveTaskArr();

            TaskTime = parseInt(TaskArr[TaskName]);
            TaskTime++;
            Timer.text(TaskTime);

            TaskArr[TaskName] = TaskTime.toString();
            SaveTaskArr ( TaskArr );
        }, 1000);

        localStorage.CurrentTask = $this.attr("id");
    }
}

function RemoveTask ( event ) {
    var $this     = $(this),
        ID        = $this.attr("id"),
        TaskArr,
        TaskDelim = ID.indexOf('_'),
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
    //  Remove the task and it's close target from the DOM.
    $( "#" + ID ).remove();
    $( "#" + TaskName ).remove();

}

function AddTask ( TaskName, Timer ) {
    var Task,
        TaskArr_JSON,
        TaskArr = {};

    if ( TaskName != "" )
    {
        TaskArr = RetrieveTaskArr();

        if ( ! (TaskName in TaskArr) )
        {
            TaskArr[TaskName] = Timer;
            SaveTaskArr ( TaskArr );
        }


        if ( $("#" + TaskName).length != 0 )
        {
            alert ( "That task already exists!" );
        }
        else
        {
            CloseButton = $( '<div id="' + TaskName + '_remove">'   +
                             '&#9746;</div>' );
            Task = $( '<div id="' + TaskName + '" class="task">'    +
                      '  <table>'            +
                      '      <tr>'           +
                      '          <td>' + TaskName + '</td>'         +
                      '      </tr>'          +
                      '      <tr>'           +
                      '          <td id="timer">' + Timer + '</td>' +
                      '      </tr>'          +
                      '  </table>'           +
                      '</div>' );

            //
            //  Add click handlers.
            CloseButton.click ( RemoveTask );
            Task.click ( StartTimer );

            //
            //  Add to the DOM.
            $( "#TaskList" ).append( CloseButton );
            $( "#TaskList" ).append( Task );
        }
    }
} 

function SubmitTask ( event ) {
    var TaskName = $( "#TaskName" ).val();

    event.preventDefault();
    event.stopPropagation();

    AddTask ( TaskName, 0 );
} 

$(document).ready(function () {
    var TaskArr;

    //
    //  Submit hanlder for the task form.
    $( "#TaskForm" ).submit( SubmitTask );

    //
    //  Looks like a previous instance of this program stored some tasks in DOM
    //  storage.  Retrieve and display them.
    TaskArr = RetrieveTaskArr();
    for ( var key in TaskArr )
    {
        AddTask ( key, TaskArr[key] );
    }
});

//
// vim: ts=4 sw=4 expandtab
//
