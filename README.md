![Time Tracker Logo](/images/logo.png?raw=true)

This web app will allow you to track the time you spend on various tasks.  It allows for definition of arbitrary tasks and quick transitions between tasks.  The app doesn't require an Internet connection; it runs solely in your browser without the need to contact any remote web servers.

Many studies have shown that humans aren't good at multitasking. In deference to our serially-threaded natures, this software only allows one active task at a time. This design allows you to fully focus on the task at hand.

# A Primer #

The UI for the Task Timer program aims for simplicity.  In this case, a picture is sufficient to explain how to use the program:

![A screenshot of the program's UI.](/images/UI.png?raw=true)

# Installation & Use #

There are two installation options:

* This software is tracked in a Git repo hosted by GitHub (this website).  Clone the repo and checkout the _stable_ branch.
* If the above option is gibberish, click the link in the toolbar at the top named __*x* releases__, select the most recent release, and download the source in your format of choice. 

Once you have obtained the source—either via Git or a good ol' download—open the newly downloaded file called **time_tracker.html**.

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
