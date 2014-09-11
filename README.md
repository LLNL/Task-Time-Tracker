![Time Tracker Logo](https://bytebucket.org/gcleary/time-tracker/wiki/logo.png?token=c68132f516be369e2ee218c1842963302f4ab2bb)

This web app will allow you to track the time you spend on various tasks.  It allows for definition of arbitrary tasks and quick transitions between tasks.  The app doesn't require an Internet connection; it runs solely in your browser without the need to contact any remote web servers.

# A Primer #

The UI for the Task Timer program aims for simplicity.  In this case, a picture is sufficient to explain how to use the program:

![A screenshot of the program's UI.](https://bytebucket.org/gcleary/time-tracker/wiki/UI.png?token=35f47d092208b5edcd02f8721ba4633df6d0c108)

# Installation & Use #

There are two installation options:

* This software is tracked in a Git repo hosted by Bitbucket (this website).  Clone the repo and checkout the stable branch.
* If the above option is gibberish, click the link the the sidebar to the left called *Downloads*, select the tab called *Tags*, and download the most recent version. 

Once you have downloaded—either via Git or a good ol' download—the program to your computer, open the newly downloaded file called **time_tracker.html**.

# Supported Browsers #

* Safari 6+
* Chrome 21+
* Firefox 22+
* Opera 12.1
* IE 10+*

**I have not tested functionality on IE.  I believe it may work, but don't know for sure.*

# A Note On Timer Accuracy #

This time tracker program is not meant to be used for tasks where absolute, to-the-second timer accuracy is necessary.  If you need to know how long a task takes down to the second, **do not** use this app.

Web browsers were not made to be timepieces; keeping time is a very low priority for them.  As such, the task timers you define with this program *may* lose several seconds every hour.

The 'why' behind this is beyond the scope of this article.  For the technically inclined, here is some further reading:

* [Accuracy of JavaScript Time](http://ejohn.org/blog/accuracy-of-javascript-time/)
* [How JavaScript Timers Work](http://ejohn.org/blog/how-javascript-timers-work/)

## Software License ##

This Time Tracker program is free, open-source software offered under the GNU Public License, Version 2.  A copy of the Software License is distributed with the software.