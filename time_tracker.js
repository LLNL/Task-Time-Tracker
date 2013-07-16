var IntervalID = 0,
    CurrentTask = "",
    Timer,
    count = 0,
    TaskName,
    Task;

function StartTimer ( event ) {
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
            count = parseInt(Timer.text());
            count++;
            Timer.text(count);
        }, 1000);

        CurrentTask = $(this).attr("id");
        localStorage.CurrentTask = CurrentTask;
    }
}

function AddTask ( TaskName ) {
    if ( TaskName != "" ) {
        Task = $( '<div id="' + TaskName + '">' +
                  '  <table>'            +
                  '      <tr>'           +
                  '          <td>' + TaskName + '</td>' +
                  '      </tr>'          +
                  '      <tr>'           +
                  '          <td id="timer">0</td>' +
                  '      </tr>'          +
                  '  </table>'           +
                  '</div>' );
        Task.click ( StartTimer );
        $( "#TaskList" ).append( Task );
    }
} 

function SubmitTask ( event ) {
    event.preventDefault();
    event.stopPropagation();

    TaskName = $( "#TaskName" ).val();
    AddTask ( TaskName );
} 

$(document).ready(function () {
    $( "#TaskForm" ).submit( SubmitTask );
    if ( localStorage.CurrentTask )
    {
        AddTask ( localStorage.CurrentTask );
    }
});

//
// vim: ts=4 sw=4 expandtab
//
