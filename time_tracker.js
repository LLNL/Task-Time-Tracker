var IntervalID = 0,
    CurrentTask = "",
    count = 0;

function StartTimer ( event ) {
    var TaskName = $(this).attr("id"),
        Timer;

    if (IntervalID != 0)
    {
        //  Stop the currently running timer
        clearInterval( IntervalID );
    }
    
    if ( $(this).attr("id") == CurrentTask )
    {
        //  User clicked on the current task.  Just stop the timer,
        //  clear the current task, and be done.
        CurrentTask = "";
        localStorage.CurrentTask = CurrentTask;
    }
    else
    {
        // User clicked on a task other than the current task.  Start the timer
        // and record which task is the current one.
        Timer = $(this).find( "#timer" );
        IntervalID = setInterval(function () {
            var TaskArr_JSON = "",
                TaskArr      = {},
                TaskTime;

            if ( localStorage.getItem("TaskArr") )
            {
                TaskArr_JSON = localStorage.getItem("TaskArr");
                TaskArr      = JSON.parse(TaskArr_JSON);
            }

            TaskTime = parseInt(TaskArr[TaskName]);
            TaskTime++;
            Timer.text(TaskTime);

            TaskArr[TaskName] = TaskTime.toString();
            TaskArr_JSON = JSON.stringify(TaskArr);
            localStorage.setItem("TaskArr", TaskArr_JSON);
        }, 1000);

        CurrentTask = $(this).attr("id");
        localStorage.CurrentTask = CurrentTask;
    }
}

function AddTask ( TaskName, Timer ) {
    var Task,
        TaskArr_JSON,
        TaskArr = {};

    if ( TaskName != "" )
    {
        if ( localStorage.getItem("TaskArr") )
        {
            TaskArr_JSON = localStorage.getItem("TaskArr");
            TaskArr = JSON.parse(TaskArr_JSON);
        }

        if ( ! (TaskName in TaskArr) )
        {
            TaskArr[TaskName] = Timer;
            TaskArr_JSON = JSON.stringify(TaskArr);
            localStorage.setItem("TaskArr", TaskArr_JSON);
        }


        if ( $("#" + TaskName).length != 0 )
        {
            alert ( "That task already exists!" );
        }
        else
        {
            Task = $( '<div id="' + TaskName + '">' +
                      '  <table>'            +
                      '      <tr>'           +
                      '          <td>' + TaskName + '</td>' +
                      '      </tr>'          +
                      '      <tr>'           +
                      '          <td id="timer">' + Timer + '</td>' +
                      '      </tr>'          +
                      '  </table>'           +
                      '</div>' );
            Task.click ( StartTimer );
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
    var TaskArr_JSON,
        TaskArr;

    $( "#TaskForm" ).submit( SubmitTask );

    if ( localStorage.getItem("TaskArr") )
    {
        TaskArr_JSON = localStorage.getItem("TaskArr");
        TaskArr = JSON.parse(TaskArr_JSON);
        for ( var key in TaskArr )
        {
            AddTask ( key, TaskArr[key] );
        }
    }
});

//
// vim: ts=4 sw=4 expandtab
//
