# virtual-keyboard
A simple keyboard with basic functionality as well as keys sounding and embedded speech recognition.

The keyboard itself is generated via js. Real keyboard is also possible to use along with the virtual one.

**Basic functionality**

when you click on the keys with symbols, these symbols are displayed in the text input window. There is a space bar
there is a CapsLock key that converts all letters to uppercase. The active and inactive state of the key is visually different
there is a Backspace key that deletes characters in front of the cursor. There is an Enter key to move to a new line
the keyboard can be hidden and displayed on the screen
in the text entry window, all the capabilities of a conventional physical keyboard are preserved: text can be typed, selected, deleted, added to the middle of the line, etc. When entering text from the physical keyboard, the text can be typed both in the language of the virtual keyboard (the preferred option) and in the language that is currently specified in the operating system
the current cursor position is displayed in the text input window as a vertical blinking line

**Shift key**

the Shift key changes the case of letters - converts lowercase to uppercase, uppercase (while holding CapsLock) converts to lowercase
the Shift key allows you to display additional characters instead of numbers and symbols of the main layout
the active and inactive states of the Shift key differ visually

**Change language en / ru**

to change the language, an additional en / ru key has been added, when you click on it, you switch between the Russian and English keyboard layouts
when switching the language, the currently set language is displayed on the en / ru key
while holding down the Shift key, additional characters of the corresponding layout are displayed on the keys and in the text input window

**Horizontal arrows to move within a line**

to move within the line added left-right arrows, clicks on which implement horizontal navigation of the cursor. Visually, the cursor position is displayed as a vertical blinking bar.
after moving the cursor position, text input / deletion occurs at the current cursor position, incl. inside line

**Illumination of virtual keyboard keys when clicking on physical keyboard keys**
