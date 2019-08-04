/*****************************************************************************\
 *  Copyright (C) 2014 Lawrence Livermore National Security, LLC.
 *  Produced at Lawrence Livermore National Laboratory (cf, DISCLAIMER).
 *  Written by Geoff Cleary <gcleary@llnl.gov>
 *  LLNL-CODE-642434
 *
 *  This file is part of Task Time Tracker, a client-side web app that allows
 *  you to track time spent on arbitrary tasks.
 *  For details, see <https://bitbucket.org/gcleary/time-tracker/wiki/Home>.
 *
 *  Task Time Tracker is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by the
 *  Free Software Foundation; either version 2 of the License, or (at your
 *  option) any later version.
 *
 *  Task Time Tracker is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 *  or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 *  for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with Task Time Tracker.  If not, see <http://www.gnu.org/licenses/> or
 *  write to
 *      Free Software Foundation, Inc.,
 *      59 Temple Place, Suite 330,
 *      Boston, MA 02111-1307 USA
\*****************************************************************************/

//
//  Global
//  IntervalID:  The ID of the currently running timer interval.
//  ID:  A monotonically increasing value to use for generating new task IDs.
var IntervalID = 0,
    ID = 0;



//------------------------------------------------------------------------------
//
//  Return the next Task ID to be used in the task chiclet DIV.
//
//------------------------------------------------------------------------------
function NextTaskID( )
{
    return ( ID++ );
}

//------------------------------------------------------------------------------
//
//  Retrieve the TaskArr JSON string from DOM storage, convert it into a
//  JavaScript object, and return it.  If there is no TaskArr in DOM storage, 
//  return an empty JavaScript object.
//
//------------------------------------------------------------------------------
function RetrieveTaskArr( )
{
    var TaskArr_JSON = '',
        TaskArr = {};

    if ( localStorage.getItem('TaskArr') )
    {
        TaskArr_JSON = localStorage.getItem('TaskArr');
        TaskArr      = JSON.parse(TaskArr_JSON);
    }

    return ( TaskArr );

} // RetrieveTaskArr


//------------------------------------------------------------------------------
//
//  Convert the TaskArr to JSON and save it to local DOM storage.
//
//------------------------------------------------------------------------------
function SaveTaskArr( TaskArr )
{
    var TaskArr_JSON = JSON.stringify(TaskArr);

    localStorage.setItem('TaskArr', TaskArr_JSON);

} // SaveTaskArr


//------------------------------------------------------------------------------
//
//  A linear search through the task array.  Return true if any task's name
//  matches the give TaskName. Otherwise, return false.
//
//------------------------------------------------------------------------------
function TaskAlreadyExistsinArr( TaskArr, TaskName )
{
    for ( var Task in TaskArr )
    {
        if ( TaskArr[Task].Name == TaskName )
        {
            return ( true );
        }
    }

    return ( false );

} // TaskAlreadyExistsinArr


//------------------------------------------------------------------------------
//
//  Via CSS, make the task chiclet appear active.
//
//------------------------------------------------------------------------------
function ActivateTask( TaskID )
{
    var TaskObj  = $( '#' + TaskID ),
        CloseObj = TaskObj.parent().find( '#' + TaskID + '_remove' );

    if ( TaskObj.hasClass('task_mouseover') )
    {
        TaskObj.removeClass( 'task_mouseover' )
               .addClass( 'task_current_mouseover' );
    }
    else if ( TaskObj.hasClass( 'task_inactive' ) )
    {
        TaskObj.removeClass( 'task_inactive' )
               .addClass( 'task_current' );
    }

    CloseObj.removeClass( 'close_task_div_inactive' )
            .addClass( 'close_task_div_active' );


} // ActivateTask


