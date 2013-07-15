var IntervalID = 0,
    Timer,
    count = 0,
    TaskName,
    Task,
    CurrentTask = "",
    TaskDict = {};

function StartTimer ( event ) {
    if (IntervalID != 0)
    {
        //  Stop the currently running timer
        clearInterval( IntervalID );
    }
    
    if ( $(this).id == CurrentTask )
    {
        //  User clicked on the current task.  Just stop the timer,
        //  clear the current task, and be done.
        CurrentTask = "";
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
    }
}

function AddTask ( event ) {
    event.preventDefault();
    event.stopPropagation();
    TaskName = $( "#TaskName" ).val();
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

$(document).ready(function () {
    $( "#TaskForm" ).submit( AddTask );
});


//
// vim: ts=4 sw=4 expandtab
//
