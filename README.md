# Turbo Pascal Tetris
This is an attempt to get old source code to run and port it to a web application using LLMs

## OCR the source scan
The scanned source code (img/Tetris.pas.pdf) was converted to ascii text, using LlamaIndex. Other OCR software that I have tested (tesseract, ilovepdf.com) were not able to handle the indentations of the code.

## Build Pascal
The code built right from the scratch, using freepascal.org under Windows 10. Under Linux the units graph, crt and dos were missing.

## Convert to Javascript
Copilot did a working Javascript version right in the first attempt. Functionally it is similar. The layout is a bit different the original.

You can play it here:
https://misuco.github.io/TurboPascalTetris/web/