//------------------------------------------------------------------------------
//
//  Via CSS, make the task chiclet appear inactive.
//
//------------------------------------------------------------------------------
function DeactivateTask( TaskID )
{
    var TaskArr        = RetrieveTaskArr(),
        Task           = TaskArr[TaskID],
        TaskObj        = $( '#' + TaskID ),
        Timestamp      = parseInt( Task.Timestamp ),
        TotElapsedTime = parseInt( Task.TotElapsedTime ),
        CloseObj       = TaskObj.parent().find( '#' + TaskID + '_remove' );

    if ( TaskObj.hasClass('task_current_mouseover') )
    {
        TaskObj.removeClass( 'task_current_mouseover' ).
                addClass( 'task_mouseover' );
    }
    else if ( TaskObj.hasClass('task_current') )
    {
        TaskObj.removeClass( 'task_current' )
               .addClass( 'task_inactive' );
    }

    CloseObj.removeClass( 'close_task_div_active' )
            .addClass( 'close_task_div_inactive' );

    // Update the total elapsed time.

    Task.TotElapsedTime = ( TotElapsedTime + (Date.now()-Timestamp) ).toString();
    Task.ElapsedSince = "0";
    Task.TaskActive = false;
    TaskArr[TaskID] = Task;
    SaveTaskArr( TaskArr );

} // DeactivateTask


//------------------------------------------------------------------------------
//
//  Convert some number of millisconds to hours, minutes, and seconds and return
//  the converted value.
//
//------------------------------------------------------------------------------
function ConvertMillisecondsToHoursMinsSecs( Milliseconds )
{
    var NumMillisecondsInHour   = 3600000,
        NumMillisecondsInMinute = 60000,
        NumMillisecondsInSecond = 1000,
        Hours   = 0,
        Minutes = 0,
        Seconds = 0;

    if ( Milliseconds >= NumMillisecondsInHour )
    {
        Hours = Math.floor( Milliseconds / NumMillisecondsInHour );
        Milliseconds %= NumMillisecondsInHour;
    }
    
    if ( Milliseconds >= NumMillisecondsInMinute )
    {
        Minutes = Math.floor( Milliseconds / NumMillisecondsInMinute );
        Milliseconds %= NumMillisecondsInMinute;
    }

    if ( Milliseconds >= NumMillisecondsInSecond )
    {
        Seconds = Math.round( Milliseconds / NumMillisecondsInSecond );
    }

    return( { 'Hours'  : Hours,
              'Minutes': Minutes,
              'Seconds': Seconds } );

} // ConvertMillisecondsToHoursMinsSecs


//------------------------------------------------------------------------------
//
//  Stop the currently active task and, if the user clicked on an inactive task,
//  start that task's timer.
//
//------------------------------------------------------------------------------
function StartTimer( event )
{
    var TaskID = $(this).attr('id'),
        $this  = $(this),
        Timer;

    if (IntervalID != 0)
    {
        //  Stop the currently running timer
        clearInterval( IntervalID );
        IntervalID = 0;
    }
    
    if ( $this.attr('id') == localStorage.CurrentTaskID )
    {
        //  User clicked on the current task.  Clear the current task, and be
        //  done.
        DeactivateTask( localStorage.CurrentTaskID );
        localStorage.setItem( 'CurrentTaskID', -1 );
    }
    else
    {
        TaskArr = RetrieveTaskArr();
        // TODO
        // TaskArr[TaskID].Timestamp = Date.now().toString()?
        Task = TaskArr[TaskID];
        Task.Timestamp = Date.now().toString();
        Task.TaskActive = true;
        TaskArr[TaskID] = Task;
        SaveTaskArr( TaskArr );

        //
        //  User clicked on a task other than the current task.  Start the timer
        //  and record which task is the current one.
        IntervalID = setInterval(function() {
            var HoursMinsSecs  = {},
                Interval       = 0,
                TaskArr        = RetrieveTaskArr( );
                Task           = TaskArr[TaskID],
                TotElapsedTime = parseInt(Task.TotElapsedTime),
                TaskTimestamp  = parseInt(Task.Timestamp),
                Timer          = $this.find( '#' + TaskID + '_timer' );

            //  How long has it been since the timer was started?
            Interval = Date.now() - TaskTimestamp;

            //  Convert the total running time, in ms, to hours/mins/secs.
            HoursMinsSecs = ConvertMillisecondsToHoursMinsSecs( Interval + TotElapsedTime );

            //  Update the timer in the DOM.
            Timer.text(HoursMinsSecs.Hours + ':' + HoursMinsSecs.Minutes + ':' + HoursMinsSecs.Seconds);

            //  Save, to DOM local storage, how much time has passed since the
            //  timer was last started so that, if the window is closed while
            //  the timer is still running, we can properly restore the task
            //  when the page is re-loaded.
            Task.ElapsedSince = Interval.toString();
            TaskArr[TaskID] = Task;
            SaveTaskArr( TaskArr );
        }, 1000); // setInterval

        //
        //  Deactivate the previously current task, if there was one, record the
        //  new current task's name, and active the new current task.
        if ( localStorage.getItem('CurrentTaskID') )
        {
            if ( parseInt(localStorage.CurrentTaskID) !== -1 )
            {
                DeactivateTask( localStorage.CurrentTaskID );
            }
        }
        localStorage.setItem( 'CurrentTaskID', TaskID );
        ActivateTask( localStorage.CurrentTaskID );

    } // End of if ( $this.attr('id') == localStorage.CurrentTaskID )

}  // StartTimer


//------------------------------------------------------------------------------
//
//  Remove a task from the DOM and from local DOM storage.
//
//------------------------------------------------------------------------------
function RemoveTask( event )
{
    var $this     = $(this),
        DivID     = $this.attr('id'),
        TaskArr   = RetrieveTaskArr(),
        TaskDelim = DivID.indexOf('_'),
        TaskID    = DivID.substring(0, TaskDelim);

    //  Remove the Task from DOM storage.
    delete TaskArr[TaskID];
    SaveTaskArr( TaskArr );

    if ( localStorage.CurrentTaskID == TaskID )
    {
        //  If the task we're removing is the CurrentTaskID,
        //  stop the timer and clear the related IntervalID.
        clearInterval( IntervalID );
        IntervalID = 0;
        localStorage.setItem( 'CurrentTaskID', -1 );
    }

    //  By removing the parent DIV, we remove the entire task from the DOM.
    $this.parent().remove();

} // RemoveTask


//------------------------------------------------------------------------------
//
//  Via CSS, highlight the task chiclet currently under the curser.
//
//------------------------------------------------------------------------------
function MouseEnterTask( event )
{
    var $this       = $(this),
        DivID       = $this.attr('id'),
        TaskArr,
        TaskDelim   = DivID.indexOf('_'),
        TaskID      = DivID.substring(0, TaskDelim),
        MainTaskDiv = $this.find( '.task_div' );

    if ( MainTaskDiv.hasClass('task_inactive') )
    {
        MainTaskDiv.removeClass( 'task_inactive' )
                   .addClass( 'task_mouseover' );

    }
    else if ( MainTaskDiv.hasClass('task_current') )
    {
        MainTaskDiv.removeClass( 'task_current' )
                   .addClass( 'task_current_mouseover' );
    }

    $this.find( '#' + TaskID + '_remove' ).show();

} // MouseEnterTask


//------------------------------------------------------------------------------
//
//  Set the CSS of the task chiclet to un-highlighted.
//
//------------------------------------------------------------------------------
function MouseLeaveTask( event )
{
    var $this       = $(this),
        DivID       = $this.attr('id'),
        TaskArr,
        TaskDelim   = DivID.indexOf('_'),
        TaskID      = DivID.substring(0, TaskDelim),
        MainTaskDiv = $this.find( '.task_div' );

    if ( MainTaskDiv.hasClass('task_mouseover') )
    {
        MainTaskDiv.removeClass( 'task_mouseover' )
                   .addClass( 'task_inactive' );
    }
    else if ( MainTaskDiv.hasClass('task_current_mouseover') )
    {
        MainTaskDiv.removeClass( 'task_current_mouseover' )
                   .addClass( 'task_current' );
    }

    $this.find( '#' + TaskID + '_remove' ).hide();

} // MouseLeaveTask


//------------------------------------------------------------------------------
//
//  Add a task to the TaskArr in local DOM storage and to the DOM.
//
//------------------------------------------------------------------------------
function AddTask( TaskID, Task )
{
    var CloseButtonDiv,
		DropDiv,
        HoursMinsSecs = {},
        MainTaskDiv,
        Now,
        TaskDiv,
        TaskArr_JSON,
        TaskArr = RetrieveTaskArr(),
        Time = 0,
        TimeSinceLastActivation = 0;

    //
    //  If we haven't yet run across this task, save it into local DOM
    //  storage.
    //  Note:  the task may be in local DOM storage from a previous page
    //  instance even though it's not in the DOM.
    if ( !(TaskID in TaskArr) )
    {
        TaskArr[TaskID] = Task;
        SaveTaskArr( TaskArr );
    }

    // Recover a timer that was running when the page was last closed.
    if ( parseInt(Task.ElapsedSince) > 0 )
    {
        if ( ! Task.TaskActive )
        {
            Time = parseInt( Task.TotElapsedTime ) + parseInt( Task.ElapsedSince );
            Task.TotElapsedTime = Time.toString();
        }
        else
        {
            // An active task's state is a bit different than any of the
            // inactive tasks. The task's timestamp remains set to the time at
            // which the task was clicked/activated. The TotElapsedTime shows
            // how much time has occurred prior to the most recent activation.
            // So, for tasks that were active, determine how much time has elapsed
            // between now and the task's activation and add in the elapsed time.
            // That's the time to use when rebuilding the task chiclet and adding
            // it to the DOM.

            Now = new Date();
            TimeSinceLastActivation = Now - parseInt( Task.Timestamp );
            Task.TotElapsedTime = parseInt( Task.TotElapsedTime ) +
                                  TimeSinceLastActivation;
        }
        Task.ElapsedSince   = "0";
        Task.Timestamp      = "0";
        TaskArr[TaskID]     = Task;
        SaveTaskArr( TaskArr );
    }

    HoursMinsSecs = ConvertMillisecondsToHoursMinsSecs( parseInt(Task.TotElapsedTime) );

    //
    //  Create the task chiclet.
    MainTaskDiv = $( '<div id="' + TaskID + '_main"' +
                     'class="main_task_div"'  +
                     'data-taskid="' + TaskID + '"'  +
                     'draggable="true"></div>' );
    CloseButtonDiv = $( '<div id="' + TaskID + '_remove"' +
                     'class="close_task_div_inactive">&times;</div>' );
    TaskDiv = $( '<div id="' + TaskID + '" class="task_div task_inactive">' +
                     '<div>'              +
                          Task.Name       +
                     '</div>'             +
                     '<div id="' + TaskID + '_timer">' +
                          HoursMinsSecs.Hours    + ':' +
                          HoursMinsSecs.Minutes  + ':' +
                          HoursMinsSecs.Seconds  +
                     '</div>'             +
                 '</div>' );
	DropDiv = $( '<div id="' + TaskID + '_drop" class="drop_target"></div>' );
    MainTaskDiv.append( CloseButtonDiv );
    MainTaskDiv.append( TaskDiv );
	MainTaskDiv.append( DropDiv );

    //
    //  Add click handlers.
    CloseButtonDiv.hide();
    CloseButtonDiv.click( RemoveTask );
    TaskDiv.click( StartTimer );

    //
    //  Add combo MouseEnter and MouseLeave handler.
    MainTaskDiv.hover( MouseEnterTask, MouseLeaveTask )
               .on( 'dragstart', function(event) {
        //
        // Upon dragstart, save away the TaskID. This will be used to identify
        // which task chiclet to move upon drop.
        event.originalEvent.dataTransfer.setData( 'application/x-taskid',
                                                  $(this).data('taskid') );
    });

    //
    //  Each task chiclet has a drop target at the bottom. Add drag handlers to
    //  enable drag'n'drop.
    DropDiv.on( 'dragover dragenter', activateDropTarget )
           .on( 'dragleave', deactivateDropTarget )
           .on( 'drop', dropOnTarget );

    //
    //  Add to the DOM.
    $( '#TaskList' ).append( MainTaskDiv );

} // AddTask 


//------------------------------------------------------------------------------
//
//  The 'drop' event handler for each drop target. Each task chiclet has a drop
//  target at the bottom. In addition, there's a drop target at the very top of
//  the task list that isn't attached to a task chiclet.
//
//------------------------------------------------------------------------------
function dropOnTarget( event )
{
    var TaskID = event.originalEvent.dataTransfer.getData('application/x-taskid'),
        $theTask = $( '#' + TaskID + '_main' ),
        $this = $(this);

    //
    // Shrink the drop target back to normal size.
    $this.prop( "class", "drop_target" );

    //
    // If a task chiclet has been dropped on its own drop target, then
    // we're done here.
    if ( $theTask.data('taskid') === $this.parent().data('taskid') )
    {
        return( false );
    }

    //
    // Remove the dragged and dropped task from the DOM and reattach it in the
    // dropped location.

    $theTask.detach();

    if ( $this.prop('id') === 'top_drop' ) {
        $this.after( $theTask );
    } else {
        $this.parent().after( $theTask );
    }

    return( false );
}


//------------------------------------------------------------------------------
//
//  When a task is dragged over a drop target, enlarge the target—via CSS—to
//  indicate that the task can be dropped.
//
//------------------------------------------------------------------------------
function activateDropTarget( event )
{
	event.preventDefault();
	event.stopPropagation();

    $(this).prop( "class", "active_drop_target" );

	return false;
}


//------------------------------------------------------------------------------
//
//  Shrink a drop target when a 'dragleave' event occurs.
//
//------------------------------------------------------------------------------
function deactivateDropTarget( event )
{
	event.preventDefault();
	event.stopPropagation();

    $(this).prop( "class", "drop_target" );

	return false;
}


//------------------------------------------------------------------------------
//
//  Submit handler for task submission form at top of page.
//
//------------------------------------------------------------------------------
function SubmitTask( event )
{
    var FormTextField = $( '#Form_TaskName' ),
        StartTimerField = $( '#StartTimer' ),
        StartTimer = StartTimerField.val(),
        TaskArr,
        TaskName   = FormTextField.val(),
        TaskID     = -1;


    event.preventDefault();
    event.stopPropagation();

    //
    //  Clear the form's fields.
    FormTextField.val( '' );
    StartTimerField.val( 0 );

    if ( TaskName.length > 0 )
    {
        //
        //  Retrieve the TaskArr from local DOM storage and check whether this
        //  task already exists.
        TaskArr = RetrieveTaskArr();

        TaskExists = TaskAlreadyExistsinArr( TaskArr, TaskName );
        if ( ! TaskExists )
        {
            //
            //  Add the task to local DOM storage and to the DOM.
            TaskID = NextTaskID();
            AddTask( TaskID,
                      { 'Name'          : TaskName,
                        'Timestamp'     : 0,
                        'TotElapsedTime': 0,
                        'ElapsedSince'  : 0,
                        'TaskActive'    : false } );

            if ( StartTimer == 1 )
            {
                //
                //  The user wants the timer started once the task has been
                //  added to the DOM.  To start the timer, simulate a click
                //  event on the task chiclet.
                $( '#' + TaskID ).trigger( 'click' );
            }

        }
        else
        {
            //
            //  Let the user know that this task already exists.
            alert( 'That task already exists!' );
        }

    } // End if ( TaskName.length > 0 ) 

    return ( TaskID );

} // SubmitTask


//------------------------------------------------------------------------------
//
//  Run once the DOM is fully built.  This is basically main().
//
//------------------------------------------------------------------------------
$(document).ready(function() {
    var TaskArr,
        TaskID,
        TaskID_int;

    localStorage.setItem( 'CurrentTaskID', -1 );

    $( '#TrackTimeButton' ).on( 'click', function(event) {
        //
        //  Set the hidden form value to true to let the submit task
        //  handler know that the timer should also be started.
        $( '#StartTimer' ).val( 1 );
    });

    //
    //  Submit handler for the task form.
    $( '#TaskForm' ).submit( SubmitTask );

    //
    //  Looks like a previous instance of this program stored some tasks in DOM
    //  storage.  Retrieve and display them.
    TaskArr = RetrieveTaskArr();
    for ( TaskID in TaskArr )
    {
        //
        //  TaskID comes from an array that's been stored in JSON format.  Every
        //  scalar has been restored from JSON back into a JavaScript string.
        //  So, parse the ID into an int.
        TaskID_int = parseInt( TaskID );

        AddTask( TaskID, TaskArr[TaskID] );
        if ( TaskID_int >= ID )
        {
            //
            //  Set the global ID to one larger than the largest Task ID that we
            //  found in in local DOM storage.
            ID = TaskID_int + 1;
        }

        // If the task was active, reactivate it via a simulated click

        if ( TaskArr[TaskID].TaskActive == true )
        {
            $( '#' + TaskID ).trigger( 'click' );
        }
    }

    //
    // Activate the drop target at the top of the task list.
    $( '#top_drop' ).on( 'dragover dragenter', activateDropTarget )
                    .on( 'dragleave', deactivateDropTarget )
                    .on( 'drop', dropOnTarget ); 

}); // $(document).ready()

//
// vim: ts=4 sw=4 expandtab
//
